import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArticleShare } from "@/components/sites/prayag/blog/article-share";
import "@/components/sites/prayag/blog/article.css";
import { CatalogRoute, catalogMetadata } from "@/components/sites/prayag/catalog/catalog-route";
import { BreadcrumbJsonLd, pageMetadata } from "@/components/sites/prayag/seo";
import { blogIndex, getBlogArticle } from "@/lib/blog";
import { withBasePath } from "@/lib/base-path";
import { allProducts } from "@/lib/catalog/queries";
import { storedHtml } from "@/lib/stored-html";
import { imageDims, responsiveImagesHtml } from "@/lib/image-dimensions";

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = new Set([
    ...blogIndex.map((post) => post.slug),
    ...allProducts.filter((product) => product.status === "published").map((product) => product.slug),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticle(slug);
  if (!article) return catalogMetadata(slug);
  const meta = pageMetadata({
    title: article.metaTitle ?? `${article.title} | Prayag`,
    description: article.description ?? undefined,
    path: `/${article.slug}`,
    image: article.bannerImage,
  });
  return { ...meta, openGraph: { ...meta.openGraph, type: "article" } };
}

export default async function BlogArticlePage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const article = await getBlogArticle(slug);
  if (!article) return <CatalogRoute path={slug} searchParams={Promise.resolve({})} />;

  const url = `https://prayagindia.com/${article.slug}`;
  const banner = imageDims(article.bannerImage);
  const bannerRatio = banner ? `${banner.width} / ${banner.height}` : "48 / 25";

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Blog", path: "/blog" },
          { name: article.title, path: `/${article.slug}` },
        ]}
      />

      <div className="overflow-hidden">
        <div className="-mx-3 flex flex-wrap">
          <div
            className="relative h-[230px] w-full md:h-[500px] md:w-1/2 xl:aspect-(--banner-ratio) xl:h-auto"
            style={{ "--banner-ratio": bannerRatio } as CSSProperties}
          >
            <Image
              src={withBasePath(article.bannerImage)}
              alt={article.bannerAlt}
              fill
              preload
              sizes="(min-width: 769px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="w-full md:w-1/2">
            <div className="flex size-full flex-col items-center justify-center bg-black p-[30px] text-center sm:p-11">
              <h1 className="m-0 w-full p-0 text-center text-[22px] leading-8 font-medium text-white md:text-[32px] md:leading-[42px] lg:text-[36px] lg:leading-[46px] xl:w-[91%] xl:text-[40px] xl:leading-[50px]">
                {article.title}
              </h1>
              <p className="mt-1.5 mb-[25px] text-center text-[15px] leading-[22px] text-white md:text-[18px] md:leading-6">
                Published : {article.published}
              </p>
              <ArticleShare url={url} title={article.title} />
            </div>
          </div>
        </div>
      </div>

      <section id="pf-blog-detail-2026" className="pt-8 pb-14 sm:pt-14 sm:pb-20">
        <div className="mx-5 sm:mx-[120px]">
          <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[75%_25%] lg:gap-0">
            <article className="w-[90%] min-w-0">
              <div className="pf-bd-content" dangerouslySetInnerHTML={{ __html: storedHtml(responsiveImagesHtml(article.bodyHtml)) }} />
            </article>
            <aside className="min-w-0 lg:sticky lg:top-[120px]">
              <h2 className="mb-6 border-b border-[#e5e7eb] pb-3 text-[28px] leading-[1.2] font-semibold text-[#00aeef]">
                Related Blogs
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:flex-col lg:gap-5">
                {article.related.map((post) => {
                  const card = (
                    <>
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#fafafa]">
                        <Image src={withBasePath(post.image)} alt={post.imageAlt} fill sizes="(min-width: 991px) 300px, 50vw" className="object-cover" />
                      </div>
                      <div className="px-4 pt-3.5 pb-4">
                        <h3 className="mb-2 text-[15px] leading-[1.4] font-semibold text-[#1a1a1a]">{post.title}</h3>
                        <p className="m-0 line-clamp-3 text-[13px] leading-[1.55] text-[#5b5f66]">{post.excerpt}</p>
                      </div>
                    </>
                  );
                  const cls =
                    "block overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-white no-underline transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#d1d5db] hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]";
                  return post.href.startsWith("/") ? (
                    <Link key={post.href} href={post.href} className={cls}>
                      {card}
                    </Link>
                  ) : (
                    <a key={post.href} href={withBasePath(post.href)} className={cls}>
                      {card}
                    </a>
                  );
                })}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
