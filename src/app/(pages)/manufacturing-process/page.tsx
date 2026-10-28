import { mfBanner } from "@/components/sites/prayag/manufacturing/data";
import { MfPage } from "@/components/sites/prayag/manufacturing/mf-page";
import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

export const metadata = pageMetadata({
  title: "Manufacturing Process Information for Indian Homes | Prayag",
  description:
    "Explore the manufacturing process at Prayag and learn how bathroom, sanitaryware and plumbing products are produced with attention to quality and performance.",
  path: "/manufacturing-process",
});

export default function ManufacturingProcessPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Manufacturing Process", path: "/manufacturing-process" }]} />
      <PageBanner image={mfBanner.image} title={mfBanner.title} />
      <MfPage />
    </>
  );
}
