import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/action-form";
import { ContentEditor } from "@/components/admin/content-editor";
import { MarkdownImporter } from "@/components/admin/markdown-importer";
import { deleteContent, saveContent } from "@/lib/admin/content-actions";
import { describe } from "@/lib/content/fields";
import { LISTS, SINGLETONS, isList, isSingleton, type BlogPost } from "@/lib/content/schemas";
import { sitePage } from "@/lib/content/page-registry";
import { readListEntry, readSingleton } from "@/lib/content/store";
import { withBasePath } from "@/lib/base-path";

export const metadata: Metadata = { title: "Edit content" };
export const dynamic = "force-dynamic";

const card = "rounded-[10px] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]";

function newPost(): BlogPost {
  const now = new Date();
  const published = `${now.getDate()}-${now.toLocaleString("en-GB", { month: "short" })}-${now.getFullYear()}`;
  return { title: "", published, timestamp: Math.floor(now.getTime() / 1000), metaTitle: null, description: null, bannerImage: "", bannerAlt: "", bodyHtml: "", related: [] };
}

export default async function AdminContentEntry({ params, searchParams }: PageProps<"/admin/content/[collection]/[key]">) {
  const { collection, key } = await params;
  const { reset, saved } = await searchParams;
  const id = `${collection}/${key}`;

  if (isSingleton(id)) {
    const entry = readSingleton(id);
    const def = SINGLETONS[id];
    return (
      <>
        <p className="mt-0 mb-2 text-[13px]"><Link href="/admin/content" className="text-[#007ac3]">← Content</Link></p>
        <h1 className="mb-1 text-[26px] font-semibold">{def.title}</h1>
        <p className="mt-0 mb-4 text-[14px] text-[#5b5f66]">
          {def.description} {entry.source === "saved" ? `Last edited by ${entry.updatedBy}.` : "Showing the built-in content (not edited yet)."}
        </p>
        {reset && <p className="mb-4 rounded-[8px] bg-[#e7f6ec] px-3 py-2 text-[14px] text-[#1e7d3a]">Reset to the built-in content.</p>}
        {saved && <p role="status" className="mb-4 rounded-[8px] bg-[#e7f6ec] px-3 py-2 text-[14px] text-[#1e7d3a]">Saved. The site shows the change now.</p>}
        <div className={card}>
          <ContentEditor key={`${id}-${entry.updatedAt ?? 0}`} id={id} field={describe(def.schema)} initial={entry.data} action={saveContent} />
        </div>
        {entry.source === "saved" && (
          <details className={`${card} mt-6`}>
            <summary className="cursor-pointer text-[14px] font-medium">Reset to the built-in content</summary>
            <div className="mt-3">
              <ActionForm action={deleteContent} submitLabel="Reset" confirmText="Yes, discard the edits to this entry">
                <input type="hidden" name="id" value={id} />
              </ActionForm>
            </div>
          </details>
        )}
      </>
    );
  }

  if (!isList(collection)) notFound();
  const back = <p className="mt-0 mb-2 text-[13px]"><Link href={`/admin/content/${collection}`} className="text-[#007ac3]">← {LISTS[collection].title}</Link></p>;
  const savedBanner = saved && <p role="status" className="mb-4 rounded-[8px] bg-[#e7f6ec] px-3 py-2 text-[14px] text-[#1e7d3a]">Saved. The site shows the change now.</p>;
  const field = describe(LISTS[collection].schema);

  // Markdown sections + SEO of an existing page: the key is the page slug; nothing to create.
  if (collection === "page-content") {
    const page = sitePage(key);
    if (!page) notFound();
    const entry = readListEntry("page-content", key);
    return (
      <>
        {back}
        <h1 className="mb-1 text-[26px] font-semibold">{page.title}</h1>
        <p className="mt-0 mb-4 max-w-[820px] text-[14px] text-[#5b5f66]">
          <a href={withBasePath(page.path)} target="_blank" rel="noopener noreferrer" className="text-[#007ac3]">{page.path} ↗</a> · The page keeps its design. Sections
          added here appear at the top (under the header) or the bottom (above the footer); write them in Markdown or load a .md file.
        </p>
        {savedBanner}
        <div className={card}>
          <ContentEditor key={`${key}-${entry?.updatedAt ?? 0}`} id={collection} entryKey={key} field={field} initial={entry?.data ?? { sections: [] }} action={saveContent} />
        </div>
        {entry && (
          <details className={`${card} mt-6`}>
            <summary className="cursor-pointer text-[14px] font-medium text-[#a12622]">Remove all sections and SEO changes</summary>
            <div className="mt-3">
              <ActionForm action={deleteContent} submitLabel="Remove" confirmText="Yes, restore this page to its original content">
                <input type="hidden" name="id" value={collection} />
                <input type="hidden" name="key" value={key} />
              </ActionForm>
            </div>
          </details>
        )}
      </>
    );
  }

  const noun = collection === "blog" ? "post" : "page";
  if (key === "import") {
    return (
      <>
        {back}
        <h1 className="mb-4 text-[26px] font-semibold">Import {collection === "blog" ? "blog posts" : "pages"} from Markdown</h1>
        <MarkdownImporter kind={collection} />
      </>
    );
  }
  const isNew = key === "new";
  const entry = isNew ? undefined : readListEntry(collection, key);
  if (!isNew && !entry) notFound();
  const initial = entry?.data ?? (collection === "blog" ? newPost() : { title: "", metaTitle: null, description: null, markdown: "" });
  return (
    <>
      {back}
      <h1 className="mb-1 text-[26px] font-semibold">{isNew ? `New ${noun}` : entry!.data.title}</h1>
      {!isNew && (
        <p className="mt-0 mb-4 text-[14px] text-[#5b5f66]">
          <a href={withBasePath(`/${key}`)} target="_blank" rel="noopener noreferrer" className="text-[#007ac3]">/{key} ↗</a>
          {" · "}
          {entry!.source === "saved" ? `Last edited by ${entry!.updatedBy}` : "Imported article (not edited yet)"}
        </p>
      )}
      {savedBanner}
      <div className={card}>
        <ContentEditor key={`${key}-${entry?.updatedAt ?? 0}`} id={collection} entryKey={isNew ? "" : key} isNew={isNew} field={field} initial={initial} action={saveContent} />
      </div>
      {!isNew && (
        <details className={`${card} mt-6`}>
          <summary className="cursor-pointer text-[14px] font-medium text-[#a12622]">Remove this {noun}</summary>
          <div className="mt-3">
            <ActionForm action={deleteContent} submitLabel={`Remove ${noun}`} confirmText={`Yes, remove /${key} from the site`}>
              <input type="hidden" name="id" value={collection} />
              <input type="hidden" name="key" value={key} />
            </ActionForm>
          </div>
        </details>
      )}
    </>
  );
}
