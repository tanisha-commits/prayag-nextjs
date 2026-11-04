"use server";

import { revalidatePath } from "next/cache";
import { AuthError, requireAdmin } from "@/lib/auth/server";
import { sitePage, type SitePageSlug } from "@/lib/content/page-registry";
import { fetchOwnPage } from "@/lib/content/page-html";
import { applyTextEdits, markdownToPage, pageTexts, pageToMarkdown } from "@/lib/content/page-texts";
import { ContentError, readListEntry, saveEntry } from "@/lib/content/store";

async function admin(): Promise<string> {
  try {
    return (await requireAdmin()).email;
  } catch (e) {
    throw new Error(e instanceof AuthError && e.status === 401 ? "Please sign in again." : "You are not allowed to do this.");
  }
}

function page(slug: string): SitePageSlug {
  if (!sitePage(slug)) throw new Error("Unknown page.");
  return slug as SitePageSlug;
}

async function inventory(slug: SitePageSlug) {
  const content = readListEntry("page-content", slug)?.data;
  return { content, texts: pageTexts(slug, content, await fetchOwnPage(sitePage(slug)!.path)) };
}

export type TextSaveResult = { ok: boolean; message: string };

/** Save text edits ({original → text}); a text set back to its original drops the edit. */
export async function savePageTexts(slug: string, changes: { original: string; text: string }[]): Promise<TextSaveResult> {
  const who = await admin();
  const s = page(slug);
  if (!Array.isArray(changes) || changes.length > 3000) return { ok: false, message: "Too many changes at once." };
  try {
    const next = applyTextEdits(readListEntry("page-content", s)?.data, changes.map((c) => ({ original: String(c.original), text: String(c.text) })));
    saveEntry({ id: "page-content", key: s }, next, who);
  } catch (e) {
    return { ok: false, message: e instanceof ContentError ? e.message : "Could not save." };
  }
  revalidatePath("/", "layout");
  return { ok: true, message: `Saved ${changes.length} text change(s). The page shows them now.` };
}

/** The page's texts, SEO and marketing points as one editable .md file. */
export async function exportPageMarkdown(slug: string): Promise<string> {
  await admin();
  const s = page(slug);
  const { content, texts } = await inventory(s);
  return pageToMarkdown(s, content, texts);
}

/** Apply an edited page .md (texts by marker, SEO + marketing from the header). */
export async function importPageMarkdown(slug: string, md: string): Promise<TextSaveResult> {
  const who = await admin();
  const s = page(slug);
  if (typeof md !== "string" || md.length > 2_000_000) return { ok: false, message: "The file is empty or too large." };
  const { content, texts } = await inventory(s);
  const r = markdownToPage(s, md, content, texts);
  if (r.errors.length) return { ok: false, message: r.errors.join(" ") };
  try {
    saveEntry({ id: "page-content", key: s }, r.content, who);
  } catch (e) {
    return { ok: false, message: e instanceof ContentError ? e.message : "Could not save." };
  }
  revalidatePath("/", "layout");
  return { ok: true, message: `Imported: ${r.changed} text change(s), SEO and marketing points updated${r.unknown ? `; ${r.unknown} block(s) did not match this page and were skipped` : ""}.` };
}
