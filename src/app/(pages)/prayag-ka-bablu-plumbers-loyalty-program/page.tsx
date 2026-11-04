import { BabluPage } from "@/components/sites/prayag/product-category/bablu/bablu-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { withPageContent, withSeo } from "@/lib/content/page-content";

const pageMetadataBase = pageMetadata({
  title: "PRAYAG KA BABLU Plumbers’ Loyalty Program | Prayag",
  // Verbatim from the source, including the missing space after "Prayag".
  description:
    "Connect with PrayagWe are Prayag, a company with a vision to produce products that are above the extraordinary. Reimagining to create new innovations in product design and development that has been the hallmark of every market segment that we have entered into.",
  path: "/prayag-ka-bablu-plumbers-loyalty-program",
});

function BabluLoyaltyProgramRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "PRAYAG KA BABLU Plumbers’ Loyalty Program", path: "/prayag-ka-bablu-plumbers-loyalty-program" },
        ]}
      />
      <BabluPage />
    </>
  );
}

export default withPageContent("prayag-ka-bablu-plumbers-loyalty-program", BabluLoyaltyProgramRoute);
export const generateMetadata = withSeo("prayag-ka-bablu-plumbers-loyalty-program", pageMetadataBase);
