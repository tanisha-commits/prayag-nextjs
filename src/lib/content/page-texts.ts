// Page text editing shared by the admin and the MCP server (plain module, no server-only).
// A page's editable texts are the strings its components render through <Tx> (listed at build time
// in text-manifest.generated.json). Edits are stored on the page's "page-content" entry, keyed by
// the original text, and can be exported to / imported from one .md file per page.
import { createHash } from "node:crypto";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import manifest from "./text-manifest.generated.json";
import { sitePage, type SitePageSlug } from "./page-registry";
import { pageContent, type PageContent } from "./schemas";

export type PageText = { id: string; original: string; text: string; edited: boolean };

export const textId = (original: string) => createHash("sha1").update(original).digest("hex").slice(0, 10);
const norm = (s: string) => s.replace(/\s+/g, " ").trim();

/** Text segments of a rendered page's <main> (scripts, styles and tags removed, entities decoded). */
export function renderedTexts(html: string): Set<string> {
  const main = html.match(/<main[\s\S]*<\/main>/i)?.[0] ?? html;
  const body = main.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  const out = new Set<string>();
  for (const seg of body.split(/<[^>]*>/)) {
    const t = norm(seg.replace(/&(nbsp|amp|lt|gt|quot|#39|#x27|apos);/g, (m, e: string) => ({ nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", "#x27": "'", apos: "'" })[e] ?? m));
    if (t) out.add(t);
  }
  return out;
}

/**
 * Editable texts of a page, in page order. With the page's HTML, only strings that really render
 * are kept (plus any already edited); without it, every build-time candidate is listed.
 */
export function pageTexts(slug: SitePageSlug, content: PageContent | undefined, html?: string): PageText[] {
  const edits = new Map((content?.texts ?? []).map((t) => [t.original, t.text]));
  const rendered = html ? renderedTexts(html) : null;
  const candidates = (manifest as Record<string, string[]>)[slug] ?? [];
  const list: PageText[] = [];
  const seen = new Set<string>();
  for (const original of candidates) {
    const edited = edits.has(original);
    if (rendered && !edited && !rendered.has(norm(original))) continue;
    if (seen.has(norm(original))) continue;
    seen.add(norm(original));
    list.push({ id: textId(original), original, text: edited ? edits.get(original)! : original, edited });
  }
  // Edits whose original no longer exists in the code stay visible so they can be removed.
  for (const [original, text] of edits) if (!seen.has(norm(original))) list.push({ id: textId(original), original, text, edited: true });
  return list;
}

/** Keep the original's surrounding spaces (they matter between inline elements). */
function withSpacing(original: string, text: string) {
  const lead = original.match(/^\s*/)![0];
  const trail = original.match(/\s*$/)![0];
  return lead + text.trim() + trail;
}

/** Apply {original → new text} changes to a page's content; unchanged texts drop their edit. */
export function applyTextEdits(content: PageContent | undefined, changes: { original: string; text: string }[]): PageContent {
  const base = pageContent.parse(content ?? {});
  const map = new Map(base.texts.map((t) => [t.original, t.text]));
  for (const c of changes) {
    const text = withSpacing(c.original, c.text);
    if (norm(text) === norm(c.original) || !norm(text)) map.delete(c.original);
    else map.set(c.original, text);
  }
  return { ...base, texts: [...map].map(([original, text]) => ({ original, text })) };
}

// ---------- one .md file per page ----------

const MARK = /<!--\s*text:([0-9a-f]{10})\s*-->/g;

/** The page as an editable .md: SEO + marketing in the header, then every text block. */
export function pageToMarkdown(slug: SitePageSlug, content: PageContent | undefined, texts: PageText[]): string {
  const page = sitePage(slug)!;
  const c = pageContent.parse(content ?? {});
  const header = stringifyYaml({
    page: slug,
    title: page.title,
    seoTitle: c.seoTitle ?? "",
    seoDescription: c.seoDescription ?? "",
    seoKeywords: c.seoKeywords,
    marketingHeading: c.marketingHeading ?? "",
    showMarketing: c.showMarketing ?? false,
    marketingPoints: c.marketingPoints,
  }).trim();
  const blocks = texts.map((t) => `<!-- text:${t.id} -->\n${t.text.trim()}`).join("\n\n");
  return `---\n# Prayag page: ${page.title} (${page.path})\n# Edit the values below and the text under each <!-- text:… --> marker, then upload this file\n# in Admin → Pages → ${page.title}. Keep the markers; leave a text unchanged to keep the original.\n# Empty seoTitle/seoDescription keep the page's own. Marketing points show above the footer when\n# showMarketing is true.\n${header}\n---\n\n${blocks}\n`;
}

export type PageMarkdownResult = { content: PageContent; changed: number; unknown: number; errors: string[] };

/** Read a page .md back: header fields and text blocks (matched to the page's texts by marker id). */
export function markdownToPage(slug: SitePageSlug, md: string, content: PageContent | undefined, texts: PageText[]): PageMarkdownResult {
  const errors: string[] = [];
  const m = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(md);
  let meta: Record<string, unknown> = {};
  let body = md;
  if (m) {
    try {
      meta = (parseYaml(m[1]) as Record<string, unknown>) ?? {};
    } catch (e) {
      return { content: pageContent.parse(content ?? {}), changed: 0, unknown: 0, errors: [`The header could not be read (${(e as Error).message.split("\n")[0]}). Put values with a colon (:) in "double quotes".`] };
    }
    body = m[2];
  }
  if (meta.page && meta.page !== slug) errors.push(`This file is for the page "${String(meta.page)}", not "${slug}".`);
  const byId = new Map(texts.map((t) => [t.id, t]));
  const changes: { original: string; text: string }[] = [];
  let unknown = 0;
  const marks = [...body.matchAll(MARK)];
  marks.forEach((mk, i) => {
    const t = byId.get(mk[1]);
    const end = i + 1 < marks.length ? marks[i + 1].index! : body.length;
    const text = body.slice(mk.index! + mk[0].length, end).trim();
    if (!t) return void unknown++;
    if (norm(text) !== norm(t.text)) changes.push({ original: t.original, text: text || t.original });
  });
  if (errors.length) return { content: pageContent.parse(content ?? {}), changed: 0, unknown, errors };
  const next = applyTextEdits(content, changes);
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const list = (v: unknown) => (Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean) : []);
  const merged: PageContent = {
    ...next,
    ...(m
      ? {
          seoTitle: str(meta.seoTitle) || undefined,
          seoDescription: str(meta.seoDescription) || undefined,
          seoKeywords: list(meta.seoKeywords),
          marketingPoints: list(meta.marketingPoints),
          marketingHeading: str(meta.marketingHeading) || undefined,
          showMarketing: meta.showMarketing === true,
        }
      : {}),
  };
  const checked = pageContent.safeParse(merged);
  if (!checked.success) return { content: pageContent.parse(content ?? {}), changed: 0, unknown, errors: checked.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) };
  return { content: checked.data, changed: changes.length, unknown, errors: [] };
}
