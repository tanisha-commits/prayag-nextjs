import { PageBanner } from "@/components/sites/prayag/page-banner";
import { renderMarkdown } from "@/lib/content/markdown";
import type { CustomPage } from "@/lib/content/schemas";
import { responsiveImagesHtml } from "@/lib/image-dimensions";
import { storedHtml } from "@/lib/stored-html";
import "@/components/sites/prayag/blog/article.css";

/** A page created from Markdown in the admin: Prayag banner (or a title band) + the content. */
export function CustomPageView({ page }: { page: CustomPage }) {
  return (
    <>
      {page.bannerImage ? (
        <PageBanner image={page.bannerImage} imageAlt={page.bannerAlt ?? ""} title={page.title} />
      ) : (
        <div className="bg-black px-6 py-16 text-center">
          <h1 className="m-0 text-[28px] leading-9 font-medium text-white md:text-[40px] md:leading-[50px]">{page.title}</h1>
        </div>
      )}
      <section className="bg-white py-10 md:py-14">
        <div className="prayag-container">
          <div className="cms-md mx-auto max-w-[1100px]">
            <div className="pf-bd-content" dangerouslySetInnerHTML={{ __html: storedHtml(responsiveImagesHtml(renderMarkdown(page.markdown))) }} />
          </div>
        </div>
      </section>
    </>
  );
}
