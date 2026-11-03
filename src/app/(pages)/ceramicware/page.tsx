import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";

// Category landing. It reads ?page= and filter parameters, so it renders per request; under the
// statically generated [slug] route that would fail in production builds (DYNAMIC_SERVER_USAGE).
export function generateMetadata() {
  return catalogMetadata("ceramicware");
}

export default function CategoryLandingPage({ searchParams }: PageProps<"/ceramicware">) {
  return <CatalogRoute path="ceramicware" searchParams={searchParams} />;
}
