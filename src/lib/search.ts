import "server-only";
import { getDb } from "@/lib/db";
import { productImages, products } from "@/lib/db/schema";
import { getBlogArticle, getBlogIndex } from "@/lib/blog";
import { draftPreview } from "@/lib/catalog/public";

// Keyword search behind /search/node, modelled on the source's Drupal node search: every keyword
// must occur (AND), title hits rank above body hits, 10 results per page, and each result shows an
// excerpt with the keywords in <strong>. Indexes blog articles and published products. The source
// also indexes its static pages; their copy lives in components here, so they are not searchable.

export const SEARCH_PAGE_SIZE = 10;

export interface SearchDoc {
  href: string;
  title: string;
  image: string | null;
  imageAlt: string;
  /** Source display date, e.g. "31  July,  2026" (blog articles only). */
  date: string | null;
  text: string;
}

export interface SearchHit extends Omit<SearchDoc, "text"> {
  snippetHtml: string;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', nbsp: " ", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", ndash: "–", mdash: "—" };
function htmlToText(html: string | null) {
  return (html ?? "")
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#\d+|[a-z]+);/gi, (m, e: string) => (e.startsWith("#") ? String.fromCharCode(Number(e.slice(1))) : (ENTITIES[e.toLowerCase()] ?? m)))
    .replace(/\s+/g, " ")
    .trim();
}

let docsPromise: Promise<SearchDoc[]> | null = null;
let docsAt = 0;
// Rebuilt at most every 5 minutes, so posts and products edited in the admin become searchable.
const DOCS_TTL_MS = 5 * 60 * 1000;

async function loadDocs(): Promise<SearchDoc[]> {
  const blogs = await Promise.all(
    getBlogIndex().map(async (post) => {
      const article = (await getBlogArticle(post.slug))!;
      const d = new Date(post.timestamp * 1000);
      return {
        href: `/${post.slug}`,
        title: post.title,
        image: post.image,
        imageAlt: "Image Description",
        date: `${d.getUTCDate()}  ${MONTHS[d.getUTCMonth()]},  ${d.getUTCFullYear()}`,
        text: `${post.title} ${htmlToText(article.bodyHtml)}`,
      };
    }),
  );
  const db = getDb();
  const rows = db.select().from(products).all().filter((p) => p.status === "published" || (draftPreview() && p.status === "draft"));
  const images = new Map<number, { src: string; alt: string | null }>();
  for (const img of db.select().from(productImages).orderBy(productImages.sortOrder).all()) if (!images.has(img.productId)) images.set(img.productId, img);
  const items = rows.map((p) => ({
    href: `/${p.slug}`,
    title: p.title,
    image: images.get(p.id)?.src ?? null,
    imageAlt: images.get(p.id)?.alt || p.title,
    date: null,
    text: [p.title, p.itemCode, p.shortDescription, htmlToText(p.descriptionHtml), ...(p.features ?? []), ...(p.applications ?? [])].filter(Boolean).join(" "),
  }));
  return [...blogs, ...items];
}

function docs() {
  // Built once per server process; draft preview (dev only) rebuilds on every request.
  if (draftPreview()) return loadDocs();
  if (!docsPromise || Date.now() - docsAt > DOCS_TTL_MS) {
    docsPromise = loadDocs();
    docsAt = Date.now();
  }
  return docsPromise;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Up to three ~80-character excerpts around keyword hits, joined by " … " like Drupal's search_excerpt(). */
function snippet(text: string, words: string[]) {
  const re = new RegExp(`(${words.map(escapeRe).join("|")})`, "gi");
  const parts: string[] = [];
  let last = -1;
  for (const m of text.matchAll(re)) {
    if (m.index < last) continue;
    const start = Math.max(0, text.lastIndexOf(" ", Math.max(0, m.index - 40)) + 1);
    const endSpace = text.indexOf(" ", Math.min(text.length, m.index + 40));
    const end = endSpace === -1 ? text.length : endSpace;
    parts.push(text.slice(start, end));
    last = end;
    if (parts.length === 3) break;
  }
  const body = parts.length ? parts : [text.slice(0, 120)];
  return `…  ${body.map((p) => escapeHtml(p).replace(re, "<strong>$1</strong>")).join("  …  ")}  …`;
}

export async function searchNodes(keys: string, page: number): Promise<{ total: number; hits: SearchHit[] }> {
  const words = [...new Set(keys.toLowerCase().split(/\s+/).filter((w) => w.length > 0))];
  if (!words.length) return { total: 0, hits: [] };
  const scored: { doc: SearchDoc; score: number }[] = [];
  for (const doc of await docs()) {
    const title = doc.title.toLowerCase();
    const text = doc.text.toLowerCase();
    if (!words.every((w) => text.includes(w) || title.includes(w))) continue;
    const score = words.reduce((s, w) => s + (title.includes(w) ? 10 : 0) + Math.min(text.split(w).length - 1, 20), 0);
    scored.push({ doc, score });
  }
  scored.sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title));
  const hits = scored.slice(page * SEARCH_PAGE_SIZE, (page + 1) * SEARCH_PAGE_SIZE).map(({ doc: { text, ...rest } }) => ({ ...rest, snippetHtml: snippet(text, words) }));
  return { total: scored.length, hits };
}
