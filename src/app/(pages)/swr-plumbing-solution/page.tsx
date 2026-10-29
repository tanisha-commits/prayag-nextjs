import { SwrPlumbingSolutionPage } from "@/components/sites/prayag/product-category/swr-plumbing-solution/swr-plumbing-solution-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

// The source page has no meta description.
export const metadata = pageMetadata({
  title: "SWR | Prayag",
  path: "/swr-plumbing-solution",
});

export default function SwrPlumbingSolutionRoute() {
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
