import { CasingPipesPage } from "@/components/sites/prayag/product-category/casing-pipes/casing-pipes-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { withPageContent, withSeo } from "@/lib/content/page-content";

const pageMetadataBase = pageMetadata({
  title: "uPVC Casing Pipes for Borewell Protection | Prayag",
  description:
    "Choose Prayag uPVC Casing Pipes for borewell protection, strong structural support and corrosion resistance across domestic, agricultural and industrial use.",
  path: "/casing-pipes",
});

function CasingPipesRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Plumbing Solutions", path: "/plumbing-solutions" },
          { name: "Casing Pipes", path: "/casing-pipes" },
        ]}
      />
      <CasingPipesPage />
    </>
  );
}

export default withPageContent("casing-pipes", CasingPipesRoute);
export const generateMetadata = withSeo("casing-pipes", pageMetadataBase);
