import { CompositePipesPage } from "@/components/sites/prayag/product-category/composite-pipes/composite-pipes-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { withPageContent, withSeo } from "@/lib/content/page-content";

const pageMetadataBase = pageMetadata({
  title: "Composite Pipes for Water, Gas & Industry | Prayag",
  description:
    "Explore Prayag Composite Pipes with PE-AL-PE construction for water, gas and specialised applications, offering corrosion resistance, strength and durability.",
  path: "/composite-pipes",
});

function CompositePipesRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Plumbing Solutions", path: "/plumbing-solutions" },
          { name: "Composite Pipes", path: "/composite-pipes" },
        ]}
      />
      <CompositePipesPage />
    </>
  );
}

export default withPageContent("composite-pipes", CompositePipesRoute);
export const generateMetadata = withSeo("composite-pipes", pageMetadataBase);
