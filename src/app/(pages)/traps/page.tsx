import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";

export function generateMetadata() {
  return catalogMetadata("traps");
}

export default function CategoryLandingPage({ searchParams }: PageProps<"/traps">) {
  return <CatalogRoute path="traps" searchParams={searchParams} />;
}
