import { and, asc, desc, eq, inArray, like, or, sql, type SQL } from "drizzle-orm";
import type { Db } from "@/lib/db/client";
import { categories, productAttributes, productCategories, productImages, products } from "@/lib/db/schema";

/** Attribute keys offered as filters, in display order (only keys with values in scope are shown). */
export const FILTER_KEYS = ["type", "series", "collection", "colour", "finish", "range", "capacity", "plumbing type", "accessory range"] as const;

export interface ListQuery {
  /** Category slug; products of its subcategories are included. */
  category?: string;
  /** Selected filter values by attribute key (value slugs). Values of one key are OR-ed, keys AND-ed. */
  filters?: Record<string, string[]>;
  q?: string;
  sort?: "title" | "title-desc" | "newest" | "code";
  page?: number;
  pageSize?: number;
  /** Admin only: include drafts and archived products. */
  includeUnpublished?: boolean;
  /** Admin only: one status, or products without any category. */
  status?: "published" | "draft" | "archived";
  uncategorised?: boolean;
  /** Default order: these product slugs first, in this order (the source listing order), then by title. */
  orderSlugs?: string[];
}

export interface ProductCard {
  publicId: string;
  slug: string;
  title: string;
  itemCode: string | null;
  image: string | null;
  status: string;
  /** Card attributes (CARD_KEYS) in listings; omitted elsewhere. */
  attributes?: { key: string; value: string; hex: string | null }[];
}

/** Attribute keys shown on listing cards when a product has them. */
export const CARD_KEYS = ["colour", "finish", "type", "collection", "series", "range", "capacity"] as const;

export interface Facet {
  key: string;
  values: { value: string; slug: string; count: number; hex: string | null }[];
}

export function categoryBySlug(db: Db, slug: string) {
  return db.select().from(categories).where(eq(categories.slug, slug)).get();
}

/** Category id plus every descendant id. */
export function categoryScope(db: Db, rootId: number): number[] {
  const all = db.select({ id: categories.id, parentId: categories.parentId }).from(categories).all();
  const ids = [rootId];
  for (let i = 0; i < ids.length; i++) for (const c of all) if (c.parentId === ids[i] && !ids.includes(c.id)) ids.push(c.id);
  return ids;
}

function baseConditions(db: Db, q: ListQuery): SQL[] | null {
  const conds: SQL[] = [];
  if (!q.includeUnpublished) conds.push(eq(products.status, "published"));
  else if (q.status) conds.push(eq(products.status, q.status));
  if (q.uncategorised) conds.push(sql`${products.id} not in (select ${productCategories.productId} from ${productCategories})`);
  if (q.category) {
    const cat = categoryBySlug(db, q.category);
    if (!cat) return null;
    const scope = categoryScope(db, cat.id);
    conds.push(inArray(products.id, db.select({ id: productCategories.productId }).from(productCategories).where(inArray(productCategories.categoryId, scope))));
  }
  const term = q.q?.trim();
  if (term) {
    const pattern = `%${term.replace(/[%_\\]/g, (m) => `\\${m}`)}%`;
    conds.push(or(like(products.title, pattern), like(products.itemCode, pattern))!);
  }
  return conds;
}

/** `subcategory` filters by category slugs (each with its descendants); other keys by attribute value slugs. */
function filterCondition(db: Db, key: string, slugs: string[]): SQL {
  if (key === "subcategory") {
    const ids = slugs.flatMap((s) => {
      const cat = categoryBySlug(db, s);
      return cat ? categoryScope(db, cat.id) : [];
    });
    return inArray(products.id, db.select({ id: productCategories.productId }).from(productCategories).where(inArray(productCategories.categoryId, ids.length ? ids : [-1])));
  }
  return inArray(
    products.id,
    sql`(select ${productAttributes.productId} from ${productAttributes} where ${productAttributes.key} = ${key} and ${inArray(productAttributes.valueSlug, slugs)})`,
  );
}

export function listProducts(db: Db, q: ListQuery): { items: ProductCard[]; total: number; facets: Facet[]; page: number; pageSize: number } {
  const pageSize = Math.min(Math.max(q.pageSize ?? 24, 1), 100);
  const page = Math.max(q.page ?? 1, 1);
  const base = baseConditions(db, q);
  if (!base) return { items: [], total: 0, facets: [], page, pageSize };
  const filters = Object.entries(q.filters ?? {}).filter(([, v]) => v.length);
  const filterConds = filters.map(([k, v]) => filterCondition(db, k, v));
  const where = and(...base, ...filterConds);

  const total = db.select({ n: sql<number>`count(*)` }).from(products).where(where).get()?.n ?? 0;
  const order =
    q.sort === "title-desc" ? [desc(products.title)] : q.sort === "newest" ? [desc(products.createdAt)] : q.sort === "code" ? [asc(products.itemCode)] : [asc(products.title)];
  const cols = { id: products.id, publicId: products.publicId, slug: products.slug, title: products.title, itemCode: products.itemCode, status: products.status };
  let rows;
  if (q.orderSlugs && !q.sort) {
    const pos = new Map(q.orderSlugs.map((s, i) => [s, i]));
    rows = db
      .select(cols)
      .from(products)
      .where(where)
      .orderBy(asc(products.title), asc(products.id))
      .all()
      .sort((a, b) => (pos.get(a.slug) ?? Number.MAX_SAFE_INTEGER) - (pos.get(b.slug) ?? Number.MAX_SAFE_INTEGER)) // stable: the rest stay by title
      .slice((page - 1) * pageSize, page * pageSize);
  } else rows = db.select(cols).from(products).where(where).orderBy(...order, asc(products.id)).limit(pageSize).offset((page - 1) * pageSize).all();
  const images = rows.length
    ? db.select({ productId: productImages.productId, src: productImages.src, sortOrder: productImages.sortOrder }).from(productImages).where(inArray(productImages.productId, rows.map((r) => r.id))).all()
    : [];
  const attrs = rows.length
    ? db
        .select({ productId: productAttributes.productId, key: productAttributes.key, value: productAttributes.value, hex: productAttributes.hex })
        .from(productAttributes)
        .where(and(inArray(productAttributes.productId, rows.map((r) => r.id)), inArray(productAttributes.key, [...CARD_KEYS])))
        .orderBy(asc(productAttributes.value))
        .all()
    : [];
  const items = rows.map(({ id, ...r }) => ({
    ...r,
    image: images.filter((i) => i.productId === id).sort((a, b) => a.sortOrder - b.sortOrder)[0]?.src ?? null,
    attributes: attrs.filter((a) => a.productId === id).map(({ key, value, hex }) => ({ key, value, hex })),
  }));

  // Each facet counts with every *other* selected filter applied.
  const facets: Facet[] = [];
  for (const key of FILTER_KEYS) {
    const others = filters.filter(([k]) => k !== key).map(([k, v]) => filterCondition(db, k, v));
    const values = db
      .select({ value: productAttributes.value, slug: productAttributes.valueSlug, hex: sql<string | null>`max(${productAttributes.hex})`, count: sql<number>`count(distinct ${productAttributes.productId})` })
      .from(productAttributes)
      .innerJoin(products, eq(products.id, productAttributes.productId))
      .where(and(eq(productAttributes.key, key), ...base, ...others))
      .groupBy(productAttributes.valueSlug)
      .orderBy(asc(productAttributes.value))
      .all();
    if (values.length) facets.push({ key, values });
  }
  return { items, total, facets, page, pageSize };
}

export function productBySlug(db: Db, slug: string, includeUnpublished = false) {
  const p = db.select().from(products).where(eq(products.slug, slug)).get();
  if (!p || (!includeUnpublished && p.status !== "published")) return null;
  const cats = db
    .select({ id: categories.id, name: categories.name, slug: categories.slug, parentId: categories.parentId, isPrimary: productCategories.isPrimary })
    .from(productCategories)
    .innerJoin(categories, eq(categories.id, productCategories.categoryId))
    .where(eq(productCategories.productId, p.id))
    .all()
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  const attributes = db.select({ key: productAttributes.key, value: productAttributes.value, hex: productAttributes.hex }).from(productAttributes).where(eq(productAttributes.productId, p.id)).orderBy(asc(productAttributes.id)).all();
  const images = db.select({ src: productImages.src, alt: productImages.alt }).from(productImages).where(eq(productImages.productId, p.id)).orderBy(asc(productImages.sortOrder)).all();
  return { ...p, categories: cats, attributes, images };
}

/** Published products in the given category (or any of the given categories), for "related products". */
export function relatedProducts(db: Db, productId: number, categoryId: number | number[], limit = 8): ProductCard[] {
  return db
      .select({ publicId: products.publicId, slug: products.slug, title: products.title, itemCode: products.itemCode, status: products.status, id: products.id })
      .from(products)
      .innerJoin(productCategories, eq(productCategories.productId, products.id))
      .where(and(Array.isArray(categoryId) ? inArray(productCategories.categoryId, categoryId) : eq(productCategories.categoryId, categoryId), eq(products.status, "published"), sql`${products.id} <> ${productId}`))
      .groupBy(products.id)
      .orderBy(asc(products.title))
      .limit(limit)
      .all()
      .map(({ id, ...r }) => ({ ...r, image: db.select({ src: productImages.src }).from(productImages).where(eq(productImages.productId, id)).orderBy(asc(productImages.sortOrder)).get()?.src ?? null }));
}

/** Category tree for navigation (published only unless asked). */
export function categoryTree(db: Db, includeUnpublished = false) {
  const rows = db.select().from(categories).orderBy(asc(categories.sortOrder)).all().filter((c) => includeUnpublished || c.published);
  const counts = new Map(
    db
      .select({ categoryId: productCategories.categoryId, n: sql<number>`count(*)` })
      .from(productCategories)
      .innerJoin(products, eq(products.id, productCategories.productId))
      .where(includeUnpublished ? undefined : eq(products.status, "published"))
      .groupBy(productCategories.categoryId)
      .all()
      .map((r) => [r.categoryId, r.n]),
  );
  return rows.map((c) => ({ ...c, productCount: counts.get(c.id) ?? 0 }));
}
