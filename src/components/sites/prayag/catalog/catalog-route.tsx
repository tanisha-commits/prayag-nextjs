import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { publicCategory, publicList, publicProduct } from "@/lib/catalog/public";
import { queryFromParams } from "@/lib/catalog/url";
import { CategoryView } from "./category-view";
import { ProductView } from "./product-view";

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
  if (category)
    return pageMetadata({
      title: category.seoTitle || `${category.name} | Prayag`,
      description: category.seoDescription || category.description || undefined,
      path: `/${category.slug}`,
    });
  return {};
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
        <ProductView product={product} />
      </>
    );
  }
  const category = publicCategory(path);
  if (!category) notFound();
  const query = queryFromParams(await searchParams, category.slug);
  const result = publicList(query);
  return (
    <>
      <BreadcrumbJsonLd items={[...(category.parent ? [{ name: category.parent.name, path: `/${category.parent.slug}` }] : []), { name: category.name, path: `/${category.slug}` }]} />
      <CategoryView category={category} query={query} result={result} />
    </>
  );
}
