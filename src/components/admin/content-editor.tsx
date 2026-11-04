"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/lib/admin/actions";
import type { Field } from "@/lib/content/fields";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

type Value = unknown;
type Obj = Record<string, Value>;

const input = "w-full rounded-[6px] border border-[#d1d5db] bg-white px-2 py-1.5 text-[14px]";
const smallBtn = "h-7 rounded-[6px] border border-[#d1d5db] bg-white px-2 text-[12px] hover:bg-[#f3f4f6] disabled:opacity-40";

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

function Preview({ src }: { src: string }) {
  if (!src) return null;
  const url = /^https?:\/\//.test(src) ? src : withBasePath(src);
  // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of an arbitrary path
  return <img src={url} alt="" className="mt-1 max-h-24 max-w-[200px] rounded border border-[#e5e7eb] object-contain" />;
}

function Editor({ f, value, onChange, path }: { f: Field; value: Value; onChange: (v: Value) => void; path: string }) {
  const id = `f-${path}`;
  const label = f.title && (
    <label htmlFor={id} className="mb-1 block text-[13px] font-medium text-[#333]">
      {f.title}
      {f.optional && <span className="font-normal text-[#888]"> (optional)</span>}
    </label>
  );
  const help = f.description && <p className="mt-1 mb-0 text-[12px] text-[#6b7280]">{f.description}</p>;

  switch (f.kind) {
    case "string": {
      const v = typeof value === "string" ? value : "";
      const set = (x: string) => onChange(x);
      return (
        <div>
          {label}
          {f.widget === "html" ? (
            <textarea id={id} value={v} onChange={(e) => set(e.target.value)} rows={Math.min(24, Math.max(6, Math.ceil(v.length / 110)))} className={cn(input, "font-mono text-[12px] leading-5")} spellCheck={false} />
          ) : f.widget === "textarea" ? (
            <textarea id={id} value={v} onChange={(e) => set(e.target.value)} rows={3} className={input} />
          ) : (
            <input id={id} value={v} onChange={(e) => set(e.target.value)} className={input} type="text" inputMode={f.widget === "url" ? "url" : undefined} />
          )}
          {f.widget === "image" && <Preview src={v} />}
          {f.widget === "html" && <p className="mt-1 mb-0 text-[12px] text-[#6b7280]">HTML. Scripts, frames and inline event handlers are removed when saving.</p>}
          {help}
        </div>
      );
    }
    case "number":
      return (
        <div>
          {label}
          <input id={id} type="number" step={f.integer ? 1 : "any"} value={typeof value === "number" && !Number.isNaN(value) ? value : ""} onChange={(e) => onChange(e.target.value === "" ? Number.NaN : Number(e.target.value))} className={cn(input, "max-w-[220px]")} />
          {help}
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
          {help}
        </div>
      );
    case "object": {
      const obj = (value && typeof value === "object" ? value : {}) as Obj;
      return (
        <div className="grid gap-3">
          {f.fields.map((c) => (
            <Editor key={c.name} f={c} path={`${path}.${c.name}`} value={obj[c.name]} onChange={(v) => onChange({ ...obj, [c.name]: v })} />
          ))}
        </div>
      );
    }
    case "list": {
      const items = Array.isArray(value) ? value : [];
      const set = (next: Value[]) => onChange(next);
      const move = (i: number, d: number) => {
        const next = [...items];
        [next[i], next[i + d]] = [next[i + d], next[i]];
        set(next);
      };
      return (
        <fieldset className="m-0 rounded-[8px] border border-[#e5e7eb] p-3">
          <legend className="px-1 text-[13px] font-semibold">
            {f.title} <span className="font-normal text-[#888]">({items.length})</span>
          </legend>
          {help}
          <ol className="m-0 grid list-none gap-2 p-0">
            {items.map((item, i) => (
              <li key={i} className="rounded-[6px] border border-[#e5e7eb] bg-[#fafafa]">
                <details>
                  <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-[13px]">
                    <span className="min-w-0 flex-1 truncate">
                      <b className="text-[#888]">{i + 1}.</b> {itemLabel(f.item, item, i)}
                    </span>
                    <button type="button" className={smallBtn} disabled={i === 0} onClick={(e) => (e.preventDefault(), move(i, -1))} aria-label="Move up">↑</button>
                    <button type="button" className={smallBtn} disabled={i === items.length - 1} onClick={(e) => (e.preventDefault(), move(i, 1))} aria-label="Move down">↓</button>
                    <button type="button" className={cn(smallBtn, "text-[#a12622]")} onClick={(e) => (e.preventDefault(), set(items.filter((_, j) => j !== i)))}>Remove</button>
                  </summary>
                  <div className="border-t border-[#e5e7eb] bg-white p-3">
                    <Editor f={f.item} path={`${path}.${i}`} value={item} onChange={(v) => set(items.map((x, j) => (j === i ? v : x)))} />
                  </div>
                </details>
              </li>
            ))}
          </ol>
          <button type="button" className={cn(smallBtn, "mt-2 h-8 px-3 text-[13px]")} onClick={() => set([...items, blank(f.item)])}>
            + Add {f.item.title ? f.item.title.toLowerCase() : "item"}
          </button>
        </fieldset>
      );
    }
  }
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
  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="data" value={JSON.stringify(clean(field, value))} />
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
      <Editor f={field} path="root" value={value} onChange={setValue} />
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-[#e5e7eb] bg-white px-4 py-3">
        <button type="submit" disabled={pending} className="h-10 rounded-[8px] bg-black px-5 text-[14px] font-medium text-white disabled:opacity-60">
          {pending ? "Saving…" : isNew ? "Create" : "Save"}
        </button>
        <p aria-live="polite" className={cn("m-0 text-[14px]", state?.ok ? "text-[#1e7d3a]" : "text-[#a12622]")}>
          {state?.message}
        </p>
      </div>
      {state?.errors && (
        <ul className="m-0 list-disc pl-5 text-[13px] text-[#a12622]">
          {Object.entries(state.errors).map(([k, v]) => (
            <li key={k}>
              <code>{k}</code>: {v}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
