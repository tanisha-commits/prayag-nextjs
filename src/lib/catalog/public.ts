import "server-only";
import { getDb } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";
import { categories, productCategories, products } from "@/lib/db/schema";
import { categoryBySlug, categoryScope, categoryTree, listProducts, productBySlug, relatedProducts } from "./queries";
import type { PublicQuery } from "./url";

// Public data access: published products only, and only the fields a visitor may see.

export const PUBLIC_PAGE_SIZE = 24;

/**
 * Local review only: with PRAYAG_PREVIEW_DRAFTS=1 in .env.local, `next dev` also lists and shows draft
 * products (marked "Draft"). Production builds never do, whatever the variable says.
 */
export function draftPreview() {
  return process.env.NODE_ENV === "development" && process.env.PRAYAG_PREVIEW_DRAFTS === "1";
}

export function publicList(q: PublicQuery, opts: { pageSize?: number; orderSlugs?: string[] } = {}) {
  const r = listProducts(getDb(), { ...q, pageSize: opts.pageSize ?? PUBLIC_PAGE_SIZE, orderSlugs: opts.orderSlugs, includeUnpublished: draftPreview() });
  return { ...r, items: r.items.map((item) => ({ publicId: item.publicId, slug: item.slug, title: item.title, itemCode: item.itemCode, image: item.image, status: item.status, attributes: item.attributes })) };
}

export type PublicListResult = ReturnType<typeof publicList>;


export function publicCategory(slug: string) {
  const db = getDb();
  const cat = categoryBySlug(db, slug);
  if (!cat || !cat.published) return null;
  const tree = categoryTree(db);
  const parent = cat.parentId ? tree.find((c) => c.id === cat.parentId) ?? null : null;
  const children = tree.filter((c) => c.parentId === cat.id);
  return { id: cat.id, slug: cat.slug, name: cat.name, description: cat.description, seoTitle: cat.seoTitle, seoDescription: cat.seoDescription, parent, children };
}

export interface SubcategoryNode {
  slug: string;
  name: string;
  count: number;
  children: SubcategoryNode[];
}

/** Published subcategories of a category (two levels), with product counts including descendants; empty ones are left out. */
export function publicSubcategories(slug: string): SubcategoryNode[] {
  const db = getDb();
  const root = categoryBySlug(db, slug);
  if (!root) return [];
  const cats = db.select({ id: categories.id, slug: categories.slug, name: categories.name, parentId: categories.parentId }).from(categories).where(eq(categories.published, true)).all();
  const statuses: ("published" | "draft")[] = draftPreview() ? ["published", "draft"] : ["published"];
  const links = db
    .select({ productId: productCategories.productId, categoryId: productCategories.categoryId })
    .from(productCategories)
    .innerJoin(products, eq(products.id, productCategories.productId))
    .where(inArray(products.status, statuses))
    .all();
  const node = (id: number, depth: number): SubcategoryNode[] =>
    cats
      .filter((c) => c.parentId === id)
      .map((c) => {
        const scope = new Set([c.id]);
        for (let grew = true; grew; ) {
          grew = false;
          for (const x of cats)
            if (x.parentId !== null && scope.has(x.parentId) && !scope.has(x.id)) {
              scope.add(x.id);
              grew = true;
            }
        }
        const count = new Set(links.filter((l) => scope.has(l.categoryId)).map((l) => l.productId)).size;
        return { slug: c.slug, name: c.name, count, children: depth < 1 ? node(c.id, depth + 1) : [] };
      })
      .filter((c) => c.count > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  return node(root.id, 0);
}

export function publicProduct(slug: string) {
  const db = getDb();
  const p = productBySlug(db, slug, draftPreview());
  if (!p) return null;
  // The source labels a product with its primary category, except that every CeramicWare
  // subcategory shows (and draws related products from) the whole CeramicWare range.
  let primary: { id: number; name: string; slug: string } | undefined = p.categories[0];
  let rangeIds: number | number[] | null = primary ? primary.id : null;
  if (primary?.slug.startsWith("ceramicware/")) {
    const root = categoryBySlug(db, "ceramicware");
    if (root) {
      primary = { id: root.id, name: root.name, slug: root.slug };
      rangeIds = categoryScope(db, root.id);
    }
  }
  // As on the source: the next 10 products of the same range, in title order after this one.
  const range = rangeIds === null ? [] : relatedProducts(db, p.id, rangeIds, 1000);
  const after = range.findIndex((r) => r.title.localeCompare(p.title) > 0);
  const related = (after < 0 ? range : [...range.slice(after), ...range.slice(0, after)]).slice(0, 10);
  return {
    publicId: p.publicId, slug: p.slug, title: p.title, itemCode: p.itemCode, status: p.status, shortDescription: p.shortDescription,
    descriptionHtml: p.descriptionHtml, specsHtml: p.specsHtml, sizesHtml: p.sizesHtml, features: p.features,
    applications: p.applications, highlights: p.highlights, seoTitle: p.seoTitle, seoDescription: p.seoDescription,
    categories: [...(primary ? [primary] : []), ...p.categories.filter((c) => c.id !== primary?.id)].map(({ name, slug }) => ({ name, slug })), attributes: p.attributes, images: p.images,
    related: related.map((r) => ({ publicId: r.publicId, slug: r.slug, title: r.title, itemCode: r.itemCode, image: r.image })),
  };
}
