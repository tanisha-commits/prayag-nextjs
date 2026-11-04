import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { susBanner } from "@/components/sites/prayag/sustainability/data";
import { SusPage } from "@/components/sites/prayag/sustainability/sus-page";
import { withPageContent, withSeo } from "@/lib/content/page-content";

const pageMetadataBase = pageMetadata({
  title: "Sustainable Manufacturing Information in India | Prayag",
  description:
    "Learn about sustainable manufacturing at Prayag, including practices, resource efficiency and product innovation aimed at reducing environmental impact.",
  path: "/sustainability",
});

function SustainabilityPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Sustainability", path: "/sustainability" }]} />
      {/* `.sus-hero` restyles the banner title panel (left-aligned, accent bar), as the source. */}
      <PageBanner image={susBanner.image} title={susBanner.title} className="sus-hero" />
      <SusPage />
    </>
  );
}

export default withPageContent("sustainability", SustainabilityPage);
export const generateMetadata = withSeo("sustainability", pageMetadataBase);
