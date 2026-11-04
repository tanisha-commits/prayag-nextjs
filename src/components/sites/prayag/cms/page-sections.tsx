import { renderMarkdown } from "@/lib/content/markdown";
import { responsiveImagesHtml } from "@/lib/image-dimensions";
import { storedHtml } from "@/lib/stored-html";
import "@/components/sites/prayag/blog/article.css";

type Section = { heading?: string; markdown: string };

/** Markdown sections added to a page in the admin, in the blog-article typography. */
export function PageSections({ sections }: { sections: Section[] }) {
  if (!sections.length) return null;
  return (
    <>
      {sections.map((s, i) => (
        <section key={i} className="bg-white py-10 md:py-14">
          <div className="prayag-container">
            <div className="mx-auto max-w-[1100px]">
              {s.heading && <h2 className="mb-6 text-[28px] leading-9 font-medium text-black md:text-[38px] md:leading-[46px]">{s.heading}</h2>}
              <div className="cms-md"><div className="pf-bd-content" dangerouslySetInnerHTML={{ __html: storedHtml(responsiveImagesHtml(renderMarkdown(s.markdown))) }} /></div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
