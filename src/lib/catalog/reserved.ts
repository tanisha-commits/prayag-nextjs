import fs from "node:fs";
import path from "node:path";
import type { Taxonomy } from "./mapping";

/**
 * Root-level slugs a product may not take: every static route, blog article, category landing and
 * app prefix. Products live at /<slug>, like on prayagindia.com.
 */
export function reservedSlugs(tax: Taxonomy): Set<string> {
  const out = new Set(["admin", "api", "products", "blog", "search", "_next"]);
  const root = /* turbopackIgnore: true */ process.cwd();
  const pages = path.join(root, "src/app/(pages)");
  if (fs.existsSync(pages)) for (const d of fs.readdirSync(pages)) if (!d.startsWith("[")) out.add(d);
  const blogIndex = path.join(root, "src/content/prayag/blog/index.json");
  if (fs.existsSync(blogIndex)) {
    const idx = JSON.parse(fs.readFileSync(blogIndex, "utf8")) as { slug: string }[] | { articles?: { slug: string }[] };
    for (const a of Array.isArray(idx) ? idx : (idx.articles ?? [])) out.add(a.slug);
  }
  for (const c of tax.categories) out.add(c.slug.split("/")[0]);
  return out;
}
