// Turns a content zod schema into a plain field tree (for the admin form) and walks data alongside
// a schema (to sanitize HTML fields). Plain module, no server-only.
import { z } from "zod";
import type { Widget } from "./schemas";

export type Field =
  | { kind: "string"; name: string; title: string; description?: string; widget: Widget; optional: boolean; nullable: boolean }
  | { kind: "number"; name: string; title: string; description?: string; optional: boolean; integer: boolean }
  | { kind: "boolean"; name: string; title: string; description?: string; optional: boolean }
  | { kind: "choice"; name: string; title: string; description?: string; optional: boolean; options: (string | number)[] }
  | { kind: "object"; name: string; title: string; description?: string; optional: boolean; fields: Field[] }
  | { kind: "list"; name: string; title: string; description?: string; optional: boolean; item: Field };

type Meta = { title?: string; description?: string; widget?: Widget };
type Def = { type: string; innerType?: z.ZodType; shape?: Record<string, z.ZodType>; element?: z.ZodType; options?: z.ZodType[]; values?: unknown[]; checks?: { _zod: { def: { check: string; format?: string } } }[] };

const def = (s: z.ZodType) => (s as unknown as { _zod: { def: Def } })._zod.def;
const meta = (s: z.ZodType): Meta => (z.globalRegistry.get(s) as Meta | undefined) ?? {};
const humanize = (name: string) => name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());

/** Strip optional/nullable/default wrappers, keeping the first metadata found. */
function unwrap(schema: z.ZodType) {
  let s = schema;
  let m = meta(s);
  let optional = false;
  let nullable = false;
  for (;;) {
    const d = def(s);
    if (d.type === "optional" || d.type === "default") optional = true;
    else if (d.type === "nullable") nullable = true;
    else break;
    s = d.innerType!;
    m = { ...meta(s), ...m };
  }
  return { s, m: { ...meta(s), ...m }, optional, nullable };
}

export function describe(schema: z.ZodType, name = ""): Field {
  const { s, m, optional, nullable } = unwrap(schema);
  const d = def(s);
  const base = { name, title: m.title ?? humanize(name), description: m.description, optional };
  switch (d.type) {
    case "string":
      return { kind: "string", ...base, widget: m.widget ?? "text", nullable };
    case "number":
      return { kind: "number", ...base, integer: !!d.checks?.some((c) => c._zod.def.format === "safeint" || c._zod.def.check === "number_format") };
    case "boolean":
      return { kind: "boolean", ...base };
    case "union":
      return { kind: "choice", ...base, options: (d.options ?? []).flatMap((o) => (def(o).values ?? []) as (string | number)[]) };
    case "object":
      return { kind: "object", ...base, fields: Object.entries(d.shape ?? {}).map(([k, v]) => describe(v, k)) };
    case "array":
      return { kind: "list", ...base, item: describe(d.element!, "") };
    default:
      throw new Error(`content field "${name}": unsupported schema type ${d.type}`);
  }
}

/** Apply `fn` to every string value whose schema widget is "html". */
export function mapHtml(schema: z.ZodType, value: unknown, fn: (html: string) => string): unknown {
  const { s, m } = unwrap(schema);
  const d = def(s);
  if (value === null || value === undefined) return value;
  if (d.type === "string") return m.widget === "html" && typeof value === "string" ? fn(value) : value;
  if (d.type === "array" && Array.isArray(value)) return value.map((v) => mapHtml(d.element!, v, fn));
  if (d.type === "object" && typeof value === "object") {
    const out: Record<string, unknown> = { ...(value as Record<string, unknown>) };
    for (const [k, v] of Object.entries(d.shape ?? {})) if (k in out) out[k] = mapHtml(v, out[k], fn);
    return out;
  }
  return value;
}

/**
 * Strip active content from editable HTML (scripts, frames, styles, inline handlers,
 * javascript:/data: links). Same rules as the catalog sanitizer, but entities such as &nbsp; are
 * kept so edited text keeps its line breaking.
 */
export function sanitizeContentHtml(html: string): string {
  return html
    .replace(/<\s*(script|style|iframe|object|embed|form|link|meta|base)\b[\s\S]*?(<\s*\/\s*\1\s*>|$)/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|form|link|meta|base)\b[^>]*\/?>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src|xlink:href|action|formaction)\s*=\s*("|')\s*(javascript|data|vbscript):[^"']*\2/gi, ' $1="#"')
    .replace(/\s(href|src|xlink:href)\s*=\s*(javascript|data|vbscript):[^\s>]*/gi, ' $1="#"');
}
