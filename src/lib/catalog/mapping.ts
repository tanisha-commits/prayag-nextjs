import { textKey } from "./normalize";
import type { LabelMapping, MappingField } from "./reconcile";
import type { SheetRecord } from "./sheet";

/** Drupal taxonomy snapshot (src/content/prayag/catalog/taxonomy.json). */
export interface Taxonomy {
  categories: { tid: number; name: string; parent: number | null; slug: string; published: boolean }[];
  vocabularies: Record<string, { tid: number; name: string; parent: number | null }[]>;
}

/** A decision recorded by an admin for one label (src/content/prayag/catalog/label-mappings.json). */
export interface ApprovedLabel {
  tab: string;
  field: MappingField;
  label: string;
  categoryTid?: number;
  attribute?: { key: string; value: string };
  /**
   * map = use categoryTid / attribute; accept = use the sheet label itself as the attribute value
   * (label "*" accepts every label of that tab + column); skip = keep the live value, never apply.
   */
  decision: "map" | "accept" | "skip";
  /** Why / when it was decided (for people; not used by the code). */
  note?: string;
}

/**
 * Where each tab's labels may point. `categories`: subtrees (by tid) a category label may resolve to;
 * `implied`: the tab's own top category (used only as a *suggestion* when a label is blank or unknown);
 * per field: Drupal vocabularies whose terms count as exact matches, and the attribute key used.
 */
export const TAB_CONTEXT: Record<
  string,
  { categories: number[]; implied?: number; vocab: Partial<Record<MappingField, string[]>> }
> = {
  CP: { categories: [1, 170], implied: 1, vocab: { series: ["series"], collection: ["design_collection"], type: ["cp_type"] } },
  PTMT: { categories: [2], implied: 2, vocab: { series: ["ptmt_"], collection: ["ptmt_collection"], type: ["ptmt_type"] } },
  "Bathroom Accessories": { categories: [170], implied: 170, vocab: { type: ["ptmt_type", "cp_type"] } },
  Ceramicware: { categories: [21], implied: 21, vocab: { category: ["ceramicware"], type: ["ceramicware"] } },
  "Kitchen Sinks": { categories: [22], implied: 22, vocab: { collection: ["kitchen_design_collection"] } },
  Tanks: { categories: [23], implied: 23, vocab: {} },
  "Water Heaters": { categories: [134], implied: 134, vocab: {} },
  Hardware: { categories: [24], implied: 24, vocab: {} },
  "Traps and Gratings": { categories: [26, 162], implied: 26, vocab: {} },
  "Pipes and Fittings": { categories: [25, 217], implied: 25, vocab: {} },
};

/** Label used for "category left blank in the sheet" (new products only). */
export const BLANK = "(blank)";

const ATTRIBUTE_KEY: Record<Exclude<MappingField, "category">, string> = { series: "series", collection: "collection", type: "type" };

function subtree(tax: Taxonomy, roots: number[]) {
  const ids = new Set(roots);
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of tax.categories) {
      if (c.parent && ids.has(c.parent) && !ids.has(c.tid)) {
        ids.add(c.tid);
        grew = true;
      }
    }
  }
  return tax.categories.filter((c) => ids.has(c.tid));
}

/**
 * Draft mappings for every distinct (tab, field, label) in the sheet. `resolveTid` turns a Drupal
 * tid into our category id (categories imported from Drupal keep their tid).
 */
export function draftMappings(
  records: SheetRecord[],
  tax: Taxonomy,
  approved: ApprovedLabel[],
  resolveTid: (tid: number) => number | undefined,
  /** Attribute values already in the catalog, by key (used to avoid duplicate equivalent values). */
  knownValues: Record<string, string[]> = {},
): LabelMapping[] {
  // Canonical spelling for an accepted attribute label: an equivalent existing value wins, then the
  // most frequent sheet spelling; whitespace collapsed, all-lower/all-upper labels title-cased.
  const vocabByKey: Record<string, string[]> = {
    series: ["series", "ptmt_"],
    collection: ["design_collection", "ptmt_collection", "kitchen_design_collection"],
    type: ["cp_type", "ptmt_type"],
  };
  const spellings = new Map<string, Map<string, number>>();
  for (const r of records)
    for (const f of ["series", "collection", "type"] as const) {
      const v = r[f].replace(/\s+/g, " ").trim();
      if (!v) continue;
      const k = `${f}|${textKey(v)}`;
      const m = spellings.get(k) ?? new Map<string, number>();
      m.set(v, (m.get(v) ?? 0) + 1);
      spellings.set(k, m);
    }
  const canonical = (field: Exclude<MappingField, "category">, label: string) => {
    const key = textKey(label);
    const existing = [...(knownValues[ATTRIBUTE_KEY[field]] ?? []), ...(vocabByKey[field] ?? []).flatMap((v) => (tax.vocabularies[v] ?? []).map((t) => t.name))];
    const hit = existing.find((v) => textKey(v) === key);
    if (hit) return hit;
    const best = [...(spellings.get(`${field}|${key}`) ?? new Map([[label, 1]]))].sort((a, b) => b[1] - a[1])[0][0];
    const words = best.replace(/\s+/g, " ").trim();
    return words === words.toLowerCase() || words === words.toUpperCase() ? words.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase()) : words;
  };
  const out = new Map<string, LabelMapping>();
  // "*" (whole column) and "(blank)" (empty category) are literal keys, not text to normalise.
  const labelKey = (label: string) => (label === "*" || label === BLANK ? label : textKey(label));
  const approvedIdx = new Map(approved.map((a) => [`${a.tab}|${a.field}|${labelKey(a.label)}`, a]));
  // Ceramicware sub-types live in their own vocabulary but are subcategories on the site.
  const vocabCategory = (tid: number) => resolveTid(tid);

  for (const rec of records) {
    const ctx = TAB_CONTEXT[rec.tab];
    if (!ctx) continue;
    // Blank category: only ever used for NEW products, and only after the tab default is approved.
    const impliedCat = ctx.implied !== undefined ? tax.categories.find((c) => c.tid === ctx.implied) : undefined;
    if (!rec.category && impliedCat) {
      const key = `${rec.tab}|category|${BLANK}`;
      if (!out.has(key)) {
        const a = approvedIdx.get(key);
        out.set(
          key,
          a && a.decision !== "skip"
            ? { tab: rec.tab, field: "category", label: BLANK, basis: "approved", categoryId: resolveTid(a.categoryTid ?? impliedCat.tid) }
            : { tab: rec.tab, field: "category", label: BLANK, basis: a ? "unmapped" : "suggested", categoryId: resolveTid(impliedCat.tid), note: a ? "admin: no default" : `new products with a blank category -> tab default: ${impliedCat.name}` },
        );
      }
    }
    for (const field of ["category", "series", "collection", "type"] as MappingField[]) {
      const label = rec[field];
      if (!label) continue;
      const key = `${rec.tab}|${field}|${textKey(label)}`;
      if (out.has(key)) continue;
      const base = { tab: rec.tab, field, label };
      const a = approvedIdx.get(key) ?? (field !== "category" ? approvedIdx.get(`${rec.tab}|${field}|*`) : undefined);
      if (a) {
        out.set(
          key,
          a.decision === "skip"
            ? { ...base, basis: "skipped", note: a.label === "*" ? "admin: whole column skipped, live values kept" : "admin: skipped, live value kept" }
            : a.decision === "accept" && field !== "category"
              ? { ...base, basis: "approved", attribute: { key: ATTRIBUTE_KEY[field], value: canonical(field, label) }, note: "admin: accept sheet value (normalised)" }
              : { ...base, basis: "approved", categoryId: a.categoryTid !== undefined ? resolveTid(a.categoryTid) : undefined, attribute: a.attribute },
        );
        continue;
      }
      const lk = textKey(label);
      if (field === "category") {
        const cats = subtree(tax, ctx.categories);
        const exact = cats.filter((c) => textKey(c.name) === lk);
        const vocabTerms = (ctx.vocab.category ?? []).flatMap((v) => tax.vocabularies[v] ?? []).filter((t) => textKey(t.name) === lk);
        if (exact.length === 1) out.set(key, { ...base, basis: "exact", categoryId: resolveTid(exact[0].tid) });
        else if (!exact.length && vocabTerms.length === 1) out.set(key, { ...base, basis: "exact", categoryId: vocabCategory(vocabTerms[0].tid) });
        else {
          const near = cats.filter((c) => textKey(c.name).includes(lk) || lk.includes(textKey(c.name)));
          const pick = near.length === 1 ? near[0] : ctx.implied ? cats.find((c) => c.tid === ctx.implied) : undefined;
          out.set(key, {
            ...base,
            basis: pick ? "suggested" : "unmapped",
            categoryId: pick ? resolveTid(pick.tid) : undefined,
            note: pick ? (near.length === 1 ? `similar name: ${pick.name}` : `tab default: ${pick.name}`) : exact.length > 1 ? "several categories with this name" : undefined,
          });
        }
        continue;
      }
      const terms = (ctx.vocab[field] ?? []).flatMap((v) => tax.vocabularies[v] ?? []);
      const exact = terms.filter((t) => textKey(t.name) === lk);
      const attrKey = ATTRIBUTE_KEY[field];
      if (exact.length === 1) out.set(key, { ...base, basis: "exact", attribute: { key: attrKey, value: exact[0].name } });
      else if (!terms.length)
        // The live site has no taxonomy for this column: the sheet value is new information.
        out.set(key, { ...base, basis: "new-value", attribute: { key: attrKey, value: label.replace(/\s+/g, " ") }, note: "no live taxonomy for this column" });
      else {
        const near = terms.filter((t) => textKey(t.name).includes(lk) || lk.includes(textKey(t.name)));
        out.set(key, {
          ...base,
          basis: near.length === 1 ? "suggested" : "unmapped",
          attribute: { key: attrKey, value: near.length === 1 ? near[0].name : label },
          note: near.length === 1 ? `similar term: ${near[0].name}` : "no matching term in the live taxonomy",
        });
      }
    }
  }
  return [...out.values()];
}
