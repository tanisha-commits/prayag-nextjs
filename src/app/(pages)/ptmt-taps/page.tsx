import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";
import { withPageContent, withSeoFn } from "@/lib/content/page-content";

// Category landing. It reads ?page= and filter parameters, so it renders per request; under the
// statically generated [slug] route that would fail in production builds (DYNAMIC_SERVER_USAGE).
function baseGenerateMetadata() {
  return catalogMetadata("ptmt-taps");
}

function CategoryLandingPage({ searchParams }: PageProps<"/ptmt-taps">) {
  return <CatalogRoute path="ptmt-taps" searchParams={searchParams} />;
}

export default withPageContent("ptmt-taps", CategoryLandingPage);
export const generateMetadata = withSeoFn("ptmt-taps", baseGenerateMetadata);
