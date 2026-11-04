import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { blogIndex, type BlogArticle } from "@/lib/blog";
import { allProducts } from "@/lib/catalog/queries";

export const SEARCH_PAGE_SIZE = 10;

export interface SearchDoc {
  href: string;
  title: string;
  image: string | null;
  imageAlt: string;
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

async function loadDocs(): Promise<SearchDoc[]> {
  const blogs = await Promise.all(
    blogIndex.map(async (post) => {
      const file = path.join(process.cwd(), "src/content/prayag/blog/articles", `${post.slug}.json`);
      const article = JSON.parse(await readFile(file, "utf8")) as BlogArticle;
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
  const items = allProducts
    .filter((p) => p.status === "published")
    .map((p) => ({
      href: `/${p.slug}`,
      title: p.title,
      image: p.images[0]?.src ?? null,
      imageAlt: p.images[0]?.alt || p.title,
      date: null,
      text: [p.title, p.itemCode, p.shortDescription, htmlToText(p.descriptionHtml), ...p.features, ...p.applications].filter(Boolean).join(" "),
    }));
  return [...blogs, ...items];
}

function docs() {
  docsPromise ??= loadDocs();
  return docsPromise;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
