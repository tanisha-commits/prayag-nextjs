// Blog posts from Markdown files: a YAML header (front matter) for the post's fields and a Markdown
// body for the article. Used by the admin's "Import .md" page and Claude's import_markdown_post tool.
// Plain module, no server-only.
import { marked } from "marked";
import { parse as parseYaml } from "yaml";
import { blogPost, SLUG, type BlogPost } from "./schemas";
import type { ListEntry } from "./store";

export { MARKDOWN_TEMPLATE } from "./markdown-template";

export type ParsedPost = { slug: string; post: BlogPost; warnings: string[] };
export type ParseResult = { ok: true; value: ParsedPost } | { ok: false; errors: string[] };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/, "");
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value !== "string" || !value.trim()) return null;
  const v = value.trim();
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (iso) return new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3], 6));
  const dmy = /^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/.exec(v);
  if (dmy) {
    const m = MONTHS.findIndex((x) => x.toLowerCase() === dmy[2].toLowerCase());
    if (m >= 0) return new Date(Date.UTC(+dmy[3], m, +dmy[1], 6));
  }
  return null;
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");

/**
 * Parse one Markdown file. `media` maps uploaded file names (case-insensitive) to stored paths;
 * banner and body image references to those names are replaced with the stored paths. `posts`
 * (existing posts) fills in the related-post cards.
 */
export function parseMarkdownPost(text: string, opts: { media?: Record<string, string>; posts?: ListEntry[]; fileName?: string } = {}): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const media = new Map(Object.entries(opts.media ?? {}).map(([k, v]) => [k.toLowerCase(), v]));
  const resolve = (ref: string) => media.get(ref.split("/").pop()!.toLowerCase()) ?? ref;

  const m = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) return { ok: false, errors: ["The file must start with a header between two '---' lines (download the template to see the format)."] };
  let meta: Record<string, unknown>;
  try {
    const parsed = parseYaml(m[1]) as unknown;
    meta = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
  } catch (e) {
    return { ok: false, errors: [`The header could not be read (${(e as Error).message.split("\n")[0]}). Put values that contain a colon (:) in "double quotes".`] };
  }
  const body = m[2].trim();

  const title = str(meta.title);
  if (!title) errors.push("title is missing.");
  const slug = str(meta.slug) || slugify(title || (opts.fileName ?? "").replace(/\.md$/i, ""));
  if (!SLUG.test(slug)) errors.push(`slug "${slug}" must be lower-case words joined by hyphens.`);

  let date = new Date();
  if (meta.date !== undefined) {
    const d = parseDate(meta.date);
    if (d) date = d;
    else errors.push(`date "${str(meta.date)}" is not YYYY-MM-DD.`);
  }

  const bannerRef = str(meta.bannerImage);
  if (!bannerRef) errors.push("bannerImage is missing (a site path, or the name of an image uploaded with the file).");
  const bannerImage = bannerRef ? resolve(bannerRef) : "";
  if (bannerRef && !bannerImage.startsWith("/") && !/^https:\/\//.test(bannerImage)) errors.push(`bannerImage "${bannerRef}" was not uploaded and is not a site path or https:// URL.`);
  if (!body) errors.push("The article (below the header) is empty.");

  // Images in the body that refer to uploaded files get their stored paths.
  const missingImages: string[] = [];
  const renderer = new marked.Renderer();
  const baseImage = renderer.image.bind(renderer);
  renderer.image = (token) => {
    const href = resolve(token.href);
    if (!href.startsWith("/") && !/^https?:\/\//.test(href)) missingImages.push(token.href);
    return baseImage({ ...token, href });
  };
  const bodyHtml = (marked.parse(body, { renderer, async: false, gfm: true }) as string).trim();
  for (const img of missingImages) warnings.push(`Image "${img}" in the article was not uploaded; it will not show.`);

  const related: BlogPost["related"] = [];
  const relatedSlugs = Array.isArray(meta.related) ? meta.related.map(str).filter(Boolean) : [];
  for (const r of relatedSlugs) {
    const p = opts.posts?.find((x) => x.key === r);
    if (!p) {
      warnings.push(`Related post "${r}" does not exist; skipped.`);
      continue;
    }
    related.push({ slug: r, href: `/${r}`, image: p.data.bannerImage, imageAlt: p.data.bannerAlt, title: p.data.title, excerpt: p.data.description ?? "" });
  }

  if (errors.length) return { ok: false, errors };
  const post: BlogPost = {
    title,
    published: `${date.getUTCDate()}-${MONTHS[date.getUTCMonth()]}-${date.getUTCFullYear()}`,
    timestamp: Math.floor(date.getTime() / 1000),
    metaTitle: str(meta.metaTitle) || null,
    description: str(meta.description) || null,
    bannerImage,
    bannerAlt: str(meta.bannerAlt) || title,
    bodyHtml,
    related,
  };
  const checked = blogPost.safeParse(post);
  if (!checked.success) return { ok: false, errors: checked.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) };
  return { ok: true, value: { slug, post: checked.data, warnings } };
}
