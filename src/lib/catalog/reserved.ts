import fs from "node:fs";
import path from "node:path";
import { readList } from "@/lib/content/store";
import type { Taxonomy } from "./mapping";

/**
 * Root-level slugs a product may not take: every static route, blog article, category landing and
 * app prefix. Products live at /<slug>, like on prayagindia.com.
 */
export function reservedSlugs(tax: Taxonomy): Set<string> {
  const out = new Set(["admin", "api", "products", "blog", "search", "_next", "sites", "media"]);
  const root = /* turbopackIgnore: true */ process.cwd();
  const pages = path.join(root, "src/app/(pages)");
  if (fs.existsSync(pages)) for (const d of fs.readdirSync(pages)) if (!d.startsWith("[")) out.add(d);
  // Blog posts: imported articles plus any added in the admin or by Claude.
  for (const post of readList("blog")) out.add(post.key);
  for (const c of tax.categories) out.add(c.slug.split("/")[0]);
  return out;
}
