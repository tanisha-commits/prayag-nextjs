import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";
import { withPageContent, withSeoFn } from "@/lib/content/page-content";

// Category landing. It reads ?page= and filter parameters, so it renders per request; under the
// statically generated [slug] route that would fail in production builds (DYNAMIC_SERVER_USAGE).
function baseGenerateMetadata() {
  return catalogMetadata("storage-tank");
}

function CategoryLandingPage({ searchParams }: PageProps<"/storage-tank">) {
  return <CatalogRoute path="storage-tank" searchParams={searchParams} />;
}

export default withPageContent("storage-tank", CategoryLandingPage);
export const generateMetadata = withSeoFn("storage-tank", baseGenerateMetadata);
