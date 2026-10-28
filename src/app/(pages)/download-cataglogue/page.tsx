import { CatalogueGrid } from "@/components/sites/prayag/catalogue/catalogue-grid";
import { catalogueBanner } from "@/components/sites/prayag/catalogue/data";
import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

export const metadata = pageMetadata({
  title: "Prayag Product Catalogue Information in India | Prayag",
  description:
    "Download the Prayag product catalogue to explore bathroom fittings, sanitaryware, pipes, kitchen sinks, water heaters, accessories and other product ranges.",
  path: "/download-cataglogue",
});

/** /download-cataglogue — the misspelt slug is the source URL and is kept on purpose. */
export default function DownloadCatalogguePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Download Cataglogue", path: "/download-cataglogue" }]} />
      <PageBanner image={catalogueBanner} title="Download Cataglogue" />
      <CatalogueGrid />
    </>
  );
}
