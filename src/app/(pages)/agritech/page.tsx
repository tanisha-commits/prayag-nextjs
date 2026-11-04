import { AgritechPage } from "@/components/sites/prayag/product-category/agritech/agritech-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { withPageContent, withSeo } from "@/lib/content/page-content";

// The source page has no meta description.
const pageMetadataBase = pageMetadata({
  title: "Agritech | Prayag",
  path: "/agritech",
});

function AgritechRoute() {
  return (
    <>
      {/* "Agritec" is the source h1 text (sic). */}
      <BreadcrumbJsonLd
        items={[
          { name: "Plumbing Solutions", path: "/plumbing-solutions" },
          { name: "Agritec", path: "/agritech" },
        ]}
      />
      <AgritechPage />
    </>
  );
}

export default withPageContent("agritech", AgritechRoute);
export const generateMetadata = withSeo("agritech", pageMetadataBase);
