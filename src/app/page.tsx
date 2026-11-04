import { CategoryPanel } from "@/components/sites/prayag/category-panel";
import { CustomerService } from "@/components/sites/prayag/customer-service";
import { ExperienceSection } from "@/components/sites/prayag/experience-section";
import { ExploreProducts } from "@/components/sites/prayag/explore-products";
import { HeroVideoSlider } from "@/components/sites/prayag/hero-video-slider";
import { LatestInsights } from "@/components/sites/prayag/latest-insights";
import { SITE_URL, pageMetadata } from "@/components/sites/prayag/seo";
import { SiteFooter } from "@/components/sites/prayag/site-footer";
import { SiteHeader } from "@/components/sites/prayag/site-header";
import { SportingSpirit } from "@/components/sites/prayag/sporting-spirit";
import { WhyPrayag } from "@/components/sites/prayag/why-prayag";
import { withPageContent, withSeo } from "@/lib/content/page-content";

const pageMetadataBase = pageMetadata({
  title: "Prayag Polymers Limited - India's No.1 Sanitaryware Manufacturer",
  description:
    "Prayag Polymers Limited is India’s leading Sanitaryware manufacturing brand. It offers a premium, wide range of reliable, and affordable sanitary products in India.",
  path: "/",
  image: "/sites/prayag/theme/logo.png",
});

// The source homepage's structured data, with the same facts. Organization appears once (the source
// repeats it); the logo and search URLs point at addresses this site serves.
const STRUCTURED_DATA = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Prayag India",
    alternateName: "Prayag India",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/sites/prayag/theme/logo.png`,
    sameAs: [
      "https://www.facebook.com/prayaglife/",
      "https://twitter.com/prayaglife",
      "https://www.instagram.com/prayaglife/",
      "https://www.youtube.com/channel/UCCBcJ4tcq8yvx38Vc2xfBZQ",
      "https://www.linkedin.com/company/prayagindia.com/",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Prayag India",
    image: `${SITE_URL}/sites/prayag/theme/logo.png`,
    url: `${SITE_URL}/`,
    telephone: "1800 257 0304",
    address: {
      "@type": "PostalAddress",
      streetAddress: "2483-84, Prayag Infinity House, Nalwa Street, Pahar Ganj",
      addressLocality: "New Delhi",
      postalCode: "110055",
      addressCountry: "IN",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:00",
    },
    priceRange: "$$",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Prayag India: India's No.1 Sanitaryware Manufacturer",
    url: `${SITE_URL}/`,
    description:
      "Prayag India is a leading manufacturer and distributor of sanitary ware products and bathroom accessories, offering over 2500 products including showers, kitchen sinks, taps, faucets, and more.",
    inLanguage: "en",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: `${SITE_URL}/`,
    name: "Prayag India",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search/node?keys={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
];

// Source: https://prayagindia.com/ (Drupal page--homepage.html.twig).
// The source's "Stay in Touch" section is omitted: the live site hides it (`section.stay_touch { display: none }`).
function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA).replace(/</g, "\\u003c") }} />
      <SiteHeader />
      <CategoryPanel />
      <main>
        <HeroVideoSlider />
        <ExploreProducts />
        <WhyPrayag />
        <ExperienceSection />
        <CustomerService />
        <SportingSpirit />
        <LatestInsights />
      </main>
      <SiteFooter />
    </>
  );
}

export default withPageContent("home", Home);
export const generateMetadata = withSeo("home", pageMetadataBase);
