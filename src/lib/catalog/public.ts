import "server-only";
import { allCategories, allProducts, categoryBySlug, categoryScope, categoryTree, listProducts, productBySlug, relatedProducts } from "./queries";
import type { PublicQuery } from "./url";

export const PUBLIC_PAGE_SIZE = 24;

export function publicList(q: PublicQuery, opts: { pageSize?: number; orderSlugs?: string[] } = {}) {
  const r = listProducts({ ...q, pageSize: opts.pageSize ?? PUBLIC_PAGE_SIZE, orderSlugs: opts.orderSlugs });
  return { ...r, items: r.items.map((item) => ({ publicId: item.publicId, slug: item.slug, title: item.title, itemCode: item.itemCode, image: item.image, status: item.status, attributes: item.attributes })) };
}

export type PublicListResult = ReturnType<typeof publicList>;

export function publicCategory(slug: string) {
  const cat = categoryBySlug(slug);
  if (!cat || !cat.published) return null;
  const tree = categoryTree();
  const parent = cat.parentId ? (tree.find((c) => c.id === cat.parentId) ?? null) : null;
  const children = tree.filter((c) => c.parentId === cat.id);
  return { id: cat.id, slug: cat.slug, name: cat.name, description: cat.description, seoTitle: cat.seoTitle, seoDescription: cat.seoDescription, parent, children };
}

export interface SubcategoryNode {
  slug: string;
  name: string;
  count: number;
  children: SubcategoryNode[];
}

export function publicSubcategories(slug: string): SubcategoryNode[] {
  const root = categoryBySlug(slug);
  if (!root) return [];
  const cats = allCategories.filter((c) => c.published);
  const published = allProducts.filter((p) => p.status === "published");
  const node = (id: number, depth: number): SubcategoryNode[] =>
    cats
      .filter((c) => c.parentId === id)
      .map((c) => {
        const scope = categoryScope(c.id);
        const count = published.filter((p) => p.categoryIds.some((cid) => scope.includes(cid))).length;
        return { slug: c.slug, name: c.name, count, children: depth < 1 ? node(c.id, depth + 1) : [] };
      })
      .filter((c) => c.count > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  return node(root.id, 0);
}

export function publicProduct(slug: string) {
  const p = productBySlug(slug);
  if (!p) return null;
  let primary: { id: number; name: string; slug: string } | undefined = p.categories[0];
  let rangeIds: number | number[] | null = primary ? primary.id : null;
  if (primary?.slug.startsWith("ceramicware/")) {
    const root = categoryBySlug("ceramicware");
    if (root) {
      primary = { id: root.id, name: root.name, slug: root.slug };
      rangeIds = categoryScope(root.id);
    }
  }
  const range = rangeIds === null ? [] : relatedProducts(p.id, rangeIds, 1000);
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
