import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";
import { withPageContent, withSeoFn } from "@/lib/content/page-content";

// Category landing. It reads ?page= and filter parameters, so it renders per request; under the
// statically generated [slug] route that would fail in production builds (DYNAMIC_SERVER_USAGE).
function baseGenerateMetadata() {
  return catalogMetadata("water-heaters");
}

function CategoryLandingPage({ searchParams }: PageProps<"/water-heaters">) {
  return <CatalogRoute path="water-heaters" searchParams={searchParams} />;
}

export default withPageContent("water-heaters", CategoryLandingPage);
export const generateMetadata = withSeoFn("water-heaters", baseGenerateMetadata);
