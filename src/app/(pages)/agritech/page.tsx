import { AgritechPage } from "@/components/sites/prayag/product-category/agritech/agritech-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

export const metadata = pageMetadata({
  title: "Agritech | Prayag",
  path: "/agritech",
});

export default function AgritechRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Plumbing Solutions", path: "/plumbing-solutions" },
          { name: "Agritec", path: "/agritech" },
        ]}
      />
      <AgritechPage />
    </>
  );
}
