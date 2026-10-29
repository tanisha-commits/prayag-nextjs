import { clean, codeKey, splitList } from "./normalize";

/**
 * Google Sheet "prayag updated" captured as JSON (tab name -> rows; the first cell of every row is
 * the sheet's row number). Tabs `abacus` and `Images done` are excluded on purpose, and
 * `Product Bifurcation` is an unfilled template (only "Category #n / Product #n" placeholders).
 */
export const EXCLUDED_TABS = ["abacus", "images done", "product bifurcation"];

export interface SheetRecord {
  tab: string;
  row: number;
  /** "Sheet tab:row" for reports. */
  ref: string;
  code: string;
  codeKey: string;
  name: string;
  category: string;
  series: string;
  collection: string;
  type: string;
  colours: string[];
  finish: string;
  range: string;
  capacity: string;
  size: string;
  highlights: string[];
  description: string;
  features: string[];
  applications: string[];
  specs: string;
  pageTitle: string;
  remarks: string[];
}

type Field = Exclude<keyof SheetRecord, "tab" | "row" | "ref" | "codeKey">;

// Header text -> field. First match wins, so specific patterns come first.
const COLUMNS: [RegExp, Field][] = [
  [/abacusdesk|remarks/i, "remarks"],
  [/product code\/name/i, "remarks"], // Tanks: free-text note column ("Layer 31 image ...")
  [/page title/i, "pageTitle"],
  [/item code|product code/i, "code"],
  [/^name$/i, "name"],
  [/design\s*\/\s*collection/i, "collection"],
  [/series/i, "series"],
  [/categor/i, "category"],
  [/colou?r/i, "colours"],
  [/^finish$/i, "finish"],
  [/^range$/i, "range"],
  [/capacity/i, "capacity"],
  [/size/i, "size"],
  [/type$/i, "type"],
  [/highlights/i, "highlights"],
  [/description/i, "description"],
  [/features/i, "features"],
  [/applications?$/i, "applications"],
  [/specification/i, "specs"],
];

const LIST_FIELDS = new Set<Field>(["colours", "highlights", "features", "applications", "remarks"]);

function fieldFor(header: string): Field | null {
  const h = header.replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();
  return COLUMNS.find(([re]) => re.test(h))?.[1] ?? null;
}

export function parseSheet(tabs: Record<string, string[][]>): SheetRecord[] {
  const out: SheetRecord[] = [];
  for (const [tab, rows] of Object.entries(tabs)) {
    if (EXCLUDED_TABS.includes(tab.trim().toLowerCase()) || rows.length < 2) continue;
    const fields = rows[0].slice(1).map((h) => fieldFor(h));
    for (const r of rows.slice(1)) {
      const rec: SheetRecord = {
        tab, row: Number(r[0]) || 0, ref: `${tab}:${r[0]}`, code: "", codeKey: "", name: "", category: "", series: "",
        collection: "", type: "", colours: [], finish: "", range: "", capacity: "", size: "", highlights: [],
        description: "", features: [], applications: [], specs: "", pageTitle: "", remarks: [],
      };
      r.slice(1).forEach((cell, i) => {
        const f = fields[i];
        const v = clean(cell);
        if (!f || !v) return;
        if (LIST_FIELDS.has(f)) (rec[f] as string[]).push(...(f === "colours" ? splitColours(v) : f === "remarks" ? [v] : splitList(v)));
        else if (!rec[f]) (rec[f] as string) = v;
      });
      // Some tabs keep the item code in a "Name" column ("123-U", "WT-4LL-05"); others a real name ("Bromo").
      if (!rec.code && /\d/.test(rec.name)) [rec.code, rec.name] = [rec.name, ""];
      rec.codeKey = codeKey(rec.code);
      if (Object.values(rec).some((v) => (Array.isArray(v) ? v.length : v && typeof v === "string" && v !== tab && v !== rec.ref)))
        out.push(rec);
    }
  }
  return out;
}

function splitColours(v: string): string[] {
  if (/no colou?r mentioned/i.test(v)) return [];
  return v
    .replace(/^a?v[a]?ilable in\s*/i, "")
    .split(/,|\n|\/|&| and /i)
    .map((s) => s.trim())
    .filter(Boolean);
}

