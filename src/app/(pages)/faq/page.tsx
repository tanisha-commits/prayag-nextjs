import { FaqTabs } from "@/components/sites/prayag/faq/faq-tabs";
import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { faqTabs } from "@/content/prayag/faq/faq";

export const metadata = pageMetadata({
  title: "Prayag Faqs Information for Homes & Projects | Prayag",
  description:
    "Explore Prayag FAQs for answers about products, services, support, installation, maintenance and customer queries related to bathroom and plumbing solutions.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Faq", path: "/faq" }]} />
      {/* Source banner is the theme image FAQ.webp with alt "Banner Image"; title reads "Faq". */}
      <PageBanner image="/sites/prayag/theme/FAQ.webp" imageAlt="Banner Image" title="Faq" />
      <FaqTabs tabs={faqTabs} />
    </>
  );
}
