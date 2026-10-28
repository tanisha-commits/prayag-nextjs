import { AboutPage } from "@/components/sites/prayag/about/about-page";
import { aboutBanner } from "@/components/sites/prayag/about/data";
import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

export const metadata = pageMetadata({
  title: "Prayag Polymers - Information, Support & Resources | Prayag",
  description:
    "Discover Prayag Polymers, its journey, product portfolio, growth and milestones across bathware, sanitaryware, plumbing and building solutions in India.",
  path: "/about-prayag",
});

export default function AboutPrayagPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "About Prayag", path: "/about-prayag" }]} />
      <PageBanner image={aboutBanner.image} title={aboutBanner.title} />
      <AboutPage />
    </>
  );
}
