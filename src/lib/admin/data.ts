import "server-only";
import { desc, eq, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/server";
import { categoryTree, listProducts, type ListQuery } from "@/lib/catalog/queries";
import { getDb } from "@/lib/db";
import { aiSuggestions, auditLog, importChanges, importRuns, productAttributes, productCategories, productImages, productRelations, products } from "@/lib/db/schema";

// Admin reads. Each one re-checks the session (defence in depth beside the panel layout).

export async function adminDashboard() {
  await requireAdmin();
  const db = getDb();
  const byStatus = db.select({ status: products.status, n: sql<number>`count(*)` }).from(products).groupBy(products.status).all();
  const uncategorised = db.select({ n: sql<number>`count(*)` }).from(products).where(sql`${products.id} not in (select product_id from product_categories)`).get()?.n ?? 0;
  const runs = db.select().from(importRuns).orderBy(desc(importRuns.id)).limit(5).all();
  const pendingAi = db.select({ n: sql<number>`count(*)` }).from(aiSuggestions).where(eq(aiSuggestions.status, "pending")).get()?.n ?? 0;
  return { byStatus, uncategorised, runs, pendingAi, categories: categoryTree(db, true).length };
}

export async function adminProducts(q: ListQuery) {
  await requireAdmin();
  return listProducts(getDb(), { ...q, includeUnpublished: true, pageSize: 50 });
}

export async function adminProduct(publicId: string) {
  await requireAdmin();
  const db = getDb();
  const p = db.select().from(products).where(eq(products.publicId, publicId)).get();
  if (!p) return null;
  const cats = db.select().from(productCategories).where(eq(productCategories.productId, p.id)).all();
  const attrs = db.select().from(productAttributes).where(eq(productAttributes.productId, p.id)).all();
  const images = db.select().from(productImages).where(eq(productImages.productId, p.id)).orderBy(productImages.sortOrder).all();
  const rel = db
    .select({ kind: productRelations.kind, code: products.itemCode, title: products.title })
    .from(productRelations)
    .innerJoin(products, eq(products.id, productRelations.relatedId))
    .where(eq(productRelations.productId, p.id))
    .all();
  const history = db.select().from(auditLog).where(eq(auditLog.entityId, publicId)).orderBy(desc(auditLog.id)).limit(20).all();
  return {
    ...p,
    categoryIds: cats.sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)).map((c) => c.categoryId),
    attributes: attrs,
    images,
    addons: rel.filter((r) => r.kind === "addon"),
    related: rel.filter((r) => r.kind === "related"),
    history,
  };
}

export async function adminCategories() {
  await requireAdmin();
  return categoryTree(getDb(), true);
}

export async function adminImportRuns() {
  await requireAdmin();
  const db = getDb();
  const runs = db.select().from(importRuns).orderBy(desc(importRuns.id)).limit(20).all();
  const latest = runs[0];
  const changes = latest ? db.select().from(importChanges).where(eq(importChanges.runId, latest.id)).all() : [];
  return { runs, latest, changes };
}

export async function adminAudit(limit = 200) {
  await requireAdmin();
  return getDb().select().from(auditLog).orderBy(desc(auditLog.id)).limit(limit).all();
}

export async function adminSuggestions() {
  await requireAdmin();
  return getDb().select().from(aiSuggestions).orderBy(desc(aiSuggestions.id)).limit(200).all();
}
