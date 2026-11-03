import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { publicCategory, publicList, publicProduct, publicSubcategories } from "@/lib/catalog/public";
import { queryFromParams } from "@/lib/catalog/url";
import { LIVE_CATEGORY_PAGES } from "./category-page/config";
import { LIVE_CATEGORY_DATA, LIVE_PAGE_SIZE, LiveCategoryPage } from "./category-page/live-category-page";
import { CategoryView } from "./category-view";
import { LiveProductPage } from "./product-page/live-product-page";

type SearchParams = Record<string, string | string[] | undefined>;

/** Metadata for a root-level product or a category path (e.g. "faucets", "ceramicware/wash-basin"). */
export function catalogMetadata(path: string): Metadata {
  const product = publicProduct(path);
  if (product)
    return pageMetadata({
      title: product.seoTitle || `${product.title} | Prayag`,
      description: product.seoDescription || product.shortDescription || undefined,
      path: `/${product.slug}`,
      image: product.images[0]?.src,
    });
  const category = publicCategory(path);
  if (!category) return {};
  // Admin-set SEO wins; otherwise the live page's own title and description.
  const live = LIVE_CATEGORY_DATA[category.slug];
  const meta = pageMetadata({
    title: category.seoTitle || live?.metaTitle || `${category.name} | Prayag`,
    description: category.seoDescription || live?.metaDescription || category.description || undefined,
    path: `/${category.slug}`,
  });
  // Nested paths (/kitchen-sinks/quartz) are local filter views; the live site redirects them home.
  return category.parent ? { ...meta, robots: { index: false, follow: true } } : meta;
}

export async function CatalogRoute({ path, searchParams }: { path: string; searchParams: Promise<SearchParams> }) {
  const product = publicProduct(path);
  if (product) {
    const primary = product.categories[0];
    // Product structured data from stored fields only (no prices, ratings or claims).
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      ...(product.itemCode ? { sku: product.itemCode } : {}),
      brand: { "@type": "Brand", name: "Prayag" },
      ...(product.images[0] ? { image: product.images.map((i) => `https://prayagindia.com${i.src}`) } : {}),
      ...(product.shortDescription ? { description: product.shortDescription } : {}),
      url: `https://prayagindia.com/${product.slug}`,
    };
    return (
      <>
        <BreadcrumbJsonLd items={[...(primary ? [{ name: primary.name, path: `/${primary.slug}` }] : []), { name: product.title, path: `/${product.slug}` }]} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <LiveProductPage product={product} />
      </>
    );
  }
  const category = publicCategory(path);
  if (!category) notFound();
  const live = LIVE_CATEGORY_PAGES[category.slug];
  if (live) {
    // Source landing page: Drupal's 0-based ?page=, 9 per page in the source listing order.
    const params = await searchParams;
    const pageIndex = Math.max(0, Math.floor(Number(params.page)) || 0);
    const query = { ...queryFromParams({ ...params, page: undefined }, category.slug), page: pageIndex + 1 };
    const result = publicList(query, { pageSize: live.layout === "filters" ? LIVE_PAGE_SIZE : 100, orderSlugs: LIVE_CATEGORY_DATA[category.slug].liveOrder });
    const subcategories = live.filters.some((f) => f.key === "subcategory") ? publicSubcategories(category.slug) : [];
    return (
      <>
        <BreadcrumbJsonLd items={[{ name: category.name, path: `/${category.slug}` }]} />
        <LiveCategoryPage slug={category.slug} query={query} result={result} subcategories={subcategories} />
      </>
    );
  }
  const query = queryFromParams(await searchParams, category.slug);
  const result = publicList(query);
  return (
    <>
      <BreadcrumbJsonLd items={[...(category.parent ? [{ name: category.parent.name, path: `/${category.parent.slug}` }] : []), { name: category.name, path: `/${category.slug}` }]} />
      <CategoryView category={category} query={query} result={result} />
    </>
  );
}
