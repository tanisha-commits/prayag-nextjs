import { AgritechPage } from "@/components/sites/prayag/product-category/agritech/agritech-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

// The source page has no meta description.
export const metadata = pageMetadata({
  title: "Agritech | Prayag",
  path: "/agritech",
});

export default function AgritechRoute() {
  return (
    <>
      {/* "Agritec" is the source h1 text (sic). */}
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
