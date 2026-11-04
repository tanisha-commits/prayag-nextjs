"use server";

import { revalidatePath } from "next/cache";
import { AuthError, requireAdmin } from "@/lib/auth/server";
import { sanitizeContentHtml } from "@/lib/content/fields";
import { parseMarkdownPage, parseMarkdownPost, parseMarkdownSection, renderMarkdown } from "@/lib/content/markdown";
import { ContentError, readList, readListEntry, saveEntry } from "@/lib/content/store";

export type MdFile = { name: string; text: string };
/** What the files become: blog posts or custom pages. */
export type MdKind = "blog" | "custom-pages";
export type MdResult = {
  file: string;
  ok: boolean;
  slug?: string;
  title?: string;
  /** A post with this slug already exists (importing replaces it only with overwrite). */
  exists?: boolean;
  published?: string;
  bannerImage?: string;
  bodyHtml?: string;
  warnings: string[];
  errors: string[];
  saved?: boolean;
};

const MAX_FILES = 30;
const MAX_TEXT = 400_000;

async function admin(): Promise<string> {
  try {
    return (await requireAdmin()).email;
  } catch (e) {
    throw new Error(e instanceof AuthError && e.status === 401 ? "Please sign in again." : "You are not allowed to do this.");
  }
}

type Parsed = MdResult & { save?: { key: string; data: unknown } };

function parseAll(kind: MdKind, files: MdFile[], media: Record<string, string>): Parsed[] {
  if (kind !== "blog" && kind !== "custom-pages") throw new Error("Unknown import type.");
  if (!Array.isArray(files) || files.length > MAX_FILES) throw new Error(`Upload at most ${MAX_FILES} Markdown files at once.`);
  const posts = readList("blog");
  const seen = new Set<string>();
  return files.map((f): Parsed => {
    const base = { file: String(f?.name ?? "file.md"), warnings: [] as string[], errors: [] as string[] };
    if (typeof f?.text !== "string" || f.text.length > MAX_TEXT) return { ...base, ok: false, errors: ["The file is empty or larger than 400 KB."] };
    const errors: string[] = [];
    let slug: string, title: string, bannerImage: string | undefined, bodyHtml: string, published: string | undefined, warnings: string[], data: unknown;
    if (kind === "blog") {
      const r = parseMarkdownPost(f.text, { media, posts, fileName: base.file });
      if (!r.ok) return { ...base, ok: false, errors: r.errors };
      ({ slug, warnings } = r.value);
      ({ title, bannerImage, published } = r.value.post);
      bodyHtml = sanitizeContentHtml(r.value.post.bodyHtml);
      data = r.value.post;
    } else {
      const r = parseMarkdownPage(f.text, { media, fileName: base.file });
      if (!r.ok) return { ...base, ok: false, errors: r.errors };
      ({ slug, warnings } = r.value);
      ({ title, bannerImage } = r.value.page);
      bodyHtml = renderMarkdown(r.value.page.markdown);
      data = r.value.page;
    }
    if (seen.has(slug)) errors.push(`Another file in this upload also uses the slug "${slug}".`);
    seen.add(slug);
    return {
      ...base,
      ok: !errors.length,
      errors,
      warnings,
      slug,
      title,
      published,
      bannerImage,
      bodyHtml,
      exists: !!readListEntry(kind, slug),
      save: { key: slug, data },
    };
  });
}

const strip = ({ save, ...r }: Parsed): MdResult => (void save, r);

/** Parse the files and report what an import would do. Saves nothing. */
export async function previewMarkdownPosts(kind: MdKind, files: MdFile[], media: Record<string, string>): Promise<MdResult[]> {
  await admin();
  return parseAll(kind, files, media).map(strip);
}

/** Create (or, with `overwrite`, replace) a blog post or custom page for every valid file. */
export async function importMarkdownPosts(kind: MdKind, files: MdFile[], media: Record<string, string>, overwrite: boolean): Promise<MdResult[]> {
  const who = await admin();
  const results = parseAll(kind, files, media).map((p) => {
    const r = strip(p);
    if (!r.ok || !p.save) return r;
    if (r.exists && !overwrite) return { ...r, ok: false, errors: [`/${r.slug} already exists. Tick "Replace existing ${kind === "blog" ? "posts" : "pages"}" to overwrite it.`] };
    try {
      saveEntry({ id: kind, key: p.save.key }, p.save.data, who);
      return { ...r, saved: true };
    } catch (e) {
      return { ...r, ok: false, errors: [e instanceof ContentError ? [e.message, ...(e.issues ?? []).map((i) => `${i.path}: ${i.message}`)].join(" ") : "Could not save."] };
    }
  });
  if (results.some((r) => r.saved)) revalidatePath("/", "layout");
  return results;
}

export type ParsedSection = { position: "top" | "bottom"; heading?: string; markdown: string };

/** Turn .md files into page sections (header optional: position, heading). Saves nothing. */
export async function parseSectionFiles(files: MdFile[], media: Record<string, string>): Promise<{ sections: ParsedSection[]; warnings: string[] }> {
  await admin();
  if (!Array.isArray(files) || files.length > MAX_FILES) throw new Error(`Upload at most ${MAX_FILES} Markdown files at once.`);
  const sections: ParsedSection[] = [];
  const warnings: string[] = [];
  for (const f of files) {
    if (typeof f?.text !== "string" || !f.text.trim() || f.text.length > MAX_TEXT) {
      warnings.push(`${f?.name}: empty or larger than 400 KB; skipped.`);
      continue;
    }
    const r = parseMarkdownSection(f.text, media);
    if (!r.markdown) {
      warnings.push(`${f.name}: no content below the header; skipped.`);
      continue;
    }
    sections.push({ position: r.position ?? "bottom", ...(r.heading ? { heading: r.heading } : {}), markdown: r.markdown });
    warnings.push(...r.warnings.map((w) => `${f.name}: ${w}`));
  }
  return { sections, warnings };
}
