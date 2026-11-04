import { CeoPage } from "@/components/sites/prayag/ceo/ceo-page";
import { ceoBanner } from "@/components/sites/prayag/ceo/data";
import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { withPageContent, withSeo } from "@/lib/content/page-content";

const pageMetadataBase = pageMetadata({
  title: "Prayag Ceo Profile - Explore Official Information | Prayag",
  description:
    "Explore the Prayag CEO profile to learn about company leadership, vision, business direction and the growth of Prayag across bathroom and plumbing categories.",
  path: "/ceo-profile",
});

function CeoProfilePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "CEO Profile", path: "/ceo-profile" }]} />
      <PageBanner image={ceoBanner.image} title={ceoBanner.title} />
      <CeoPage />
    </>
  );
}

export default withPageContent("ceo-profile", CeoProfilePage);
export const generateMetadata = withSeo("ceo-profile", pageMetadataBase);
