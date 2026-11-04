import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";

export function generateMetadata() {
  return catalogMetadata("hardware");
}

export default function CategoryLandingPage({ searchParams }: PageProps<"/hardware">) {
  return <CatalogRoute path="hardware" searchParams={searchParams} />;
}
