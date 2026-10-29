import { randomUUID } from "node:crypto";
import { and, eq, inArray, isNull } from "drizzle-orm";
import type { Db } from "@/lib/db/client";
import {
  auditLog,
  categories,
  importChanges,
  importRuns,
  productAttributes,
  productCategories,
  productImages,
  products,
} from "@/lib/db/schema";
import { localAsset } from "./assets";
import type { LiveAssignment, LiveProduct } from "./live";
import type { Taxonomy } from "./mapping";
import { codeKey, slugify, textKey, titleCodeCandidate } from "./normalize";
import { sanitizeHtml } from "./sanitize";
import type { ChangeSet, CurrentProduct } from "./reconcile";
import type { SheetRecord } from "./sheet";

type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
type Conn = Db | Tx;

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const paragraphs = (s: string) =>
  s
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, "<br>")}</p>`)
    .join("");

/** Insert missing Drupal categories (by tid); existing rows are left as they are. */
export function seedCategories(db: Conn, tax: Taxonomy) {
  let inserted = 0;
  for (const c of tax.categories) {
    const found = db.select({ id: categories.id }).from(categories).where(eq(categories.drupalTid, c.tid)).get();
    if (found) continue;
    db.insert(categories)
      .values({ slug: c.slug, name: c.name, drupalTid: c.tid, published: c.published, sortOrder: c.tid })
      .run();
    inserted++;
  }
  // Link parents for rows that do not have one yet.
  for (const c of tax.categories) {
    if (!c.parent) continue;
    const parent = db.select({ id: categories.id }).from(categories).where(eq(categories.drupalTid, c.parent)).get();
    if (parent)
      db.update(categories).set({ parentId: parent.id }).where(and(eq(categories.drupalTid, c.tid), isNull(categories.parentId))).run();
  }
  return inserted;
}

export function categoryIdByTid(db: Conn) {
  const rows = db.select({ id: categories.id, tid: categories.drupalTid }).from(categories).all();
  const map = new Map(rows.filter((r) => r.tid !== null).map((r) => [r.tid as number, r.id]));
  return (tid: number) => map.get(tid);
}

function addAttributes(db: Conn, productId: number, attrs: { key: string; value: string; hex?: string }[], source: string) {
  for (const a of attrs)
    db.insert(productAttributes)
      .values({ productId, key: a.key, value: a.value, valueSlug: slugify(a.value), hex: a.hex ?? null, source })
      .onConflictDoNothing()
      .run();
}

/**
 * Insert live-site products that are not in the database yet (matched by Drupal node id). Existing
 * rows are never modified, so re-running is a no-op and admin edits survive.
 */
export function seedLiveProducts(db: Db, live: LiveProduct[], assign: Map<string, LiveAssignment>) {
  const resolve = categoryIdByTid(db);
  const report = { inserted: 0, existing: 0, uncategorised: [] as string[] };
  db.transaction((tx) => {
    for (const p of live) {
      if (tx.select({ id: products.id }).from(products).where(eq(products.drupalNid, p.nid)).get()) {
        report.existing++;
        continue;
      }
      const a = assign.get(p.path);
      const row = tx
        .insert(products)
        .values({
          publicId: randomUUID(),
          slug: p.path.replace(/^\//, ""),
          itemCode: p.itemCode || null,
          itemCodeKey: codeKey(p.itemCode) || null,
          title: p.title,
          shortDescription: p.short || null,
          descriptionHtml: sanitizeHtml(p.descriptionHtml),
          specsHtml: sanitizeHtml(p.specsHtml),
          sizesHtml: sanitizeHtml(p.sizesHtml),
          features: p.features,
          highlights: p.highlights.map((h) => ({ text: h.text, icon: h.icon ? localAsset(h.icon) : undefined })),
          seoTitle: p.metaTitle || null,
          seoDescription: p.metaDescription || null,
          status: "published",
          drupalNid: p.nid,
          origin: "live-site",
        })
        .returning({ id: products.id })
        .get();
      const cats = (a?.categoryTids ?? []).map(resolve).filter((x): x is number => x !== undefined);
      cats.forEach((categoryId, i) => tx.insert(productCategories).values({ productId: row.id, categoryId, isPrimary: i === 0 }).run());
      if (!cats.length) report.uncategorised.push(`${p.path} (${a?.issues.join("; ") || "no category"})`);
      const hex = new Map(p.colours.map((c) => [textKey(c.name), c.hex]));
      addAttributes(tx, row.id, (a?.attributes ?? []).map((x) => ({ ...x, hex: x.key === "colour" ? hex.get(textKey(x.value)) : undefined })), "live-site");
      p.images.forEach((img, i) => tx.insert(productImages).values({ productId: row.id, src: localAsset(img.src), alt: img.alt, sortOrder: i }).run());
      report.inserted++;
    }
  });
  return report;
}

/** Point stored live-site file paths at the local copies (scripts/catalog/copy-assets.py). Idempotent. */
export function localiseAssets(db: Db) {
  let images = 0;
  let icons = 0;
  db.transaction((tx) => {
    for (const img of tx.select().from(productImages).all()) {
      const local = localAsset(img.src);
      if (local === img.src) continue;
      tx.update(productImages).set({ src: local }).where(eq(productImages.id, img.id)).run();
      images++;
    }
    for (const p of tx.select({ id: products.id, highlights: products.highlights }).from(products).all()) {
      const next = p.highlights.map((h) => (h.icon ? { ...h, icon: localAsset(h.icon) } : h));
      if (JSON.stringify(next) === JSON.stringify(p.highlights)) continue;
      tx.update(products).set({ highlights: next }).where(eq(products.id, p.id)).run();
      icons++;
    }
  });
  return { images, icons };
}

/** Category id -> parent id, for reconcile()'s "less specific category agrees" rule. */
export function categoryParents(db: Conn) {
  return new Map(db.select({ id: categories.id, parentId: categories.parentId }).from(categories).all().map((c) => [c.id, c.parentId]));
}

/** The catalog as the reconciler sees it. */
export function loadCurrent(db: Conn): CurrentProduct[] {
  const rows = db.select({ id: products.id, publicId: products.publicId, title: products.title, itemCode: products.itemCode }).from(products).all();
  const cats = db.select().from(productCategories).all();
  const attrs = db.select({ productId: productAttributes.productId, key: productAttributes.key, value: productAttributes.value }).from(productAttributes).all();
  return rows.map((r) => ({
    publicId: r.publicId,
    title: r.title,
    itemCode: r.itemCode,
    categoryIds: cats
      .filter((c) => c.productId === r.id)
      .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
      .map((c) => c.categoryId),
    attributes: attrs.filter((a) => a.productId === r.id).map(({ key, value }) => ({ key, value })),
  }));
}

export function newProductTitle(rec: SheetRecord) {
  return [rec.code, rec.type || rec.name].filter(Boolean).join(" ").trim() || rec.code;
}

/** First free slug that collides with no product and none of the reserved (route) slugs. */
export function uniqueSlug(db: Conn, title: string, reserved: Set<string>) {
  const base = slugify(title) || "product";
  for (let i = 1; ; i++) {
    const s = i === 1 ? base : `${base}-${i}`;
    if (reserved.has(s)) continue;
    if (!db.select({ id: products.id }).from(products).where(eq(products.slug, s)).get()) return s;
  }
}

function sheetAttributes(rec: SheetRecord) {
  const out: { key: string; value: string }[] = rec.colours.map((value) => ({ key: "colour", value }));
  if (rec.finish) out.push({ key: "finish", value: rec.finish });
  if (rec.range) out.push({ key: "range", value: rec.range.replace(/\s+/g, " ") });
  if (rec.capacity) out.push({ key: "capacity", value: `${rec.capacity} L` });
  return out;
}

/** Record a reconciliation run and its changes without applying anything. */
export function recordPreview(db: Db, cs: ChangeSet, source: string, sourceHash: string, actor: string) {
  return db.transaction((tx) => {
    const run = tx.insert(importRuns).values({ source, sourceHash, status: "preview", summary: cs.counts, actor }).returning({ id: importRuns.id }).get();
    for (const c of cs.changes) {
      const product = "product" in c ? c.product : undefined;
      tx.insert(importChanges)
        .values({
          runId: run.id,
          action: c.action,
          productPublicId: product?.publicId ?? null,
          itemCode: c.rec.code || null,
          sourceRef: c.rec.ref,
          reason:
            c.action === "review" || c.action === "skip" || c.action === "variant"
              ? c.reasons.join("; ")
              : c.action === "category"
                ? `mapping update (matched by ${c.match})`
                : c.action === "new"
                  ? "not in the catalog"
                  : `matched by ${c.match}; no mapping change`,
          before: product ? { categoryIds: product.categoryIds, attributes: product.attributes } : null,
          after: c.action === "category" ? c.set : c.action === "new" ? { categoryIds: c.categoryIds, attributes: c.attributes } : null,
        })
        .run();
    }
    return run.id;
  });
}

/** Canonical form of an applicable change, as stored by recordPreview (for exact preview matching). */
function changeSignature(action: string, ref: string | null, publicId: string | null, after: unknown) {
  return `${action}|${ref ?? ""}|${publicId ?? ""}|${JSON.stringify(after ?? null)}`;
}

/**
 * Throws unless the recomputed change set is exactly the previewed one: the same rows, products,
 * actions and resulting categories/attributes for every applicable change, and the same counts.
 */
export function assertMatchesPreview(db: Conn, runId: number, cs: ChangeSet) {
  const run = db.select().from(importRuns).where(eq(importRuns.id, runId)).get();
  if (!run) throw new Error(`run ${runId} not found`);
  for (const [k, v] of Object.entries(cs.counts))
    if ((run.summary[k] ?? 0) !== v) throw new Error(`count "${k}" is ${v} now but ${run.summary[k] ?? 0} in the preview`);
  const stored = db
    .select()
    .from(importChanges)
    .where(and(eq(importChanges.runId, runId), inArray(importChanges.action, ["category", "new"])))
    .all()
    .map((c) => changeSignature(c.action, c.sourceRef, c.productPublicId, c.after))
    .sort();
  const now = cs.changes
    .flatMap((c) =>
      c.action === "category"
        ? [changeSignature("category", c.rec.ref, c.product.publicId, c.set)]
        : c.action === "new"
          ? [changeSignature("new", c.rec.ref, null, { categoryIds: c.categoryIds, attributes: c.attributes })]
          : [],
    )
    .sort();
  if (stored.length !== now.length || stored.some((x, i) => x !== now[i]))
    throw new Error(`the change set differs from preview run ${runId} (${now.filter((x) => !stored.includes(x)).length} changed or new entries)`);
}

/** Everything an apply must not touch, captured inside the transaction before writing. */
function snapshot(tx: Conn) {
  const rows = tx.select().from(products).all();
  const cats = new Map<number, number[]>();
  for (const pc of tx.select().from(productCategories).all()) cats.set(pc.productId, [...(cats.get(pc.productId) ?? []), pc.categoryId].sort((a, b) => a - b));
  const attrs = tx.select().from(productAttributes).all();
  // updatedAt is the one product column an approved mapping update may touch.
  return { rows: new Map(rows.map((r) => [r.id, JSON.stringify({ ...r, updatedAt: null })])), cats, attrs: new Set(attrs.map((a) => JSON.stringify(a))), ids: new Set(rows.map((r) => r.id)) };
}

/**
 * Validation run inside the apply transaction before it commits; any failure throws, so nothing
 * is written. Checks counts, untouched fields, category safety, attribute additions only, no
 * duplicate products and draft status of new products.
 */
function validateApply(tx: Conn, before: ReturnType<typeof snapshot>, cs: ChangeSet, result: { categoryUpdates: number; newProducts: number }) {
  const fail = (m: string) => {
    throw new Error(`apply aborted, nothing written: ${m}`);
  };
  const expected = { category: cs.changes.filter((c) => c.action === "category").length, new: cs.changes.filter((c) => c.action === "new").length };
  if (result.categoryUpdates !== expected.category) fail(`${result.categoryUpdates} updates applied, ${expected.category} expected`);
  if (result.newProducts !== expected.new) fail(`${result.newProducts} new products created, ${expected.new} expected`);
  const after = snapshot(tx);
  if (after.ids.size !== before.ids.size + expected.new) fail(`product count ${after.ids.size}, expected ${before.ids.size + expected.new}`);

  const parents = categoryParents(tx);
  const ancestors = (id: number) => {
    const out = [id];
    for (let p = parents.get(id); p != null && !out.includes(p); p = parents.get(p)) out.push(p);
    return out;
  };
  const byPublic = new Map(tx.select({ id: products.id, publicId: products.publicId }).from(products).all().map((r) => [r.publicId, r.id]));
  const catChanges = new Map<number, number[]>();
  const attrProducts = new Set<number>();
  for (const c of cs.changes)
    if (c.action === "category") {
      const id = byPublic.get(c.product.publicId)!;
      if (c.set.categoryIds) catChanges.set(id, [...c.set.categoryIds].sort((a, b) => a - b));
      if (c.set.attributes) attrProducts.add(id);
    }
  for (const [id, row] of before.rows) {
    if (after.rows.get(id) !== row) fail(`product ${id}: fields other than the approved mapping changed`);
    const was = before.cats.get(id) ?? [];
    const now = after.cats.get(id) ?? [];
    const approved = catChanges.get(id);
    if (!approved) {
      if (JSON.stringify(was) !== JSON.stringify(now)) fail(`product ${id}: category changed without approval`);
    } else {
      if (JSON.stringify(now) !== JSON.stringify(approved)) fail(`product ${id}: categories differ from the preview`);
      if (was.length && !now.every((n) => was.some((w) => ancestors(n).includes(w)))) fail(`product ${id}: moved outside its live category`);
    }
  }
  for (const a of before.attrs) if (!after.attrs.has(a)) fail("an existing attribute value was changed or removed");
  const newProductIds = new Set([...after.ids].filter((id) => !before.ids.has(id)));
  for (const a of after.attrs) {
    if (before.attrs.has(a)) continue;
    const row = JSON.parse(a) as { productId: number; key: string };
    if (newProductIds.has(row.productId)) continue;
    if (!attrProducts.has(row.productId)) fail(`attribute added to product ${row.productId}, which the preview does not include`);
    const hadKey = [...before.attrs].some((b) => {
      const x = JSON.parse(b) as { productId: number; key: string };
      return x.productId === row.productId && x.key === row.key;
    });
    if (hadKey) fail(`product ${row.productId}: existing "${row.key}" value would be extended`);
  }
  const all = tx.select({ id: products.id, key: products.itemCodeKey, title: products.title, status: products.status, origin: products.origin }).from(products).all();
  for (const p of all.filter((x) => newProductIds.has(x.id))) {
    if (p.status !== "draft" || p.origin !== "sheet") fail(`new product ${p.id} is not a sheet draft`);
    const clash = all.find((o) => o.id !== p.id && p.key && (o.key === p.key || codeKey(titleCodeCandidate(o.title)) === p.key));
    if (clash) fail(`new product ${p.key} duplicates existing product ${clash.id} ("${clash.title}")`);
  }
}

/**
 * Apply the verified changes of a change set in one transaction: mapping updates (categories +
 * missing mapping attributes only) and new products (as drafts). Review/skip rows are not touched.
 */
export function applyChangeSet(db: Db, cs: ChangeSet, runId: number, actor: string, reserved: Set<string>) {
  const result = { categoryUpdates: 0, newProducts: 0 };
  db.transaction((tx) => {
    const before = snapshot(tx);
    for (const c of cs.changes) {
      if (c.action === "category") {
        const p = tx.select({ id: products.id }).from(products).where(eq(products.publicId, c.product.publicId)).get();
        if (!p) throw new Error(`product ${c.product.publicId} disappeared`);
        if (c.set.categoryIds) {
          tx.delete(productCategories).where(eq(productCategories.productId, p.id)).run();
          c.set.categoryIds.forEach((categoryId, i) => tx.insert(productCategories).values({ productId: p.id, categoryId, isPrimary: i === 0 }).run());
        }
        if (c.set.attributes) addAttributes(tx, p.id, c.set.attributes, `sheet:${c.rec.ref}`);
        tx.update(products).set({ updatedAt: new Date() }).where(eq(products.id, p.id)).run();
        tx.insert(auditLog)
          .values({ actor, action: "import.mapping", entity: "product", entityId: c.product.publicId, before: { categoryIds: c.product.categoryIds, attributes: c.product.attributes }, after: c.set })
          .run();
        result.categoryUpdates++;
      } else if (c.action === "new") {
        const rec = c.rec;
        // Idempotency guard: a product with this code may have been added by an earlier run.
        if (tx.select({ id: products.id }).from(products).where(eq(products.itemCodeKey, rec.codeKey)).get()) continue;
        const title = newProductTitle(rec);
        const publicId = randomUUID();
        const row = tx
          .insert(products)
          .values({
            publicId,
            slug: uniqueSlug(tx, title, reserved),
            itemCode: rec.code,
            itemCodeKey: rec.codeKey,
            title,
            shortDescription: rec.description ? rec.description.split("\n")[0].slice(0, 220) : null,
            descriptionHtml: rec.description ? paragraphs(rec.description) : null,
            specsHtml: rec.specs ? paragraphs(rec.specs) : rec.size ? paragraphs(`Size: ${rec.size}`) : null,
            features: rec.features,
            applications: rec.applications,
            highlights: rec.highlights.map((text) => ({ text })),
            seoTitle: rec.pageTitle || null,
            status: "draft",
            origin: "sheet",
          })
          .returning({ id: products.id })
          .get();
        c.categoryIds.forEach((categoryId, i) => tx.insert(productCategories).values({ productId: row.id, categoryId, isPrimary: i === 0 }).run());
        addAttributes(tx, row.id, [...c.attributes, ...sheetAttributes(rec)], `sheet:${rec.ref}`);
        tx.insert(auditLog).values({ actor, action: "import.create", entity: "product", entityId: publicId, after: { ref: rec.ref, title } }).run();
        result.newProducts++;
      }
    }
    validateApply(tx, before, cs, result);
    tx.update(importChanges)
      .set({ applied: true })
      .where(and(eq(importChanges.runId, runId), inArray(importChanges.action, ["category", "new"])))
      .run();
    tx.update(importRuns).set({ status: "applied", appliedAt: new Date() }).where(eq(importRuns.id, runId)).run();
  });
  return result;
}
