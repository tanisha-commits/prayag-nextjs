import { BlogList } from "@/components/sites/prayag/blog/blog-list";
import { PageBanner } from "@/components/sites/prayag/page-banner";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { getBlogIndex } from "@/lib/blog";
import { withPageContent, withSeo } from "@/lib/content/page-content";

const pageMetadataBase = pageMetadata({
  title: "Bathroom And Plumbing Blog: Guide for Indian Homes | Prayag",
  description:
    "Read the bathroom and plumbing blog from Prayag for practical guides, product comparisons, selection tips, installation insights and ideas for modern spaces.",
  path: "/blog",
});

function BlogPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Blog", path: "/blog" }]} />
      <PageBanner image="/sites/prayag/files/2024-08/blog.webp" title="Blog" />
      <BlogList posts={getBlogIndex()} />
    </>
  );
}

export default withPageContent("blog", BlogPage);
export const generateMetadata = withSeo("blog", pageMetadataBase);
