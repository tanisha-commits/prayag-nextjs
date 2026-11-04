import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { susBanner } from "@/components/sites/prayag/sustainability/data";
import { SusPage } from "@/components/sites/prayag/sustainability/sus-page";

export const metadata = pageMetadata({
  title: "Sustainable Manufacturing Information in India | Prayag",
  description:
    "Learn about sustainable manufacturing at Prayag, including practices, resource efficiency and product innovation aimed at reducing environmental impact.",
  path: "/sustainability",
});

export default function SustainabilityPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Sustainability", path: "/sustainability" }]} />
      <PageBanner image={susBanner.image} title={susBanner.title} className="sus-hero" />
      <SusPage />
    </>
  );
}
