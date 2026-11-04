import { readFile } from "node:fs/promises";
import path from "node:path";
import index from "@/content/prayag/blog/index.json";

export interface BlogListItem {
  slug: string;
  year: string;
  timestamp: number;
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
  bodyHtml: string;
  related: RelatedPost[];
}

export const blogIndex: BlogListItem[] = index;

const slugs = new Set(blogIndex.map((post) => post.slug));

export function isBlogSlug(slug: string) {
  return slugs.has(slug);
}

const LIVE_LINK = /href="https:\/\/(?:www\.)?prayagindia\.com(\/[a-z0-9-]*)"/g;
const localLinks = (html: string) => html.replace(LIVE_LINK, (_, p: string) => `href="${p}"`);

export async function getBlogArticle(slug: string): Promise<BlogArticle | null> {
  if (!isBlogSlug(slug)) return null;
  const file = path.join(process.cwd(), "src/content/prayag/blog/articles", `${slug}.json`);
  const article = JSON.parse(await readFile(file, "utf8")) as BlogArticle;
  return {
    ...article,
    bodyHtml: localLinks(article.bodyHtml),
    related: article.related.map((r) => ({ ...r, href: r.href.replace(/^https:\/\/(?:www\.)?prayagindia\.com(?=\/[a-z0-9-]*$)/, "") })),
  };
}
