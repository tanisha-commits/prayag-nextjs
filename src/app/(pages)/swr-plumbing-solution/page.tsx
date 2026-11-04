import { SwrPlumbingSolutionPage } from "@/components/sites/prayag/product-category/swr-plumbing-solution/swr-plumbing-solution-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { withPageContent, withSeo } from "@/lib/content/page-content";

// The source page has no meta description.
const pageMetadataBase = pageMetadata({
  title: "SWR | Prayag",
  path: "/swr-plumbing-solution",
});

function SwrPlumbingSolutionRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Plumbing Solutions", path: "/plumbing-solutions" },
          { name: "SWR", path: "/swr-plumbing-solution" },
        ]}
      />
      <SwrPlumbingSolutionPage />
    </>
  );
}

export default withPageContent("swr-plumbing-solution", SwrPlumbingSolutionRoute);
export const generateMetadata = withSeo("swr-plumbing-solution", pageMetadataBase);
