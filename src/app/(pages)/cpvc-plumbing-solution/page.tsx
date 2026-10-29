import { CpvcPage } from "@/components/sites/prayag/product-category/cpvc-plumbing-solution/cpvc-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

export const metadata = pageMetadata({
  title: "cPVC Pipes & Fittings for Hot & Cold Water | Prayag",
  description:
    "Explore Prayag cPVC Pipes for hot and cold water plumbing, designed for durability, corrosion resistance, leak-proof joints and reliable long-term performance.",
  path: "/cpvc-plumbing-solution",
});

export default function CpvcPlumbingSolutionPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Plumbing Solutions", path: "/plumbing-solutions" },
          { name: "cPVC Pipes", path: "/cpvc-plumbing-solution" },
        ]}
      />
      <CpvcPage />
    </>
  );
}
