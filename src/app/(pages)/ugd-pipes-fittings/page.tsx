import { UgdPage } from "@/components/sites/prayag/product-category/ugd-pipes-fittings/ugd-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

export const metadata = pageMetadata({
  title: "UGD Pipes & Fittings for Drainage Systems | Prayag",
  description:
    "Explore Prayag UGD Pipes & Fittings for underground drainage and sewerage, built for corrosion resistance, high flow efficiency and long-lasting performance.",
  path: "/ugd-pipes-fittings",
});

export default function UgdPipesFittingsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Plumbing Solutions", path: "/plumbing-solutions" },
          { name: "UGD Pipes & Fittings", path: "/ugd-pipes-fittings" },
        ]}
      />
      <UgdPage />
    </>
  );
}
