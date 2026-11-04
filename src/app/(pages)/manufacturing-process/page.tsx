import { mfBanner } from "@/components/sites/prayag/manufacturing/data";
import { MfPage } from "@/components/sites/prayag/manufacturing/mf-page";
import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { withPageContent, withSeo } from "@/lib/content/page-content";

const pageMetadataBase = pageMetadata({
  title: "Manufacturing Process Information for Indian Homes | Prayag",
  description:
    "Explore the manufacturing process at Prayag and learn how bathroom, sanitaryware and plumbing products are produced with attention to quality and performance.",
  path: "/manufacturing-process",
});

function ManufacturingProcessPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Manufacturing Process", path: "/manufacturing-process" }]} />
      <PageBanner image={mfBanner.image} title={mfBanner.title} />
      <MfPage />
    </>
  );
}

export default withPageContent("manufacturing-process", ManufacturingProcessPage);
export const generateMetadata = withSeo("manufacturing-process", pageMetadataBase);
