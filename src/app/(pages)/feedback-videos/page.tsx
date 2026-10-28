import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { feedbackVideosPage } from "@/components/sites/prayag/videos/data";
import { InlineVideoSection } from "@/components/sites/prayag/videos/video-sections";

export const metadata = pageMetadata({
  title: "Customer Feedback Videos Information in India | Prayag",
  description:
    "Watch customer feedback videos from Prayag to hear experiences and perspectives related to its bathroom, plumbing and home improvement product ranges.",
  path: "/feedback-videos",
});

export default function FeedbackVideosPage() {
  const { banner, cards } = feedbackVideosPage;
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: banner.title, path: "/feedback-videos" }]} />
      <PageBanner image={banner.image} imageAlt={banner.imageAlt} title={banner.title} />
      <InlineVideoSection cards={cards} />
    </>
  );
}
