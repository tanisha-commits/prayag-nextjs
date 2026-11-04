"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { importMarkdownPosts, previewMarkdownPosts, type MdFile, type MdResult } from "@/lib/admin/markdown-actions";
import { MARKDOWN_TEMPLATE } from "@/lib/content/markdown-template";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

const btn = "h-10 rounded-[8px] px-4 text-[14px] font-medium disabled:opacity-50";
const isMd = (f: File) => /\.(md|markdown)$/i.test(f.name);
const isImage = (f: File) => /^image\//.test(f.type) || /\.(jpe?g|png|gif|webp|avif)$/i.test(f.name);

/** Uploads one image to the media library; returns its site path. */
export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch(withBasePath("/admin/media"), { method: "POST", body });
  const json = (await res.json().catch(() => ({}))) as { path?: string; error?: string };
  if (!res.ok || !json.path) throw new Error(json.error ?? `Upload failed (${res.status}).`);
  return json.path;
}

function downloadTemplate() {
  const url = URL.createObjectURL(new Blob([MARKDOWN_TEMPLATE], { type: "text/markdown" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: "prayag-blog-post-template.md" });
  a.click();
  URL.revokeObjectURL(url);
}

export function MarkdownImporter() {
  const [files, setFiles] = useState<File[]>([]);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [media, setMedia] = useState<Record<string, string>>({});
  const [results, setResults] = useState<MdResult[] | null>(null);
  const [overwrite, setOverwrite] = useState(false);
  const [done, setDone] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const add = (list: FileList | null) => {
    if (!list) return;
    const incoming = [...list].filter((f) => isMd(f) || isImage(f));
    setFiles((prev) => [...prev.filter((p) => !incoming.some((f) => f.name === p.name)), ...incoming]);
    setResults(null);
    setDone(false);
    setError(incoming.length < list.length ? "Only .md files and images (JPEG, PNG, GIF, WebP, AVIF) are accepted; other files were skipped." : null);
  };

  const mdFiles = files.filter(isMd);
  const images = files.filter(isImage);

  async function readAll(): Promise<{ docs: MdFile[]; map: Record<string, string> }> {
    const map = { ...media };
    for (const [i, img] of images.entries()) {
      if (map[img.name]) continue;
      setBusy(`Uploading image ${i + 1} of ${images.length}: ${img.name}`);
      map[img.name] = await uploadImage(img);
    }
    setMedia(map);
    setBusy("Reading files…");
    const docs = await Promise.all(mdFiles.map(async (f) => ({ name: f.name, text: await f.text() })));
    return { docs, map };
  }

  async function preview() {
    setError(null);
    try {
      const { docs, map } = await readAll();
      setBusy("Checking posts…");
      setResults(await previewMarkdownPosts(docs, map));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function run() {
    setError(null);
    try {
      const { docs, map } = await readAll();
      setBusy("Importing…");
      setResults(await importMarkdownPosts(docs, map, overwrite));
      setDone(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const ready = results?.filter((r) => r.ok && (!r.exists || overwrite)) ?? [];

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-3 rounded-[10px] bg-[#f0f7fc] px-4 py-3 text-[14px] text-[#24435c]">
        <span className="min-w-0 flex-1">
          Each <b>.md</b> file is one post: a header with the title, slug, date, SEO text and banner, then the article in Markdown.
          Upload the images it mentions (banner, pictures in the article) together with it.
        </span>
        <button type="button" onClick={downloadTemplate} className={cn(btn, "border border-[#007ac3] bg-white text-[#007ac3]")}>
          Download template (.md)
        </button>
      </div>

      <div
        onDragOver={(e) => (e.preventDefault(), setDrag(true))}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => (e.preventDefault(), setDrag(false), add(e.dataTransfer.files))}
        className={cn("grid place-items-center rounded-[12px] border-2 border-dashed px-4 py-10 text-center transition-colors", drag ? "border-[#007ac3] bg-[#f0f7fc]" : "border-[#cfd4da] bg-white")}
      >
        <p className="m-0 text-[15px] font-medium">Drop .md files and their images here</p>
        <p className="mt-1 mb-3 text-[13px] text-[#6b7280]">or</p>
        <button type="button" onClick={() => input.current?.click()} className={cn(btn, "bg-black text-white")}>Choose files</button>
        <input ref={input} type="file" multiple accept=".md,.markdown,text/markdown,image/*" className="hidden" onChange={(e) => (add(e.target.files), (e.target.value = ""))} />
      </div>

      {files.length > 0 && (
        <div className="rounded-[10px] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="mb-2 flex items-center gap-3">
            <h2 className="m-0 text-[15px] font-semibold">{mdFiles.length} post file(s) · {images.length} image(s)</h2>
            <button type="button" className="ml-auto text-[13px] text-[#a12622]" onClick={() => (setFiles([]), setResults(null), setMedia({}), setDone(false))}>Clear</button>
          </div>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0 text-[13px]">
            {files.map((f) => (
              <li key={f.name} className="flex items-center gap-1.5 rounded-full bg-[#f3f4f6] py-1 pr-1 pl-3">
                {isMd(f) ? "📝" : "🖼️"} {f.name}
                {media[f.name] && <span className="text-[#1e7d3a]">✓</span>}
                <button type="button" aria-label={`Remove ${f.name}`} className="grid size-6 place-items-center rounded-full hover:bg-[#e5e7eb]" onClick={() => (setFiles(files.filter((x) => x !== f)), setResults(null))}>×</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p role="alert" className="m-0 rounded-[8px] bg-[#fdecec] px-3 py-2 text-[14px] text-[#a12622]">{error}</p>}

      {results && (
        <ol className="m-0 grid list-none gap-3 p-0">
          {results.map((r) => (
            <li key={r.file} className={cn("rounded-[10px] border bg-white p-4", r.saved ? "border-[#9fd8b1]" : r.ok ? "border-[#e5e7eb]" : "border-[#f2b8b5]")}>
              <div className="flex flex-wrap items-start gap-4">
                {r.bannerImage && (
                  // eslint-disable-next-line @next/next/no-img-element -- admin preview of an uploaded/site image
                  <img src={/^https?:/.test(r.bannerImage) ? r.bannerImage : withBasePath(r.bannerImage)} alt="" className="h-20 w-32 rounded-[6px] object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-[12px] text-[#6b7280]">{r.file}</p>
                  <p className="m-0 text-[16px] font-semibold">{r.title ?? "(not readable)"}</p>
                  {r.slug && (
                    <p className="m-0 text-[13px] text-[#5b5f66]">
                      /{r.slug} · {r.published}
                      {r.exists && !r.saved && <span className="ml-2 rounded-full bg-[#fff4d6] px-2 py-0.5 text-[12px] text-[#8a5a00]">already exists</span>}
                      {r.saved && <span className="ml-2 rounded-full bg-[#e7f6ec] px-2 py-0.5 text-[12px] text-[#1e7d3a]">imported</span>}
                    </p>
                  )}
                  {r.errors.map((m) => <p key={m} className="mt-1 mb-0 text-[13px] text-[#a12622]">✕ {m}</p>)}
                  {r.warnings.map((m) => <p key={m} className="mt-1 mb-0 text-[13px] text-[#8a5a00]">! {m}</p>)}
                  {r.saved && r.slug && (
                    <p className="mt-2 mb-0 flex gap-4 text-[13px]">
                      <a href={withBasePath(`/${r.slug}`)} target="_blank" rel="noopener noreferrer" className="text-[#007ac3]">View on site ↗</a>
                      <Link href={`/admin/content/blog/${r.slug}`} className="text-[#007ac3]">Edit</Link>
                    </p>
                  )}
                </div>
              </div>
              {r.bodyHtml && !r.saved && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-[13px] text-[#007ac3]">Preview article</summary>
                  <div className="prose-preview mt-2 max-h-[420px] overflow-auto rounded-[6px] border border-[#e5e7eb] p-4 text-[15px] leading-7 [&_h2]:mt-4 [&_h2]:text-[20px] [&_h2]:font-semibold [&_h3]:text-[17px] [&_h3]:font-semibold [&_img]:max-w-full [&_li]:ml-5 [&_li]:list-disc [&_a]:text-[#007ac3] [&_a]:underline [&_p]:my-2" dangerouslySetInnerHTML={{ __html: r.bodyHtml }} />
                </details>
              )}
            </li>
          ))}
        </ol>
      )}

      {mdFiles.length > 0 && !done && (
        <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-[#e5e7eb] bg-white px-4 py-3">
          <button type="button" onClick={preview} disabled={!!busy} className={cn(btn, "border border-[#d1d5db] bg-white")}>Preview</button>
          {results && (
            <>
              {results.some((r) => r.exists) && (
                <label className="flex items-center gap-2 text-[14px]">
                  <input type="checkbox" checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)} /> Replace existing posts
                </label>
              )}
              <button type="button" onClick={run} disabled={!!busy || !ready.length} className={cn(btn, "bg-black text-white")}>
                Import {ready.length} post{ready.length === 1 ? "" : "s"}
              </button>
            </>
          )}
          <span aria-live="polite" className="text-[13px] text-[#5b5f66]">{busy}</span>
        </div>
      )}
      {done && (
        <p className="m-0 flex gap-4 text-[14px]">
          <Link href="/admin/content/blog" className="text-[#007ac3]">← All posts</Link>
          <button type="button" className="text-[#007ac3]" onClick={() => (setFiles([]), setResults(null), setMedia({}), setDone(false))}>Import more</button>
        </p>
      )}
    </div>
  );
}
