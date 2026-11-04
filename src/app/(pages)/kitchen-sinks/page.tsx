import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";

export function generateMetadata() {
  return catalogMetadata("kitchen-sinks");
}

export default function CategoryLandingPage({ searchParams }: PageProps<"/kitchen-sinks">) {
  return <CatalogRoute path="kitchen-sinks" searchParams={searchParams} />;
}
