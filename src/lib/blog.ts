import "server-only";
import { readList, readListEntry } from "@/lib/content/store";

// Blog posts: the articles imported from prayagindia.com (src/content/prayag/blog/articles) overlaid
// with posts added, edited or removed in the admin or by Claude (src/lib/content).

export interface BlogListItem {
  slug: string;
  year: string;
  /** Unix seconds; the source sorts by this (data-date). */
  timestamp: number;
  /** Display date as on the source, e.g. "19-Oct-2026". */
  date: string;
  title: string;
  image: string;
  imageAlt: string;
}

export interface RelatedPost {
  slug: string | null;
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  excerpt: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  published: string;
  timestamp: number;
  metaTitle: string | null;
  description: string | null;
  bannerImage: string;
  bannerAlt: string;
  /** Source article HTML, sanitised at import (no scripts/iframes/handlers, links rewritten). */
  bodyHtml: string;
  related: RelatedPost[];
}

/** All posts, newest first (the order of /blog). */
export function getBlogIndex(): BlogListItem[] {
  return readList("blog")
    .map(({ key, data }) => ({
      slug: key,
      year: String(new Date(data.timestamp * 1000).getUTCFullYear()),
      timestamp: data.timestamp,
      date: data.published,
      title: data.title,
      image: data.bannerImage,
      imageAlt: data.bannerAlt,
    }))
    .sort((x, y) => y.timestamp - x.timestamp);
}

export function isBlogSlug(slug: string) {
  return !!readListEntry("blog", slug);
}

// Article bodies link to other pages with absolute source URLs; well-formed ones become local paths.
// Malformed or retired source URLs (e.g. "https://prayagindia.com//prayagindia.com/faucets)") are
// left untouched, exactly as the source shows them.
const LIVE_LINK = /href="https:\/\/(?:www\.)?prayagindia\.com(\/[a-z0-9-]*)"/g;
const localLinks = (html: string) => html.replace(LIVE_LINK, (_, p: string) => `href="${p}"`);

export async function getBlogArticle(slug: string): Promise<BlogArticle | null> {
  const entry = readListEntry("blog", slug);
  if (!entry) return null;
  const article = entry.data;
  return {
    slug,
    ...article,
    bodyHtml: localLinks(article.bodyHtml),
    related: article.related.map((r) => ({ ...r, href: r.href.replace(/^https:\/\/(?:www\.)?prayagindia\.com(?=\/[a-z0-9-]*$)/, "") })),
  };
}
