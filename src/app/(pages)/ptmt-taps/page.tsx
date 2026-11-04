import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";

export function generateMetadata() {
  return catalogMetadata("ptmt-taps");
}

export default function CategoryLandingPage({ searchParams }: PageProps<"/ptmt-taps">) {
  return <CatalogRoute path="ptmt-taps" searchParams={searchParams} />;
}
