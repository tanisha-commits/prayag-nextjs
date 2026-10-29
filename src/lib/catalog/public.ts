import "server-only";
import { getDb } from "@/lib/db";
import { categoryBySlug, categoryTree, listProducts, productBySlug, relatedProducts } from "./queries";
import type { PublicQuery } from "./url";

// Public data access: published products only, and only the fields a visitor may see.

export const PUBLIC_PAGE_SIZE = 24;

export function publicList(q: PublicQuery) {
  const r = listProducts(getDb(), { ...q, pageSize: PUBLIC_PAGE_SIZE });
  return { ...r, items: r.items.map((item) => ({ publicId: item.publicId, slug: item.slug, title: item.title, itemCode: item.itemCode, image: item.image })) };
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

export function publicProduct(slug: string) {
  const db = getDb();
  const p = productBySlug(db, slug);
  if (!p) return null;
  const primary = p.categories[0];
  const related = primary ? relatedProducts(db, p.id, primary.id, 8) : [];
  return {
    publicId: p.publicId, slug: p.slug, title: p.title, itemCode: p.itemCode, shortDescription: p.shortDescription,
    descriptionHtml: p.descriptionHtml, specsHtml: p.specsHtml, sizesHtml: p.sizesHtml, features: p.features,
    applications: p.applications, highlights: p.highlights, seoTitle: p.seoTitle, seoDescription: p.seoDescription,
    categories: p.categories.map(({ name, slug }) => ({ name, slug })), attributes: p.attributes, images: p.images,
    related: related.map((r) => ({ publicId: r.publicId, slug: r.slug, title: r.title, itemCode: r.itemCode, image: r.image })),
  };
}
