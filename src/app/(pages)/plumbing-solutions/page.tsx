import { PlumbingSolutionsPage } from "@/components/sites/prayag/product-category/plumbing-solutions/plumbing-solutions-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { withPageContent, withSeo } from "@/lib/content/page-content";

const pageMetadataBase = pageMetadata({
  title: "Plumbing Solutions for Homes & Commercial Spaces | Prayag",
  description:
    "Explore Prayag plumbing solutions for homes, commercial spaces and projects, including durable pipes, fittings and systems built for reliable water flow.",
  path: "/plumbing-solutions",
});

function PlumbingSolutionsRoute() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Plumbing Solutions", path: "/plumbing-solutions" }]} />
      <PlumbingSolutionsPage />
    </>
  );
}

export default withPageContent("plumbing-solutions", PlumbingSolutionsRoute);
export const generateMetadata = withSeo("plumbing-solutions", pageMetadataBase);
