import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

export const metadata = pageMetadata({
  title: "Prayag Ceo Profile - Explore Official Information | Prayag",
  description:
    "Explore the Prayag CEO profile to learn about company leadership, vision, business direction and the growth of Prayag across bathroom and plumbing categories.",
  path: "/ceo-profile",
});

export default function CeoProfilePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "CEO Profile", path: "/ceo-profile" }]} />
      <PageBanner image="/sites/prayag/files/2025-02/banner.webp" title="CEO Profile" />
    </>
  );
}
