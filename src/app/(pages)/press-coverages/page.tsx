import { PageBanner } from "@/components/sites/prayag/page-banner";
import { PressGallery } from "@/components/sites/prayag/press/press-gallery";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { pressItems } from "@/content/prayag/press/items";

export const metadata = pageMetadata({
  title: "Prayag India - Press Coverages",
  description:
    "Our aim is to keep everyone updated about our company through press coverages and other commercial advertisements.",
  path: "/press-coverages",
});

export default function PressCoveragesPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Press Coverages", path: "/press-coverages" }]} />
      <PageBanner image="/sites/prayag/files/2024-09/Banner.webp" title="Press Coverages" />
      <PressGallery items={pressItems} />
    </>
  );
}
