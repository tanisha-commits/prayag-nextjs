import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { productVideoPage } from "@/components/sites/prayag/videos/data";
import { InlineVideoSection } from "@/components/sites/prayag/videos/video-sections";

export const metadata = pageMetadata({
  title: "Product Videos - Information, Support & Resources | Prayag",
  description:
    "Watch Prayag product videos to explore features, applications, installation insights and product ranges across bathroom, kitchen and plumbing solutions.",
  path: "/product-video",
});

export default function ProductVideoPage() {
  const { banner, cards } = productVideoPage;
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: banner.title, path: "/product-video" }]} />
      <PageBanner image={banner.image} imageAlt={banner.imageAlt} title={banner.title} />
      <InlineVideoSection cards={cards} />
    </>
  );
}
