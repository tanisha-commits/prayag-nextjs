import { codeKey, textKey, titleCodeCandidate } from "./normalize";
import type { SheetRecord } from "./sheet";

/**
 * Pure reconciliation of sheet records against the current catalog. Produces a change set; it never
 * writes. Rules (agreed with the site owner, see docs/catalog/README.md):
 * - Identity: exact item-code key -> one product = match. A code found only in a live title or an
 *   exact name match still prevents a duplicate, but its changes need review. Several candidates =
 *   ambiguous (review). No candidate + an item code = new product. No code and no match = skipped.
 * - Existing products: only the mapping columns (category, series, collection, type) are applied,
 *   and only through an exact or admin-approved label mapping. Blank labels keep the live value.
 *   Content (description, features, colours…) is never overwritten; differences are reported.
 * - New products get their verified sheet fields only.
 */

export type MappingField = "category" | "series" | "collection" | "type";
export const MAPPING_FIELDS: MappingField[] = ["category", "series", "collection", "type"];

export interface CurrentProduct {
  publicId: string;
  title: string;
  itemCode: string | null;
  /** Category ids (our ids) the product is in; the first is primary. */
  categoryIds: number[];
  attributes: { key: string; value: string }[];
}

/** Resolution of one sheet label (per tab + column) to a category or attribute value. */
export interface LabelMapping {
  tab: string;
  field: MappingField;
  label: string;
  /** Category id for `category` labels (and type labels that are subcategories). */
  categoryId?: number;
  /** Attribute value for series / collection / type labels. */
  attribute?: { key: string; value: string };
  /**
   * exact = label equals an existing taxonomy term; approved = an admin confirmed it; new-value = an
   * attribute column the live site has no taxonomy for (the sheet value fills an empty attribute,
   * never a category). suggested / unmapped are held back until an admin decides.
   */
  basis: "exact" | "approved" | "new-value" | "suggested" | "unmapped";
  note?: string;
}

export type MatchKind = "code" | "title-code" | "name";

export type Change =
  | { action: "new"; rec: SheetRecord; categoryIds: number[]; attributes: { key: string; value: string }[] }
  | { action: "category"; rec: SheetRecord; product: CurrentProduct; match: MatchKind; set: { categoryIds?: number[]; attributes?: { key: string; value: string }[] }; contentDiffs: string[]; pending: string[] }
  | { action: "unchanged"; rec: SheetRecord; product: CurrentProduct; match: MatchKind; contentDiffs: string[] }
  /** Nothing applicable yet: waiting for label decisions (see the report's label table). */
  | { action: "pending"; rec: SheetRecord; product?: CurrentProduct; match?: MatchKind; pending: string[] }
  | { action: "review"; rec: SheetRecord; product?: CurrentProduct; candidates?: CurrentProduct[]; match?: MatchKind; reasons: string[] }
  | { action: "skip"; rec: SheetRecord; reasons: string[] };

export interface ChangeSet {
  changes: Change[];
  /** Live products the sheet does not mention: kept exactly as they are. */
  untouched: CurrentProduct[];
  counts: Record<string, number>;
}

const mappingKey = (tab: string, field: MappingField, label: string) => `${tab}|${field}|${textKey(label)}`;

export function indexMappings(maps: LabelMapping[]) {
  return new Map(maps.map((m) => [mappingKey(m.tab, m.field, m.label), m]));
}

function findCandidates(rec: SheetRecord, products: CurrentProduct[]): { kind: MatchKind; list: CurrentProduct[] } | null {
  if (rec.codeKey) {
    const byCode = products.filter((p) => codeKey(p.itemCode) === rec.codeKey);
    if (byCode.length) return { kind: "code", list: byCode };
    const byTitle = products.filter((p) => !p.itemCode && codeKey(titleCodeCandidate(p.title)) === rec.codeKey);
    if (byTitle.length) return { kind: "title-code", list: byTitle };
    return null;
  }
  const name = textKey(rec.name);
  if (!name) return null;
  const byName = products.filter((p) => textKey(p.title) === name || textKey(p.title).split(" ").includes(name));
  return byName.length ? { kind: "name", list: byName } : null;
}

/**
 * Resolve the record's mapping columns per field: verified labels give targets; unverified ones are
 * returned as `pending` and hold back only their own field.
 */
function resolveMapping(rec: SheetRecord, maps: Map<string, LabelMapping>) {
  const categoryIds: number[] = [];
  const attributes: { key: string; value: string }[] = [];
  const pending: string[] = [];
  let categoryPending = false;
  for (const field of MAPPING_FIELDS) {
    const label = rec[field];
    if (!label) continue;
    const m = maps.get(mappingKey(rec.tab, field, label));
    if (!m || m.basis === "unmapped" || m.basis === "suggested") {
      pending.push(`${field} "${label}"${m?.basis === "suggested" ? ` (suggested: ${m.note ?? "similar"})` : ""}`);
      if (field === "category") categoryPending = true;
    } else {
      if (m.categoryId !== undefined) categoryIds.push(m.categoryId);
      if (m.attribute) attributes.push(m.attribute);
    }
  }
  return { categoryIds, attributes, pending, categoryPending };
}

const sameSet = <T,>(a: T[], b: T[]) => a.length === b.length && a.every((x) => b.includes(x));
const attrKey = (a: { key: string; value: string }) => `${a.key}=${textKey(a.value)}`;

/** Sheet content fields present for a matched product: reported, never written over live content. */
function contentDiffs(rec: SheetRecord): string[] {
  const diffs: string[] = [];
  if (rec.description) diffs.push("description");
  if (rec.features.length) diffs.push("features");
  if (rec.colours.length) diffs.push("colours");
  if (rec.highlights.length) diffs.push("highlights");
  if (rec.applications.length) diffs.push("applications");
  if (rec.specs) diffs.push("specifications");
  return diffs;
}

/**
 * `parentOf` (category id -> parent id) lets a less specific sheet category agree with a more
 * specific live one: "Bathroom Accessories" vs live "Bathroom Accessories › Shower" is no change.
 */
export function reconcile(records: SheetRecord[], products: CurrentProduct[], mappings: LabelMapping[], parentOf: Map<number, number | null> = new Map()): ChangeSet {
  const maps = indexMappings(mappings);
  const ancestorsOrSelf = (id: number) => {
    const out = [id];
    for (let p = parentOf.get(id); p != null && !out.includes(p); p = parentOf.get(p)) out.push(p);
    return out;
  };
  // Every sheet category is the live category or one of its ancestors -> the sheet agrees.
  const agrees = (sheet: number[], live: number[]) => sheet.every((s) => live.some((l) => ancestorsOrSelf(l).includes(s)));
  const changes: Change[] = [];
  const seen = new Map<string, SheetRecord>();
  const touched = new Set<string>();

  for (const rec of records) {
    // The sheet's own remarks can withdraw a row ("Delete this from website"): never add or change it;
    // an existing product is only flagged (unpublishing is an admin decision).
    const withdrawn = rec.remarks.find((r) => /delete\b.*\bwebsite/i.test(r));
    if (withdrawn) {
      const found = rec.codeKey ? products.filter((x) => codeKey(x.itemCode) === rec.codeKey) : [];
      found.forEach((x) => touched.add(x.publicId));
      changes.push({ action: "review", rec, product: found.length === 1 ? found[0] : undefined, candidates: found.length > 1 ? found : undefined, reasons: [`sheet remark: "${withdrawn.slice(0, 60)}" — ${found.length ? "existing product kept; decide whether to unpublish" : "not added"}`] });
      if (rec.codeKey) seen.set(rec.codeKey, rec);
      continue;
    }
    // The same code twice in the sheet: the first row decides, later rows must agree or go to review.
    if (rec.codeKey && seen.has(rec.codeKey)) {
      const first = seen.get(rec.codeKey)!;
      const differs = MAPPING_FIELDS.filter((f) => textKey(first[f]) !== textKey(rec[f]) && rec[f] && first[f]);
      changes.push(
        differs.length
          ? { action: "review", rec, reasons: [`duplicate of ${first.ref} with different ${differs.join(", ")}`] }
          : { action: "skip", rec, reasons: [`duplicate of ${first.ref} (same mapping)`] },
      );
      continue;
    }
    if (rec.codeKey) seen.set(rec.codeKey, rec);

    const found = findCandidates(rec, products);
    const { categoryIds, attributes, pending, categoryPending } = resolveMapping(rec, maps);

    if (!found) {
      if (!rec.codeKey) {
        changes.push({ action: "skip", rec, reasons: ["no item code and no existing product with this name"] });
        continue;
      }
      // A new product is only added once its category is verified. A blank category may use the
      // tab default, but only when an admin approved that default (never for existing products).
      if (!rec.category && !categoryIds.length) {
        const d = maps.get(mappingKey(rec.tab, "category", "(blank)"));
        if (d && (d.basis === "approved" || d.basis === "exact") && d.categoryId !== undefined) categoryIds.push(d.categoryId);
        else if (d?.basis === "suggested") {
          changes.push({ action: "pending", rec, pending: [`category "(blank)" (suggested: ${d.note ?? "tab default"})`, ...pending] });
          continue;
        }
      }
      if (categoryPending) changes.push({ action: "pending", rec, pending });
      else if (!categoryIds.length) changes.push({ action: "review", rec, reasons: ["new product: the sheet gives no category"] });
      else changes.push({ action: "new", rec, categoryIds, attributes });
      continue;
    }
    if (found.list.length > 1) {
      found.list.forEach((p) => touched.add(p.publicId));
      changes.push({ action: "review", rec, candidates: found.list, match: found.kind, reasons: [`${found.list.length} existing products match by ${found.kind}`] });
      continue;
    }

    const product = found.list[0];
    touched.add(product.publicId);
    const reasons: string[] = [];
    if (found.kind !== "code") reasons.push(`matched by ${found.kind} only — confirm it is the same product`);

    const set: { categoryIds?: number[]; attributes?: { key: string; value: string }[] } = {};
    if (categoryIds.length && !sameSet(categoryIds, product.categoryIds) && !agrees(categoryIds, product.categoryIds)) set.categoryIds = categoryIds;
    const currentAttrs = product.attributes.map(attrKey);
    const newAttrs = attributes.filter((a) => !currentAttrs.includes(attrKey(a)));
    // Replacing an attribute the product already has (e.g. another series) is a conflict, not a fill-in.
    for (const a of newAttrs) {
      const existing = product.attributes.filter((x) => x.key === a.key);
      if (existing.length) reasons.push(`${a.key}: live "${existing.map((x) => x.value).join(", ")}" vs sheet "${a.value}"`);
    }
    const fills = newAttrs.filter((a) => !product.attributes.some((x) => x.key === a.key));
    if (fills.length) set.attributes = fills;

    const diffs = contentDiffs(rec);
    if (reasons.length) changes.push({ action: "review", rec, product, match: found.kind, reasons: [...reasons, ...pending.map((x) => `pending label: ${x}`)] });
    else if (set.categoryIds || set.attributes) changes.push({ action: "category", rec, product, match: found.kind, set, contentDiffs: diffs, pending });
    else if (pending.length) changes.push({ action: "pending", rec, product, match: found.kind, pending });
    else changes.push({ action: "unchanged", rec, product, match: found.kind, contentDiffs: diffs });
  }

  const untouched = products.filter((p) => !touched.has(p.publicId));
  const counts: Record<string, number> = { sheetRecords: records.length, existingProducts: products.length, untouched: untouched.length };
  for (const c of changes) counts[c.action] = (counts[c.action] ?? 0) + 1;
  counts.matched = changes.filter((c) => "product" in c && c.product).length;
  return { changes, untouched, counts };
}
