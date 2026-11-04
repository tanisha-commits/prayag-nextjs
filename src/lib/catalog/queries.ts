import "server-only";
import catalog from "@/content/prayag/catalog/catalog.json";

export const FILTER_KEYS = ["type", "series", "collection", "colour", "finish", "range", "capacity", "plumbing type", "accessory range"] as const;

export const CARD_KEYS = ["colour", "finish", "type", "collection", "series", "range", "capacity"] as const;

export type ProductStatus = "published" | "draft" | "archived";

export interface ListQuery {
  category?: string;
  filters?: Record<string, string[]>;
  q?: string;
  sort?: "title" | "title-desc" | "newest" | "code";
  page?: number;
  pageSize?: number;
  orderSlugs?: string[];
}

export interface ProductCard {
  publicId: string;
  slug: string;
  title: string;
  itemCode: string | null;
  image: string | null;
  status: string;
  attributes?: { key: string; value: string; hex: string | null }[];
}

export interface Facet {
  key: string;
  values: { value: string; slug: string; count: number; hex: string | null }[];
}

interface CatalogCategory {
  slug: string;
  name: string;
  parent: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
}

interface CatalogProduct {
  publicId: string;
  slug: string;
  title: string;
  itemCode: string | null;
  status: string;
  shortDescription: string | null;
  descriptionHtml: string | null;
  specsHtml: string | null;
  sizesHtml: string | null;
  features: string[];
  applications: string[];
  highlights: { text: string; icon?: string }[];
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  categories: string[];
  attributes: { key: string; value: string; slug: string; hex: string | null }[];
  images: { src: string; alt: string }[];
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  parentId: number | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  sortOrder: number;
  published: boolean;
}

export interface Product extends Omit<CatalogProduct, "categories" | "createdAt" | "updatedAt" | "status"> {
  id: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
  categoryIds: number[];
}

const data = catalog as { categories: CatalogCategory[]; products: CatalogProduct[] };

const categoryIdBySlug = new Map(data.categories.map((c, i) => [c.slug, i + 1]));

export const allCategories: Category[] = data.categories.map((c, i) => ({
  id: i + 1,
  slug: c.slug,
  name: c.name,
  parentId: c.parent ? (categoryIdBySlug.get(c.parent) ?? null) : null,
  description: c.description,
  seoTitle: c.seoTitle,
  seoDescription: c.seoDescription,
  sortOrder: i,
  published: c.published,
}));

export const allProducts: Product[] = data.products.map(({ categories, createdAt, updatedAt, status, ...p }, i) => ({
  ...p,
  id: i + 1,
  status: status as ProductStatus,
  createdAt: new Date(createdAt),
  updatedAt: new Date(updatedAt),
  categoryIds: categories.map((s) => categoryIdBySlug.get(s)).filter((id): id is number => id !== undefined),
}));

const productBySlugMap = new Map(allProducts.map((p) => [p.slug, p]));
const categoryBySlugMap = new Map(allCategories.map((c) => [c.slug, c]));

const binary = (a: string | null, b: string | null) => (a === b ? 0 : a === null ? -1 : b === null ? 1 : a < b ? -1 : 1);

const firstImage = (p: Product) => p.images[0]?.src ?? null;

export function categoryBySlug(slug: string) {
  return categoryBySlugMap.get(slug);
}

export function categoryScope(rootId: number): number[] {
  const ids = [rootId];
  for (let i = 0; i < ids.length; i++) for (const c of allCategories) if (c.parentId === ids[i] && !ids.includes(c.id)) ids.push(c.id);
  return ids;
}

const inScope = (p: Product, scope: number[]) => p.categoryIds.some((id) => scope.includes(id));

function basePredicate(q: ListQuery): ((p: Product) => boolean) | null {
  let scope: number[] | null = null;
  if (q.category) {
    const cat = categoryBySlug(q.category);
    if (!cat) return null;
    scope = categoryScope(cat.id);
  }
  const term = q.q?.trim().toLowerCase();
  return (p) =>
    p.status === "published" &&
    (!scope || inScope(p, scope)) &&
    (!term || p.title.toLowerCase().includes(term) || (p.itemCode ?? "").toLowerCase().includes(term));
}

function filterPredicate(key: string, slugs: string[]): (p: Product) => boolean {
  if (key === "subcategory") {
    const ids = slugs.flatMap((s) => {
      const cat = categoryBySlug(s);
      return cat ? categoryScope(cat.id) : [];
    });
    return (p) => inScope(p, ids);
  }
  return (p) => p.attributes.some((a) => a.key === key && slugs.includes(a.slug));
}

export function listProducts(q: ListQuery): { items: ProductCard[]; total: number; facets: Facet[]; page: number; pageSize: number } {
  const pageSize = Math.min(Math.max(q.pageSize ?? 24, 1), 100);
  const page = Math.max(q.page ?? 1, 1);
  const base = basePredicate(q);
  if (!base) return { items: [], total: 0, facets: [], page, pageSize };
  const filters = Object.entries(q.filters ?? {}).filter(([, v]) => v.length);
  const preds = filters.map(([k, v]) => filterPredicate(k, v));
  const matched = allProducts.filter((p) => base(p) && preds.every((f) => f(p)));

  let rows: Product[];
  if (q.orderSlugs && !q.sort) {
    const pos = new Map(q.orderSlugs.map((s, i) => [s, i]));
    rows = [...matched]
      .sort((a, b) => binary(a.title, b.title) || a.id - b.id)
      .sort((a, b) => (pos.get(a.slug) ?? Number.MAX_SAFE_INTEGER) - (pos.get(b.slug) ?? Number.MAX_SAFE_INTEGER));
  } else {
    const cmp: (a: Product, b: Product) => number =
      q.sort === "title-desc"
        ? (a, b) => binary(b.title, a.title)
        : q.sort === "newest"
          ? (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          : q.sort === "code"
            ? (a, b) => binary(a.itemCode, b.itemCode)
            : (a, b) => binary(a.title, b.title);
    rows = [...matched].sort((a, b) => cmp(a, b) || a.id - b.id);
  }
  const items = rows.slice((page - 1) * pageSize, page * pageSize).map((p) => ({
    publicId: p.publicId,
    slug: p.slug,
    title: p.title,
    itemCode: p.itemCode,
    status: p.status,
    image: firstImage(p),
    attributes: p.attributes
      .filter((a) => (CARD_KEYS as readonly string[]).includes(a.key))
      .sort((a, b) => binary(a.value, b.value))
      .map(({ key, value, hex }) => ({ key, value, hex })),
  }));

  const facets: Facet[] = [];
  for (const key of FILTER_KEYS) {
    const others = filters.filter(([k]) => k !== key).map(([k, v]) => filterPredicate(k, v));
    const groups = new Map<string, { value: string; slug: string; hex: string | null; ids: Set<number> }>();
    for (const p of allProducts) {
      if (!base(p) || !others.every((f) => f(p))) continue;
      for (const a of p.attributes) {
        if (a.key !== key) continue;
        const g = groups.get(a.slug) ?? { value: a.value, slug: a.slug, hex: null, ids: new Set<number>() };
        if (a.hex && (!g.hex || a.hex > g.hex)) g.hex = a.hex;
        g.ids.add(p.id);
        groups.set(a.slug, g);
      }
    }
    const values = [...groups.values()].sort((a, b) => binary(a.value, b.value)).map(({ value, slug, hex, ids }) => ({ value, slug, hex, count: ids.size }));
    if (values.length) facets.push({ key, values });
  }
  return { items, total: matched.length, facets, page, pageSize };
}

export function productBySlug(slug: string) {
  const p = productBySlugMap.get(slug);
  if (!p || p.status !== "published") return null;
  const categories = p.categoryIds.map((id) => allCategories[id - 1]).map(({ id, name, slug, parentId }) => ({ id, name, slug, parentId }));
  return { ...p, categories, attributes: p.attributes.map(({ key, value, hex }) => ({ key, value, hex })) };
}

export function relatedProducts(productId: number, categoryId: number | number[], limit = 8): ProductCard[] {
  const ids = Array.isArray(categoryId) ? categoryId : [categoryId];
  return allProducts
    .filter((p) => p.status === "published" && p.id !== productId && inScope(p, ids))
    .sort((a, b) => binary(a.title, b.title))
    .slice(0, limit)
    .map((p) => ({ publicId: p.publicId, slug: p.slug, title: p.title, itemCode: p.itemCode, status: p.status, image: firstImage(p) }));
}

export function categoryTree() {
  const counts = new Map<number, number>();
  for (const p of allProducts) if (p.status === "published") for (const id of p.categoryIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  return allCategories.filter((c) => c.published).map((c) => ({ ...c, productCount: counts.get(c.id) ?? 0 }));
}
