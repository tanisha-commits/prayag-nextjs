import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";
import { withPageContent, withSeoFn } from "@/lib/content/page-content";

// Category landing. It reads ?page= and filter parameters, so it renders per request; under the
// statically generated [slug] route that would fail in production builds (DYNAMIC_SERVER_USAGE).
function baseGenerateMetadata() {
  return catalogMetadata("pipes-fittings");
}

function CategoryLandingPage({ searchParams }: PageProps<"/pipes-fittings">) {
  return <CatalogRoute path="pipes-fittings" searchParams={searchParams} />;
}

export default withPageContent("pipes-fittings", CategoryLandingPage);
export const generateMetadata = withSeoFn("pipes-fittings", baseGenerateMetadata);
