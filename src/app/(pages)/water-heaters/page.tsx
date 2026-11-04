import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";

export function generateMetadata() {
  return catalogMetadata("water-heaters");
}

export default function CategoryLandingPage({ searchParams }: PageProps<"/water-heaters">) {
  return <CatalogRoute path="water-heaters" searchParams={searchParams} />;
}
