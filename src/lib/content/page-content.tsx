import "server-only";
import type { Metadata } from "next";
import { cache } from "react";
import { PageSections } from "@/components/sites/prayag/cms/page-sections";
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
    const sections = getPageContent(slug)?.sections ?? [];
    return (
      <>
        <PageSections sections={sections.filter((s) => s.position === "top")} />
        <Page {...props} />
        <PageSections sections={sections.filter((s) => s.position === "bottom")} />
      </>
    );
  }
  PageWithContent.displayName = `WithPageContent(${slug})`;
  return PageWithContent;
}

function applySeo(slug: SitePageSlug, base: Metadata): Metadata {
  const c = getPageContent(slug);
  if (!c?.seoTitle && !c?.seoDescription) return base;
  const title = c.seoTitle ? { absolute: c.seoTitle } : base.title;
  const description = c.seoDescription || base.description;
  const plain = c.seoTitle || (typeof base.title === "string" ? base.title : undefined);
  return {
    ...base,
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
