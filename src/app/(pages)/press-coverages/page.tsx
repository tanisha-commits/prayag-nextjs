import { PageBanner } from "@/components/sites/prayag/page-banner";
import { PressGallery } from "@/components/sites/prayag/press/press-gallery";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { pressItems } from "@/content/prayag/press/items";
import { imageDims } from "@/lib/image-dimensions";
import { responsiveImg } from "@/lib/optimized-image";

export const metadata = pageMetadata({
  title: "Prayag India - Press Coverages",
  description:
    "Our aim is to keep everyone updated about our company through press coverages and other commercial advertisements.",
  path: "/press-coverages",
});

function pressImages() {
  return pressItems.map((item) => {
    const dims = imageDims(item.image);
    const ratio = dims ? dims.width / dims.height : 1;
    const h = (px: number) => `${Math.ceil(px * ratio)}px`;
    return {
      ...item,
      card: responsiveImg(item.image, dims, `(min-width: 992px) max(25vw, ${h(199)}), (min-width: 768px) max(50vw, ${h(199)}), max(50vw, ${h(180)})`),
      thumb: responsiveImg(item.image, dims, `max(96px, ${h(64)})`),
      full: responsiveImg(item.image, dims, "100vw"),
    };
  });
}

export default function PressCoveragesPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Press Coverages", path: "/press-coverages" }]} />
      <PageBanner image="/sites/prayag/files/2024-09/Banner.webp" title="Press Coverages" />
      <PressGallery items={pressImages()} />
    </>
  );
}
