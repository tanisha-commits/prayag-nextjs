import { PprPipesPage } from "@/components/sites/prayag/product-category/ppr-pipes/ppr-pipes-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

export const metadata = pageMetadata({
  title: "PPR Pipes for Hot, Cold Water & HVAC Systems | Prayag",
  description:
    "Explore Prayag PPR Pipes for hot and cold water, HVAC and industrial systems, built for heat resistance, leak-proof joints, strength and long service life.",
  path: "/ppr-pipes",
});

export default function PprPipesRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Plumbing Solutions", path: "/plumbing-solutions" },
          { name: "PPR Pipes", path: "/ppr-pipes" },
        ]}
      />
      <PprPipesPage />
    </>
  );
}
