"use client";

import { Download, RotateCcw, Search, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { exportPageMarkdown, importPageMarkdown, savePageTexts } from "@/lib/admin/page-text-actions";
import type { PageText } from "@/lib/content/page-texts";
import { cn } from "@/lib/utils";
import { downloadText } from "./markdown-importer";

const btn = "inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#dfe3e8] bg-white px-3 text-[13px] font-medium hover:bg-[#f1f4f8] disabled:opacity-50";

/** Every text on a page, editable in place (design unchanged); also as one .md file. */
export function PageTextEditor({ slug, texts, complete }: { slug: string; texts: PageText[]; complete: boolean }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Record<string, string>>(() => Object.fromEntries(texts.map((t) => [t.id, t.text])));
  const [query, setQuery] = useState("");
  const [onlyEdited, setOnlyEdited] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const changed = texts.filter((t) => draft[t.id] !== t.text);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return texts.filter((t) => (!onlyEdited || t.edited || draft[t.id] !== t.text) && (!q || t.original.toLowerCase().includes(q) || draft[t.id].toLowerCase().includes(q)));
  }, [texts, query, onlyEdited, draft]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (changed.length && !busy) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [changed.length, busy]);

  async function save() {
    setBusy("Saving…");
    const r = await savePageTexts(slug, changed.map((t) => ({ original: t.original, text: draft[t.id] }))).catch((e: Error) => ({ ok: false, message: e.message }));
    setStatus(r);
    setBusy(null);
    if (r.ok) router.refresh();
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-[220px] flex-1">
          <Search size={15} className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-[#8a9099]" aria-hidden="true" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${texts.length} texts…`} aria-label="Search texts" className="h-9 w-full rounded-[8px] border border-[#dfe3e8] bg-white pr-3 pl-8 text-[14px] focus:border-[#007ac3] focus:outline-none" />
        </label>
        <label className="flex items-center gap-2 text-[13px] text-[#30343a]">
          <input type="checkbox" checked={onlyEdited} onChange={(e) => setOnlyEdited(e.target.checked)} /> Edited only ({texts.filter((t) => t.edited).length})
        </label>
        <button
          type="button"
          className={btn}
          disabled={!!busy}
          onClick={async () => {
            setBusy("Preparing .md…");
            try {
              downloadText(await exportPageMarkdown(slug), `prayag-${slug}.md`);
            } catch (e) {
              setStatus({ ok: false, message: (e as Error).message });
            }
            setBusy(null);
          }}
        >
          <Download size={15} aria-hidden="true" /> Download .md
        </button>
        <button type="button" className={btn} disabled={!!busy} onClick={() => file.current?.click()}>
          <Upload size={15} aria-hidden="true" /> Upload .md
        </button>
        <input
          ref={file}
          type="file"
          accept=".md,.markdown,text/markdown,text/plain"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            setBusy("Importing .md…");
            const r = await importPageMarkdown(slug, await f.text()).catch((err: Error) => ({ ok: false, message: err.message }));
            setStatus(r);
            setBusy(null);
            if (r.ok) router.refresh();
          }}
        />
      </div>
      {!complete && (
        <p className="m-0 rounded-[8px] bg-[#fff8e6] px-3 py-2 text-[13px] text-[#7a5200]">
          The page could not be loaded to check which texts it shows, so every text found in its code is listed; editing one that is not on the page has no effect.
        </p>
      )}
      {status && <p role="status" className={cn("m-0 rounded-[8px] px-3 py-2 text-[14px]", status.ok ? "bg-[#e7f6ec] text-[#1e7d3a]" : "bg-[#fdecec] text-[#a12622]")}>{status.message}</p>}

      <ol className="m-0 grid list-none gap-2 p-0">
        {visible.map((t) => {
          const n = texts.indexOf(t) + 1;
          const value = draft[t.id];
          const dirty = value !== t.text;
          const long = t.original.length > 90;
          return (
            <li key={t.id} className={cn("grid grid-cols-[32px_1fr] gap-x-2 rounded-[10px] border bg-white px-3 py-2.5 leading-5", dirty ? "border-[#f0c36d] bg-[#fffdf6]" : t.edited ? "border-[#9cc9ec]" : "border-[#e6e9ee]")}>
              <span className="pt-2 text-right text-[12px] text-[#a0a6ae] tabular-nums" aria-hidden="true">{n}</span>
              <div className="min-w-0">
              <div className={cn("flex items-center gap-2 text-[12px]", (t.edited || dirty) && "mb-1.5")}>
                {t.edited && !dirty && <span className="rounded-full bg-[#e7f1fb] px-2 py-0.5 font-medium text-[#0b5a91]">Edited</span>}
                {dirty && <span className="rounded-full bg-[#fff1cc] px-2 py-0.5 font-medium text-[#8a5a00]">Unsaved</span>}
                {(t.edited || dirty) && (
                  <span className="min-w-0 flex-1 truncate text-[#8a9099]" title={t.original}>
                    Original: {t.original}
                  </span>
                )}
                {(t.edited || dirty) && (
                  <button type="button" className="ml-auto inline-flex items-center gap-1 text-[#5b5f66] hover:text-[#a12622]" onClick={() => setDraft({ ...draft, [t.id]: t.original })} title="Back to the original text">
                    <RotateCcw size={13} aria-hidden="true" /> Original
                  </button>
                )}
              </div>
              {long ? (
                <textarea value={value} onChange={(e) => setDraft({ ...draft, [t.id]: e.target.value })} rows={Math.min(8, Math.ceil(value.length / 110) + 1)} aria-label={`Text: ${t.original.slice(0, 60)}`} className="w-full rounded-[6px] border border-[#dfe3e8] px-2.5 py-1.5 text-[14px] leading-6 focus:border-[#007ac3] focus:outline-none" />
              ) : (
                <input value={value} onChange={(e) => setDraft({ ...draft, [t.id]: e.target.value })} aria-label={`Text: ${t.original}`} className="h-9 w-full rounded-[6px] border border-[#dfe3e8] px-2.5 text-[14px] focus:border-[#007ac3] focus:outline-none" />
              )}
              </div>
            </li>
          );
        })}
        {!visible.length && <li className="rounded-[10px] bg-white p-4 text-[14px] text-[#5b5f66]">No texts match.</li>}
      </ol>

      <div className="sticky bottom-0 z-10 -mx-4 -mb-4 flex flex-wrap items-center gap-3 rounded-b-[12px] border-t border-[#e6e9ee] bg-white/95 px-4 py-3 backdrop-blur">
        <button type="button" onClick={save} disabled={!changed.length || !!busy} className="h-10 rounded-[8px] bg-black px-5 text-[14px] font-medium text-white disabled:opacity-50">
          {busy === "Saving…" ? "Saving…" : `Save ${changed.length || ""} change${changed.length === 1 ? "" : "s"}`}
        </button>
        {changed.length > 0 && !busy && (
          <button type="button" className="text-[13px] text-[#5b5f66] underline" onClick={() => setDraft(Object.fromEntries(texts.map((t) => [t.id, t.text])))}>
            Discard
          </button>
        )}
        <span aria-live="polite" className="text-[13px] text-[#5b5f66]">{busy && busy !== "Saving…" ? busy : ""}</span>
      </div>
    </div>
  );
}
