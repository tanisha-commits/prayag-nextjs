import { PageBanner } from "@/components/sites/prayag/page-banner";
import { PressGallery } from "@/components/sites/prayag/press/press-gallery";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { getContent } from "@/lib/content";
import { imageDims } from "@/lib/image-dimensions";
import { responsiveImg } from "@/lib/optimized-image";
import { withPageContent, withSeo } from "@/lib/content/page-content";

const pageMetadataBase = pageMetadata({
  title: "Prayag India - Press Coverages",
  description:
    "Our aim is to keep everyone updated about our company through press coverages and other commercial advertisements.",
  path: "/press-coverages",
});

/**
 * Optimizer candidates for the 96 press scans (originals up to several MB each). Card images are
 * `width:100%` × 199px (180px under 768px) with `object-fit: cover`, so a wide scan needs
 * max(column width, box height × aspect ratio) pixels; columns are 25vw from 992px, else 50vw.
 * Lightbox thumbnails are 96×64 covers; the lightbox image is at most the viewport.
 */
function pressImages() {
  return getContent("pages/press").items.map((item) => {
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

function PressCoveragesPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Press Coverages", path: "/press-coverages" }]} />
      <PageBanner image="/sites/prayag/files/2024-09/Banner.webp" title="Press Coverages" />
      <PressGallery items={pressImages()} />
    </>
  );
}

export default withPageContent("press-coverages", PressCoveragesPage);
export const generateMetadata = withSeo("press-coverages", pageMetadataBase);
