import "server-only";
import type { Metadata } from "next";
import { cache } from "react";
import { MarketingPoints } from "@/components/sites/prayag/cms/marketing-points";
import { PageSections } from "@/components/sites/prayag/cms/page-sections";
import { pageTextStore } from "@/components/sites/prayag/cms/tx";
import { PageTextProvider } from "@/components/sites/prayag/cms/tx-client";
import type { PageContent } from "./schemas";
import type { SitePageSlug } from "./page-registry";
import { readListEntry } from "./store";

/** Markdown sections and SEO overrides of a page (Admin → Content → Pages). */
export const getPageContent = cache((slug: SitePageSlug): PageContent | undefined => readListEntry("page-content", slug)?.data);

/**
 * Wrap a page component so its Markdown sections render around it: "top" ones under the header,
 * "bottom" ones above the footer. The page's own design is untouched.
 */
export function withPageContent<P extends object>(slug: SitePageSlug, Page: React.ComponentType<P>) {
  function PageWithContent(props: P) {
    const content = getPageContent(slug);
    const sections = content?.sections ?? [];
    // Text edits: server components read them from the request store, client components from context.
    const texts = Object.fromEntries((content?.texts ?? []).filter((t) => t.text !== t.original).map((t) => [t.original, t.text]));
    pageTextStore().map = texts;
    return (
      <>
        <PageSections sections={sections.filter((s) => s.position === "top")} />
        <PageTextProvider texts={texts}>
          <Page {...props} />
        </PageTextProvider>
        {content?.showMarketing && <MarketingPoints heading={content.marketingHeading} points={content.marketingPoints} />}
        <PageSections sections={sections.filter((s) => s.position === "bottom")} />
      </>
    );
  }
  PageWithContent.displayName = `WithPageContent(${slug})`;
  return PageWithContent;
}

function applySeo(slug: SitePageSlug, base: Metadata): Metadata {
  const c = getPageContent(slug);
  const keywords = c?.seoKeywords?.length ? { keywords: c.seoKeywords } : {};
  if (!c?.seoTitle && !c?.seoDescription) return { ...base, ...keywords };
  const title = c.seoTitle ? { absolute: c.seoTitle } : base.title;
  const description = c.seoDescription || base.description;
  const plain = c.seoTitle || (typeof base.title === "string" ? base.title : undefined);
  return {
    ...base,
    ...keywords,
    title,
    description,
    openGraph: { ...base.openGraph, ...(plain ? { title: plain } : {}), ...(description ? { description } : {}) },
    twitter: { ...base.twitter, ...(plain ? { title: plain } : {}), ...(description ? { description } : {}) },
  };
}

/** SEO overrides on top of a page's static metadata. */
export function withSeo(slug: SitePageSlug, base: Metadata) {
  return () => applySeo(slug, base);
}

/** SEO overrides on top of a page's generateMetadata. */
export function withSeoFn<A extends unknown[]>(slug: SitePageSlug, fn: (...args: A) => Metadata | Promise<Metadata>) {
  return async (...args: A) => applySeo(slug, await fn(...args));
}
