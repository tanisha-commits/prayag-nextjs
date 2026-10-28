import { CategoryPanel } from "@/components/sites/prayag/category-panel";
import { CustomerService } from "@/components/sites/prayag/customer-service";
import { ExperienceSection } from "@/components/sites/prayag/experience-section";
import { ExploreProducts } from "@/components/sites/prayag/explore-products";
import { HeroVideoSlider } from "@/components/sites/prayag/hero-video-slider";
import { LatestInsights } from "@/components/sites/prayag/latest-insights";
import { SiteFooter } from "@/components/sites/prayag/site-footer";
import { SiteHeader } from "@/components/sites/prayag/site-header";
import { SportingSpirit } from "@/components/sites/prayag/sporting-spirit";
import { WhyPrayag } from "@/components/sites/prayag/why-prayag";

// Source: https://prayagindia.com/ (Drupal page--homepage.html.twig).
// The source's "Stay in Touch" section is omitted: the live site hides it (`section.stay_touch { display: none }`).
export default function Home() {
  return (
    <>
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
