"use server";

import { revalidatePath } from "next/cache";
import { AuthError, requireAdmin } from "@/lib/auth/server";
import { sanitizeContentHtml } from "@/lib/content/fields";
import { parseMarkdownPost } from "@/lib/content/markdown";
import { ContentError, readList, readListEntry, saveEntry } from "@/lib/content/store";

export type MdFile = { name: string; text: string };
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

function parseAll(files: MdFile[], media: Record<string, string>): (MdResult & { post?: ReturnType<typeof parseMarkdownPost> })[] {
  if (!Array.isArray(files) || files.length > MAX_FILES) throw new Error(`Upload at most ${MAX_FILES} Markdown files at once.`);
  const posts = readList("blog");
  const seen = new Set<string>();
  return files.map((f) => {
    const base = { file: String(f?.name ?? "file.md"), warnings: [] as string[], errors: [] as string[] };
    if (typeof f?.text !== "string" || f.text.length > MAX_TEXT) return { ...base, ok: false, errors: ["The file is empty or larger than 400 KB."] };
    const r = parseMarkdownPost(f.text, { media, posts, fileName: base.file });
    if (!r.ok) return { ...base, ok: false, errors: r.errors };
    const { slug, post, warnings } = r.value;
    const errors: string[] = [];
    if (seen.has(slug)) errors.push(`Another file in this upload also uses the slug "${slug}".`);
    seen.add(slug);
    return {
      ...base,
      ok: !errors.length,
      errors,
      warnings,
      slug,
      title: post.title,
      published: post.published,
      bannerImage: post.bannerImage,
      bodyHtml: sanitizeContentHtml(post.bodyHtml),
      exists: !!readListEntry("blog", slug),
      post: r,
    };
  });
}

/** Parse the files and report what an import would do. Saves nothing. */
export async function previewMarkdownPosts(files: MdFile[], media: Record<string, string>): Promise<MdResult[]> {
  await admin();
  return parseAll(files, media).map((r) => {
    const { post, ...rest } = r;
    void post;
    return rest;
  });
}

/** Create (or, with `overwrite`, replace) a blog post for every valid file. */
export async function importMarkdownPosts(files: MdFile[], media: Record<string, string>, overwrite: boolean): Promise<MdResult[]> {
  const who = await admin();
  const results = parseAll(files, media).map(({ post, ...r }) => {
    if (!r.ok || !post?.ok) return r;
    if (r.exists && !overwrite) return { ...r, ok: false, errors: [`/${r.slug} already exists. Tick "Replace existing posts" to overwrite it.`] };
    try {
      saveEntry({ id: "blog", key: post.value.slug }, post.value.post, who);
      return { ...r, saved: true };
    } catch (e) {
      return { ...r, ok: false, errors: [e instanceof ContentError ? [e.message, ...(e.issues ?? []).map((i) => `${i.path}: ${i.message}`)].join(" ") : "Could not save."] };
    }
  });
  if (results.some((r) => r.saved)) revalidatePath("/", "layout");
  return results;
}
