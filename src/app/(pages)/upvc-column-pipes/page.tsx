import { UpvcColumnPipesPage } from "@/components/sites/prayag/product-category/upvc-column-pipes/upvc-column-pipes-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

export const metadata = pageMetadata({
  title: "Best UPVC Column Pipe Manufacturers in India | Prayag",
  description:
    "Explore Prayag uPVC column pipes for borewells and submersible pumps, offering high strength, corrosion resistance and reliable water flow.",
  path: "/upvc-column-pipes",
});

export default function UpvcColumnPipesRoute() {
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
