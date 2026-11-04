import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";

export function generateMetadata() {
  return catalogMetadata("bathroom-accessories");
}

export default function CategoryLandingPage({ searchParams }: PageProps<"/bathroom-accessories">) {
  return <CatalogRoute path="bathroom-accessories" searchParams={searchParams} />;
}
