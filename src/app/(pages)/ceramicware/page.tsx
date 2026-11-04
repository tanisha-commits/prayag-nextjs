import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";

export function generateMetadata() {
  return catalogMetadata("ceramicware");
}

export default function CategoryLandingPage({ searchParams }: PageProps<"/ceramicware">) {
  return <CatalogRoute path="ceramicware" searchParams={searchParams} />;
}
