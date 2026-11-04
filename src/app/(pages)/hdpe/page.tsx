import { HdpePage } from "@/components/sites/prayag/product-category/hdpe/hdpe-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { withPageContent, withSeo } from "@/lib/content/page-content";

// The source page has no meta description.
const pageMetadataBase = pageMetadata({
  title: "HDPE | Prayag",
  path: "/hdpe",
});

function HdpeRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Plumbing Solutions", path: "/plumbing-solutions" },
          { name: "HDPE Pipes", path: "/hdpe" },
        ]}
      />
      <HdpePage />
    </>
  );
}

export default withPageContent("hdpe", HdpeRoute);
export const generateMetadata = withSeo("hdpe", pageMetadataBase);
