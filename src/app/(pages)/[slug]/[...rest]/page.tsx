import type { Metadata } from "next";
import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";

export async function generateMetadata({ params }: PageProps<"/[slug]/[...rest]">): Promise<Metadata> {
  const { slug, rest } = await params;
  return catalogMetadata([slug, ...rest].join("/"));
}

export default async function NestedCategoryPage({ params, searchParams }: PageProps<"/[slug]/[...rest]">) {
  const { slug, rest } = await params;
  return <CatalogRoute path={[slug, ...rest].join("/")} searchParams={searchParams} />;
}
