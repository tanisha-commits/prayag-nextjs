import { UpvcColumnPipesPage } from "@/components/sites/prayag/product-category/upvc-column-pipes/upvc-column-pipes-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { withPageContent, withSeo } from "@/lib/content/page-content";

const pageMetadataBase = pageMetadata({
  title: "Best UPVC Column Pipe Manufacturers in India | Prayag",
  description:
    "Explore Prayag uPVC column pipes for borewells and submersible pumps, offering high strength, corrosion resistance and reliable water flow.",
  path: "/upvc-column-pipes",
});

function UpvcColumnPipesRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Plumbing Solutions", path: "/plumbing-solutions" },
          { name: "uPVC Column Pipes", path: "/upvc-column-pipes" },
        ]}
      />
      <UpvcColumnPipesPage />
    </>
  );
}

export default withPageContent("upvc-column-pipes", UpvcColumnPipesRoute);
export const generateMetadata = withSeo("upvc-column-pipes", pageMetadataBase);
