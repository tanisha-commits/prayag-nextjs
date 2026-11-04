import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";
import { withPageContent, withSeoFn } from "@/lib/content/page-content";

// Category landing. It reads ?page= and filter parameters, so it renders per request; under the
// statically generated [slug] route that would fail in production builds (DYNAMIC_SERVER_USAGE).
function baseGenerateMetadata() {
  return catalogMetadata("ceramicware");
}

function CategoryLandingPage({ searchParams }: PageProps<"/ceramicware">) {
  return <CatalogRoute path="ceramicware" searchParams={searchParams} />;
}

export default withPageContent("ceramicware", CategoryLandingPage);
export const generateMetadata = withSeoFn("ceramicware", baseGenerateMetadata);
