import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";

export function generateMetadata() {
  return catalogMetadata("pipes-fittings");
}

export default function CategoryLandingPage({ searchParams }: PageProps<"/pipes-fittings">) {
  return <CatalogRoute path="pipes-fittings" searchParams={searchParams} />;
}
