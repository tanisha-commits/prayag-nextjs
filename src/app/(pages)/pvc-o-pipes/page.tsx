import { PvcOPipesPage } from "@/components/sites/prayag/product-category/pvc-o-pipes/pvc-o-pipes-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { withPageContent, withSeo } from "@/lib/content/page-content";

const pageMetadataBase = pageMetadata({
  title: "PVC-O Pipes for High-Pressure Water Supply | Prayag",
  description:
    "Explore Prayag PVC-O Pipes for high-pressure water supply, irrigation and infrastructure, with high flow, impact resistance, durability and easy installation.",
  path: "/pvc-o-pipes",
});

function PvcOPipesRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Plumbing Solutions", path: "/plumbing-solutions" },
          { name: "PVC-O Pipes", path: "/pvc-o-pipes" },
        ]}
      />
      <PvcOPipesPage />
    </>
  );
}

export default withPageContent("pvc-o-pipes", PvcOPipesRoute);
export const generateMetadata = withSeo("pvc-o-pipes", pageMetadataBase);
