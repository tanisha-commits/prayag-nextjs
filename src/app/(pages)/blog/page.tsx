import { BlogList } from "@/components/sites/prayag/blog/blog-list";
import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { blogIndex } from "@/lib/blog";

export const metadata = pageMetadata({
  title: "Bathroom And Plumbing Blog: Guide for Indian Homes | Prayag",
  description:
    "Read the bathroom and plumbing blog from Prayag for practical guides, product comparisons, selection tips, installation insights and ideas for modern spaces.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Blog", path: "/blog" }]} />
      <PageBanner image="/sites/prayag/files/2024-08/blog.webp" title="Blog" />
      <BlogList posts={blogIndex} />
    </>
  );
}
