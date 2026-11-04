import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";

export function generateMetadata() {
  return catalogMetadata("faucets");
}

export default function CategoryLandingPage({ searchParams }: PageProps<"/faucets">) {
  return <CatalogRoute path="faucets" searchParams={searchParams} />;
}
