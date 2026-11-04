import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { tvAdsPage } from "@/components/sites/prayag/videos/data";
import { TvVideoSection } from "@/components/sites/prayag/videos/video-sections";
import { withPageContent, withSeo } from "@/lib/content/page-content";

// Source <title> really is "Print Advertisement" on this page (kept 1:1).
const pageMetadataBase = pageMetadata({
  title: "Prayag India - Print Advertisement",
  description:
    "We aim to provide the best products and keep everyone updated about our company through press coverage and other commercial advertisements.",
  path: "/video-tv-advertisement",
});

function VideoTvAdvertisementPage() {
  const { banner, cards } = tvAdsPage;
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: banner.title, path: "/video-tv-advertisement" }]} />
      <PageBanner image={banner.image} imageAlt={banner.imageAlt} title={banner.title} />
      <TvVideoSection cards={cards} />
    </>
  );
}

export default withPageContent("video-tv-advertisement", VideoTvAdvertisementPage);
export const generateMetadata = withSeo("video-tv-advertisement", pageMetadataBase);
