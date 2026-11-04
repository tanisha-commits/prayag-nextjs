import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";
import { withPageContent, withSeoFn } from "@/lib/content/page-content";

// Category landing. It reads ?page= and filter parameters, so it renders per request; under the
// statically generated [slug] route that would fail in production builds (DYNAMIC_SERVER_USAGE).
function baseGenerateMetadata() {
  return catalogMetadata("bathroom-accessories");
}

function CategoryLandingPage({ searchParams }: PageProps<"/bathroom-accessories">) {
  return <CatalogRoute path="bathroom-accessories" searchParams={searchParams} />;
}

export default withPageContent("bathroom-accessories", CategoryLandingPage);
export const generateMetadata = withSeoFn("bathroom-accessories", baseGenerateMetadata);
