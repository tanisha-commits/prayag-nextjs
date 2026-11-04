import { CompositePipesPage } from "@/components/sites/prayag/product-category/composite-pipes/composite-pipes-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

export const metadata = pageMetadata({
  title: "Composite Pipes for Water, Gas & Industry | Prayag",
  description:
    "Explore Prayag Composite Pipes with PE-AL-PE construction for water, gas and specialised applications, offering corrosion resistance, strength and durability.",
  path: "/composite-pipes",
});

export default function CompositePipesRoute() {
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
