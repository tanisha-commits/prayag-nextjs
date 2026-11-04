"use client";

import { createContext, useActionState, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ActionState } from "@/lib/admin/actions";
import type { Field } from "@/lib/content/fields";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";
import { uploadImage } from "./markdown-importer";

type Value = unknown;
type Obj = Record<string, Value>;

const input = "w-full rounded-[6px] border border-[#d1d5db] bg-white px-2.5 py-1.5 text-[14px] focus:border-[#007ac3] focus:outline-none focus:ring-2 focus:ring-[#007ac3]/20";
const smallBtn = "h-7 rounded-[6px] border border-[#d1d5db] bg-white px-2 text-[12px] hover:bg-[#f3f4f6] disabled:opacity-40";

/** Recommended lengths for search-result text (counter turns amber past them). */
const LIMITS: Record<string, number> = { metaTitle: 60, seoTitle: 60, description: 160, seoDescription: 160 };

/** Validation messages keyed by field path ("phones.0.label"), shown under the field. */
const ErrorsContext = createContext<Record<string, string>>({});

/** A new, empty value for a field (used when adding a list item). */
function blank(f: Field): Value {
  switch (f.kind) {
    case "string":
      return f.nullable ? null : "";
    case "number":
      return 0;
    case "boolean":
      return false;
    case "choice":
      return f.options[0];
    case "object":
      return Object.fromEntries(f.fields.filter((c) => !c.optional || c.kind === "list").map((c) => [c.name, blank(c)]));
    case "list":
      return [];
  }
}

/** Drop empty optional values so they fall back to their defaults instead of failing validation. */
function clean(f: Field, v: Value): Value {
  if (f.kind === "object" && v && typeof v === "object") {
    const out: Obj = {};
    for (const c of f.fields) {
      const cv = clean(c, (v as Obj)[c.name]);
      if (c.optional && (cv === "" || cv === undefined || (c.kind === "number" && Number.isNaN(cv)))) continue;
      out[c.name] = cv;
    }
    return out;
  }
  if (f.kind === "list" && Array.isArray(v)) return v.map((x) => clean(f.item, x));
  if (f.kind === "string" && f.nullable && v === "") return null;
  return v;
}

/** Label of a list item: its first non-empty text field. */
function itemLabel(f: Field, v: Value, i: number): string {
  if (f.kind === "object" && v && typeof v === "object") {
    for (const c of f.fields) {
      const x = (v as Obj)[c.name];
      if (c.kind === "string" && typeof x === "string" && x.trim() && c.widget !== "html") return x.length > 80 ? `${x.slice(0, 80)}…` : x;
    }
  }
  if (typeof v === "string" && v) return v;
  return `${f.title || "Item"} ${i + 1}`;
}

/** First image path inside a list item, for its thumbnail. */
function itemImage(f: Field, v: Value): string | undefined {
  if (f.kind !== "object" || !v || typeof v !== "object") return undefined;
  const c = f.fields.find((x) => x.kind === "string" && x.widget === "image" && typeof (v as Obj)[x.name] === "string" && (v as Obj)[x.name]);
  return c ? ((v as Obj)[c.name] as string) : undefined;
}

const imageUrl = (src: string) => (/^https?:\/\//.test(src) ? src : withBasePath(src));

function ImageField({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const [state, setState] = useState<{ busy: boolean; error?: string }>({ busy: false });
  const file = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-wrap items-start gap-3">
      <div className="min-w-[240px] flex-1">
        <div className="flex gap-2">
          <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={input} type="text" />
          <button type="button" className={cn(smallBtn, "h-[34px] shrink-0 px-3 text-[13px]")} disabled={state.busy} onClick={() => file.current?.click()}>
            {state.busy ? "Uploading…" : "Upload"}
          </button>
          <input
            ref={file}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              setState({ busy: true });
              try {
                onChange(await uploadImage(f));
                setState({ busy: false });
              } catch (err) {
                setState({ busy: false, error: (err as Error).message });
              }
            }}
          />
        </div>
        {state.error && <p className="mt-1 mb-0 text-[12px] text-[#a12622]">{state.error}</p>}
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of an arbitrary path
        <img src={imageUrl(value)} alt="" className="h-16 max-w-[160px] rounded border border-[#e5e7eb] bg-[#f3f4f6] object-contain" />
      )}
    </div>
  );
}

function HtmlField({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  return (
    <div>
      <div role="tablist" className="mb-1 flex gap-1 text-[12px]">
        {(["edit", "preview"] as const).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("rounded-[6px] px-2.5 py-1", tab === t ? "bg-[#111] text-white" : "bg-[#f3f4f6] text-[#333]")}>
            {t === "edit" ? "HTML" : "Preview"}
          </button>
        ))}
      </div>
      {tab === "edit" ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={Math.min(24, Math.max(6, Math.ceil(value.length / 110)))} className={cn(input, "font-mono text-[12px] leading-5")} spellCheck={false} />
      ) : (
        // Preview of the editor's own text; the saved copy is sanitized on the server.
        <div
          className="max-h-[480px] overflow-auto rounded-[6px] border border-[#e5e7eb] bg-white p-4 text-[15px] leading-7 [&_a]:text-[#007ac3] [&_a]:underline [&_h2]:mt-4 [&_h2]:text-[20px] [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:text-[17px] [&_h3]:font-semibold [&_img]:max-w-full [&_li]:ml-5 [&_li]:list-disc [&_p]:my-2 [&_table]:border-collapse [&_td]:border [&_td]:px-2 [&_th]:border [&_th]:px-2"
          dangerouslySetInnerHTML={{ __html: value.replace(/<\s*script\b[\s\S]*?<\s*\/\s*script\s*>/gi, "").replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "") }}
        />
      )}
      <p className="mt-1 mb-0 text-[12px] text-[#6b7280]">Scripts, frames and inline event handlers are removed when saving.</p>
    </div>
  );
}

function Editor({ f, value, onChange, path }: { f: Field; value: Value; onChange: (v: Value) => void; path: string }) {
  const errors = useContext(ErrorsContext);
  const error = errors[path];
  const id = `f-${path || "root"}`;
  const label = f.title && (
    <label htmlFor={id} className="mb-1 block text-[13px] font-medium text-[#333]">
      {f.title}
      {f.optional && <span className="font-normal text-[#888]"> (optional)</span>}
    </label>
  );
  const foot = (
    <>
      {f.description && <p className="mt-1 mb-0 text-[12px] text-[#6b7280]">{f.description}</p>}
      {error && <p className="mt-1 mb-0 text-[12px] font-medium text-[#a12622]">{error}</p>}
    </>
  );

  switch (f.kind) {
    case "string": {
      const v = typeof value === "string" ? value : "";
      const limit = LIMITS[f.name];
      return (
        <div>
          {label}
          {f.widget === "html" ? (
            <HtmlField id={id} value={v} onChange={onChange} />
          ) : f.widget === "image" ? (
            <ImageField id={id} value={v} onChange={onChange} />
          ) : f.widget === "textarea" ? (
            <textarea id={id} value={v} onChange={(e) => onChange(e.target.value)} rows={3} className={cn(input, error && "border-[#a12622]")} />
          ) : (
            <input id={id} value={v} onChange={(e) => onChange(e.target.value)} className={cn(input, error && "border-[#a12622]")} type="text" inputMode={f.widget === "url" ? "url" : undefined} />
          )}
          {limit && <p className={cn("mt-1 mb-0 text-right text-[12px]", v.length > limit ? "text-[#b26a00]" : "text-[#888]")}>{v.length} / {limit} recommended</p>}
          {foot}
        </div>
      );
    }
    case "number":
      return (
        <div>
          {label}
          <input id={id} type="number" step={f.integer ? 1 : "any"} value={typeof value === "number" && !Number.isNaN(value) ? value : ""} onChange={(e) => onChange(e.target.value === "" ? Number.NaN : Number(e.target.value))} className={cn(input, "max-w-[220px]")} />
          {foot}
        </div>
      );
    case "boolean":
      return (
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} /> {f.title}
        </label>
      );
    case "choice":
      return (
        <div>
          {label}
          <select id={id} value={String(value ?? f.options[0])} onChange={(e) => onChange(f.options.find((o) => String(o) === e.target.value))} className={cn(input, "max-w-[220px]")}>
            {f.options.map((o) => (
              <option key={String(o)} value={String(o)}>
                {String(o)}
              </option>
            ))}
          </select>
          {foot}
        </div>
      );
    case "object": {
      const obj = (value && typeof value === "object" ? value : {}) as Obj;
      return (
        <div className="grid gap-4">
          {f.fields.map((c) => (
            <Editor key={c.name} f={c} path={path ? `${path}.${c.name}` : c.name} value={obj[c.name]} onChange={(v) => onChange({ ...obj, [c.name]: v })} />
          ))}
        </div>
      );
    }
    case "list":
      return <ListEditor f={f} value={value} onChange={onChange} path={path} foot={foot} />;
  }
}

function ListEditor({ f, value, onChange, path, foot }: { f: Extract<Field, { kind: "list" }>; value: Value; onChange: (v: Value) => void; path: string; foot: React.ReactNode }) {
  const items = Array.isArray(value) ? value : [];
  const box = useRef<HTMLFieldSetElement>(null);
  const errors = useContext(ErrorsContext);
  const set = (next: Value[]) => onChange(next);
  const move = (i: number, d: number) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    set(next);
  };
  const toggleAll = (open: boolean) => box.current?.querySelectorAll(":scope > ol > li > details").forEach((d) => ((d as HTMLDetailsElement).open = open));
  const stop = (e: React.MouseEvent, fn: () => void) => (e.preventDefault(), fn());
  return (
    <fieldset ref={box} className="m-0 min-w-0 rounded-[8px] border border-[#e5e7eb] p-3">
      <legend className="px-1 text-[13px] font-semibold">
        {f.title} <span className="font-normal text-[#888]">({items.length})</span>
      </legend>
      {items.length > 1 && (
        <div className="mb-2 flex gap-3 text-[12px]">
          <button type="button" className="text-[#007ac3]" onClick={() => toggleAll(true)}>Expand all</button>
          <button type="button" className="text-[#007ac3]" onClick={() => toggleAll(false)}>Collapse all</button>
        </div>
      )}
      <ol className="m-0 grid list-none gap-2 p-0">
        {items.map((item, i) => {
          const itemPath = path ? `${path}.${i}` : String(i);
          const hasError = Object.keys(errors).some((k) => k === itemPath || k.startsWith(`${itemPath}.`));
          const thumb = itemImage(f.item, item);
          return (
            <li key={i} className={cn("rounded-[6px] border bg-[#fafafa]", hasError ? "border-[#e8a19d]" : "border-[#e5e7eb]")}>
              <details open={hasError || undefined}>
                <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-[13px]">
                  {thumb && (
                    // eslint-disable-next-line @next/next/no-img-element -- list item thumbnail
                    <img src={imageUrl(thumb)} alt="" className="size-8 shrink-0 rounded object-cover" />
                  )}
                  <span className="min-w-0 flex-1 truncate">
                    <b className="text-[#888]">{i + 1}.</b> {itemLabel(f.item, item, i)}
                    {hasError && <span className="ml-2 text-[#a12622]">needs attention</span>}
                  </span>
                  <button type="button" className={smallBtn} disabled={i === 0} onClick={(e) => stop(e, () => move(i, -1))} aria-label="Move up">↑</button>
                  <button type="button" className={smallBtn} disabled={i === items.length - 1} onClick={(e) => stop(e, () => move(i, 1))} aria-label="Move down">↓</button>
                  <button type="button" className={smallBtn} onClick={(e) => stop(e, () => set([...items.slice(0, i + 1), structuredClone(item), ...items.slice(i + 1)]))}>Duplicate</button>
                  <button type="button" className={cn(smallBtn, "text-[#a12622]")} onClick={(e) => stop(e, () => set(items.filter((_, j) => j !== i)))}>Remove</button>
                </summary>
                <div className="border-t border-[#e5e7eb] bg-white p-3">
                  <Editor f={f.item} path={itemPath} value={item} onChange={(v) => set(items.map((x, j) => (j === i ? v : x)))} />
                </div>
              </details>
            </li>
          );
        })}
      </ol>
      <button type="button" className={cn(smallBtn, "mt-2 h-8 px-3 text-[13px]")} onClick={() => set([...items, blank(f.item)])}>
        + Add {f.item.title ? f.item.title.toLowerCase() : "item"}
      </button>
      {foot}
    </fieldset>
  );
}

/** Form for one content entry, generated from its schema. */
export function ContentEditor({
  id,
  entryKey,
  isNew,
  field,
  initial,
  action,
}: {
  id: string;
  entryKey?: string;
  isNew?: boolean;
  field: Field;
  initial: Value;
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
}) {
  const [value, setValue] = useState<Value>(initial);
  const [key, setKey] = useState(entryKey ?? "");
  const [state, formAction, pending] = useActionState(action, null);
  const form = useRef<HTMLFormElement>(null);
  const serialized = JSON.stringify(clean(field, value));
  const initialSerialized = useMemo(() => JSON.stringify(clean(field, initial)), [field, initial]);
  const dirty = isNew || serialized !== initialSerialized;
  const errors = state?.ok === false ? (state.errors ?? {}) : {};

  // Warn before leaving with unsaved edits; Ctrl/Cmd+S saves.
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty && !pending && !isNew) e.preventDefault();
    };
    const keydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        form.current?.requestSubmit();
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    window.addEventListener("keydown", keydown);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("keydown", keydown);
    };
  }, [dirty, pending, isNew]);

  return (
    <ErrorsContext.Provider value={errors}>
      <form ref={form} action={formAction} className="grid gap-5">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="data" value={serialized} />
        {isNew ? (
          <>
            <input type="hidden" name="isNew" value="1" />
            <div>
              <label htmlFor="entry-key" className="mb-1 block text-[13px] font-medium">URL slug</label>
              <input id="entry-key" name="key" value={key} onChange={(e) => setKey(e.target.value.toLowerCase())} required pattern="[a-z0-9]+(-[a-z0-9]+)*" className={cn(input, "max-w-[420px]")} placeholder="e.g. how-to-choose-a-kitchen-sink" />
              <p className="mt-1 mb-0 text-[12px] text-[#6b7280]">The post will live at /{key || "<slug>"}. Lower-case words joined by hyphens.</p>
            </div>
          </>
        ) : (
          entryKey && <input type="hidden" name="key" value={entryKey} />
        )}
        <Editor f={field} path="" value={value} onChange={setValue} />
        <div className="sticky bottom-0 z-10 -mx-4 -mb-4 flex flex-wrap items-center gap-3 rounded-b-[10px] border-t border-[#e5e7eb] bg-white/95 px-4 py-3 backdrop-blur">
          <button type="submit" disabled={pending || !dirty} className="h-10 rounded-[8px] bg-black px-5 text-[14px] font-medium text-white disabled:opacity-50">
            {pending ? "Saving…" : isNew ? "Create post" : "Save changes"}
          </button>
          {!isNew && dirty && !pending && (
            <>
              <span className="rounded-full bg-[#fff4d6] px-2.5 py-0.5 text-[12px] font-medium text-[#8a5a00]">Unsaved changes</span>
              <button type="button" className="text-[13px] text-[#5b5f66] underline" onClick={() => setValue(initial)}>Discard</button>
            </>
          )}
          <span className="ml-auto hidden text-[12px] text-[#888] sm:inline">Ctrl/⌘ + S to save</span>
          {state?.ok === false && (
            <p aria-live="polite" className="m-0 w-full text-[14px] text-[#a12622]">
              {state.message} {Object.keys(errors).length > 0 && `The fields marked in red need attention (${Object.keys(errors).length}).`}
            </p>
          )}
        </div>
      </form>
    </ErrorsContext.Provider>
  );
}
