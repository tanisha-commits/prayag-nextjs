import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";
import { withPageContent, withSeoFn } from "@/lib/content/page-content";

// Category landing. It reads ?page= and filter parameters, so it renders per request; under the
// statically generated [slug] route that would fail in production builds (DYNAMIC_SERVER_USAGE).
function baseGenerateMetadata() {
  return catalogMetadata("kitchen-sinks");
}

function CategoryLandingPage({ searchParams }: PageProps<"/kitchen-sinks">) {
  return <CatalogRoute path="kitchen-sinks" searchParams={searchParams} />;
}

export default withPageContent("kitchen-sinks", CategoryLandingPage);
export const generateMetadata = withSeoFn("kitchen-sinks", baseGenerateMetadata);
