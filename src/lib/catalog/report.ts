import fs from "node:fs";
import path from "node:path";
import type { Db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";
import type { ChangeSet, LabelMapping } from "./reconcile";
import type { SheetRecord } from "./sheet";

/** Write the reconciliation report (Markdown for people, JSON for tools); returns the .md path. */
export function writeReport(
  dir: string,
  runId: number,
  { records, mappings, cs, hash, db }: { records: SheetRecord[]; mappings: LabelMapping[]; cs: ChangeSet; hash: string; db: Db },
) {
  fs.mkdirSync(dir, { recursive: true });
  const catName = new Map(db.select({ id: categories.id, name: categories.name, parentId: categories.parentId }).from(categories).all().map((c) => [c.id, c]));
  const catLabel = (id: number) => {
    const c = catName.get(id);
    if (!c) return `#${id}`;
    const parent = c.parentId ? catName.get(c.parentId)?.name : null;
    return parent ? `${parent} › ${c.name}` : c.name;
  };
  const cats = (ids: number[]) => (ids.length ? ids.map(catLabel).join(", ") : "—");
  const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
  const rowsPerLabel = new Map<string, number>();
  for (const r of records)
    for (const f of ["category", "series", "collection", "type"] as const)
      if (r[f]) rowsPerLabel.set(`${r.tab}|${f}|${r[f].toLowerCase()}`, (rowsPerLabel.get(`${r.tab}|${f}|${r[f].toLowerCase()}`) ?? 0) + 1);

  const by = <T extends ChangeSet["changes"][number]["action"]>(a: T) => cs.changes.filter((c) => c.action === a) as Extract<ChangeSet["changes"][number], { action: T }>[];
  const L: string[] = [];
  L.push(`# Catalog reconciliation — preview run ${runId}`, "");
  L.push(`Nothing has been written to the catalog. Source hash \`${hash.slice(0, 12)}\`.`, "");
  L.push("## Counts", "", "| | |", "|---|---|");
  const c = cs.counts;
  for (const [k, label] of [
    ["existingProducts", "Existing products (live site, in the database)"],
    ["sheetRecords", "Sheet rows read (abacus, Images done, Product Bifurcation template excluded)"],
    ["matched", "Sheet rows matched to an existing product"],
    ["category", "Mapping updates ready to apply (category / series / collection / type only)"],
    ["unchanged", "Matched, mapping already correct (nothing to change)"],
    ["new", "New products ready to add (as drafts)"],
    ["pending", "Waiting only for a label decision (see the label table)"],
    ["variant", "Colour codes already covered by an existing product (no new product)"],
    ["review", "Need your review (identity doubts / conflicts / no category)"],
    ["skip", "Skipped (no identity, or a duplicate row with the same mapping)"],
    ["untouched", "Existing products not in the sheet (kept exactly as they are)"],
  ] as const)
    L.push(`| ${label} | ${c[k] ?? 0} |`);

  L.push("", "## Label mappings (decided once per label, not per row)", "");
  L.push("`exact` = same name as an existing category/term (verified). `new-value` = a column the live site has no taxonomy for; the sheet value only fills an empty attribute. `suggested` and `unmapped` labels are **not applied** until decided in `src/content/prayag/catalog/label-mappings.json` (a `\"label\": \"*\"` entry decides a whole column).", "");
  L.push("| Tab | Column | Sheet label | Rows | Basis | Maps to | Note |", "|---|---|---|---|---|---|---|");
  for (const m of [...mappings].sort((a, b) => a.basis.localeCompare(b.basis) || a.tab.localeCompare(b.tab) || a.field.localeCompare(b.field)))
    L.push(`| ${m.tab} | ${m.field} | ${esc(m.label)} | ${rowsPerLabel.get(`${m.tab}|${m.field}|${m.label.toLowerCase()}`) ?? ""} | ${m.basis} | ${m.categoryId !== undefined ? catLabel(m.categoryId) : m.attribute ? `${m.attribute.key}: ${esc(m.attribute.value)}` : "—"} | ${esc(m.note ?? "")} |`);

  L.push("", `## Mapping updates ready to apply (${by("category").length})`, "", "Only categories and empty series/collection/type values change. Name, description, images, specs and every other field stay as they are.", "");
  L.push("| Sheet row | Code | Product | Category now | Category after | Attributes added | Still pending |", "|---|---|---|---|---|---|---|");
  for (const x of by("category"))
    L.push(`| ${x.rec.ref} | ${x.rec.code} | ${esc(x.product.title)} | ${cats(x.product.categoryIds)} | ${x.set.categoryIds ? cats(x.set.categoryIds) : "(unchanged)"} | ${(x.set.attributes ?? []).map((a) => `${a.key}: ${esc(a.value)}`).join(", ") || "—"} | ${esc(x.pending.join("; ")) || "—"} |`);

  L.push("", `## New products ready to add (${by("new").length})`, "", "Added as **draft** (not public) with the sheet's own fields; publish from the admin after checking.", "");
  L.push("| Sheet row | Code | Category | Fields provided |", "|---|---|---|---|");
  for (const x of by("new"))
    L.push(`| ${x.rec.ref} | ${x.rec.code} | ${cats(x.categoryIds)} | ${["description", "features", "highlights", "colours", "applications", "specs", "size", "capacity"].filter((f) => { const v = x.rec[f as keyof SheetRecord]; return Array.isArray(v) ? v.length : v; }).join(", ") || "code only"} |`);

  const review = by("review");
  L.push("", `## Needs your review (${review.length})`, "");
  const groups = new Map<string, typeof review>();
  for (const r of review) {
    const g = r.reasons[0].replace(/"[^"]*"/g, "…").replace(/\d+ existing/, "n existing");
    groups.set(g, [...(groups.get(g) ?? []), r]);
  }
  for (const [g, list] of [...groups].sort((a, b) => b[1].length - a[1].length)) {
    L.push(`### ${esc(g)} — ${list.length}`, "", "| Sheet row | Code | Existing product(s) | Reasons |", "|---|---|---|---|");
    for (const r of list)
      L.push(`| ${r.rec.ref} | ${r.rec.code || esc(r.rec.name)} | ${esc(r.product?.title ?? r.candidates?.map((p) => p.title).join(" / ") ?? "—")} | ${esc(r.reasons.join("; "))} |`);
    L.push("");
  }

  const pendingRows = by("pending");
  const pendingBy = new Map<string, number>();
  for (const x of pendingRows) for (const p of x.pending) pendingBy.set(`${x.rec.tab}: ${p.replace(/ \(suggested.*\)$/, "")}`, (pendingBy.get(`${x.rec.tab}: ${p.replace(/ \(suggested.*\)$/, "")}`) ?? 0) + 1);
  L.push(`## Waiting for label decisions (${pendingRows.length} rows)`, "", "These rows change nothing until the labels below are decided. Most frequent labels:", "");
  for (const [k, n] of [...pendingBy].sort((a, b) => b[1] - a[1]).slice(0, 40)) L.push(`- ${esc(k)} — ${n} row(s)`);
  L.push("");

  const held = by("review").filter((r) => r.reasons[0].startsWith("held: the sheet gives no product name"));
  L.push(`## Held — product names missing (${held.length})`, "", "Not imported: the sheet gives only a code. Codes and highlights are kept here for naming.", "", "| Sheet row | Code | Highlights |", "|---|---|---|");
  for (const h of held) L.push(`| ${h.rec.ref} | ${h.rec.code} | ${esc(h.rec.highlights.join("; ")) || "—"} |`);
  L.push("");

  const skippedMaps = mappings.filter((m) => m.basis === "skipped");
  L.push(`## Skipped by decision (${skippedMaps.length} labels)`, "", "Ignored on purpose (live values kept); listed for later review.", "", "| Tab | Column | Sheet value | Rows |", "|---|---|---|---|");
  for (const m of skippedMaps) L.push(`| ${m.tab} | ${m.field} | ${esc(m.label)} | ${rowsPerLabel.get(`${m.tab}|${m.field}|${m.label.toLowerCase()}`) ?? ""} |`);
  L.push("");

  const normalised = mappings.filter((m) => m.basis === "approved" && m.attribute && m.attribute.value !== m.label);
  L.push(`## Normalised values (${normalised.length})`, "", "Sheet spelling -> value that will be stored (audit of every normalisation).", "", "| Tab | Column | Sheet value | Stored as | Rows |", "|---|---|---|---|---|");
  for (const m of normalised) L.push(`| ${m.tab} | ${m.field} | ${esc(m.label)} | ${esc(m.attribute!.value)} | ${rowsPerLabel.get(`${m.tab}|${m.field}|${m.label.toLowerCase()}`) ?? ""} |`);
  L.push("");

  L.push(`## Colour codes covered by existing products (${by("variant").length})`, "", "| Sheet row | Code | Existing product | Why |", "|---|---|---|---|");
  for (const v of by("variant")) L.push(`| ${v.rec.ref} | ${v.rec.code} | ${esc(v.product.title)} | ${esc(v.reasons.join("; "))} |`);
  L.push("");

  L.push(`## Skipped (${by("skip").length})`, "", "| Sheet row | Reason |", "|---|---|");
  for (const s of by("skip")) L.push(`| ${s.rec.ref} | ${esc(s.reasons.join("; "))} |`);

  const diffCounts = new Map<string, number>();
  for (const x of [...by("category"), ...by("unchanged")]) for (const d of x.contentDiffs) diffCounts.set(d, (diffCounts.get(d) ?? 0) + 1);
  L.push("", "## Sheet content for existing products (reported, not applied)", "", "Existing names, descriptions and other content are preserved. Matched rows that also carry sheet content:", "");
  for (const [d, n] of diffCounts) L.push(`- ${d}: ${n}`);

  L.push("", `## Existing products not in the sheet (${cs.untouched.length})`, "", "Kept exactly as they are (this includes categories with incomplete sheet data).", "");
  const untouchedBy = new Map<string, number>();
  for (const p of cs.untouched) untouchedBy.set(cats(p.categoryIds.slice(0, 1)), (untouchedBy.get(cats(p.categoryIds.slice(0, 1))) ?? 0) + 1);
  for (const [k, n] of [...untouchedBy].sort((a, b) => b[1] - a[1])) L.push(`- ${k}: ${n}`);

  const md = path.join(dir, `run-${runId}-preview.md`);
  fs.writeFileSync(md, L.join("\n") + "\n");
  fs.writeFileSync(
    path.join(dir, `run-${runId}-preview.json`),
    JSON.stringify(
      { runId, hash, counts: cs.counts, mappings, changes: cs.changes.map((x) => ({ ...x, rec: { ref: x.rec.ref, code: x.rec.code, name: x.rec.name } })) },
      null,
      1,
    ),
  );
  return md;
}
