import { PlumbingSolutionsPage } from "@/components/sites/prayag/product-category/plumbing-solutions/plumbing-solutions-page";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";

export const metadata = pageMetadata({
  title: "Plumbing Solutions for Homes & Commercial Spaces | Prayag",
  description:
    "Explore Prayag plumbing solutions for homes, commercial spaces and projects, including durable pipes, fittings and systems built for reliable water flow.",
  path: "/plumbing-solutions",
});

export default function PlumbingSolutionsRoute() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Plumbing Solutions", path: "/plumbing-solutions" }]} />
      <PlumbingSolutionsPage />
    </>
  );
}
