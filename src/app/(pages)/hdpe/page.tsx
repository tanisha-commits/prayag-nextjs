import { HdpePage } from "@/components/sites/prayag/product-category/hdpe/hdpe-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

// The source page has no meta description.
export const metadata = pageMetadata({
  title: "HDPE | Prayag",
  path: "/hdpe",
});

export default function HdpeRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Plumbing Solutions", path: "/plumbing-solutions" },
          { name: "HDPE Pipes", path: "/hdpe" },
        ]}
      />
      <HdpePage />
    </>
  );
}
