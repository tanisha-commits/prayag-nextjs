import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";

export function generateMetadata() {
  return catalogMetadata("storage-tank");
}

export default function CategoryLandingPage({ searchParams }: PageProps<"/storage-tank">) {
  return <CatalogRoute path="storage-tank" searchParams={searchParams} />;
}
