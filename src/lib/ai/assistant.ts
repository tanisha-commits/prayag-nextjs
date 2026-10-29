import { eq, sql } from "drizzle-orm";
import type { Db } from "@/lib/db/client";
import { aiSuggestions, categories, productCategories, productImages, products } from "@/lib/db/schema";

/**
 * Rules-based catalog checks (no external service). Each suggestion records its evidence in `basis`
 * and waits for an admin decision; nothing is changed here. Re-running replaces pending suggestions.
 */
export function runCatalogChecks(db: Db) {
  const rows = db.select({ id: products.id, publicId: products.publicId, title: products.title, itemCode: products.itemCode, key: products.itemCodeKey, status: products.status, description: products.descriptionHtml }).from(products).all();
  const catOf = new Map<number, number[]>();
  for (const pc of db.select().from(productCategories).all()) catOf.set(pc.productId, [...(catOf.get(pc.productId) ?? []), pc.categoryId]);
  const withImage = new Set(db.select({ id: productImages.productId }).from(productImages).all().map((r) => r.id));
  const catName = new Map(db.select({ id: categories.id, name: categories.name }).from(categories).all().map((c) => [c.id, c.name]));
  const out: { productPublicId: string | null; kind: string; proposal: unknown; basis: string }[] = [];

  const byKey = new Map<string, typeof rows>();
  for (const r of rows) if (r.key) byKey.set(r.key, [...(byKey.get(r.key) ?? []), r]);
  for (const [key, list] of byKey)
    if (list.length > 1)
      out.push({ productPublicId: null, kind: "duplicate", proposal: { itemCode: list[0].itemCode, products: list.map((p) => ({ publicId: p.publicId, title: p.title, status: p.status })) }, basis: `${list.length} products share item code ${key}` });

  for (const r of rows) {
    if (r.status !== "published") continue;
    const missing = [!catOf.get(r.id)?.length && "category", !withImage.has(r.id) && "image", !r.description && "description"].filter(Boolean);
    if (missing.length) out.push({ productPublicId: r.publicId, kind: "incomplete", proposal: { missing }, basis: `published product without ${missing.join(", ")}` });
  }

  // Category suggestion for uncategorised products: the category most products with the same
  // item-code prefix (letters before the first digit, or the first title word) are verified in.
  const prefix = (r: (typeof rows)[number]) => (r.itemCode ?? r.title).toUpperCase().match(/^[A-Z]+/)?.[0] ?? (r.title.split(/\s+/)[0] ?? "").toUpperCase();
  for (const r of rows) {
    if (catOf.get(r.id)?.length) continue;
    const pre = prefix(r);
    if (!pre || pre.length < 2) continue;
    const votes = new Map<number, number>();
    for (const o of rows) if (o.id !== r.id && prefix(o) === pre) for (const c of catOf.get(o.id)?.slice(0, 1) ?? []) votes.set(c, (votes.get(c) ?? 0) + 1);
    const ranked = [...votes].sort((a, b) => b[1] - a[1]);
    const total = ranked.reduce((n, [, v]) => n + v, 0);
    if (ranked.length && ranked[0][1] >= 3 && ranked[0][1] / total >= 0.8)
      out.push({ productPublicId: r.publicId, kind: "category", proposal: { categoryId: ranked[0][0], category: catName.get(ranked[0][0]) }, basis: `${ranked[0][1]} of ${total} categorised products with prefix "${pre}" are in ${catName.get(ranked[0][0])}` });
  }

  db.transaction((tx) => {
    tx.delete(aiSuggestions).where(sql`${aiSuggestions.status} = 'pending' and ${aiSuggestions.provider} = 'rules'`).run();
    for (const s of out) tx.insert(aiSuggestions).values({ ...s, provider: "rules" }).run();
  });
  return out.length;
}

/** Apply an approved category suggestion (admin decision already checked by the caller). */
export function applyCategorySuggestion(db: Db, productPublicId: string, categoryId: number) {
  const p = db.select({ id: products.id }).from(products).where(eq(products.publicId, productPublicId)).get();
  if (!p || db.select().from(productCategories).where(eq(productCategories.productId, p.id)).get()) return false;
  db.insert(productCategories).values({ productId: p.id, categoryId, isPrimary: true }).run();
  return true;
}
