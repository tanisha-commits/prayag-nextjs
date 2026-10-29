import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { categoryIdByTid, categoryParents, loadCurrent } from "@/lib/catalog/importer";
import { draftMappings, type ApprovedLabel, type Taxonomy } from "@/lib/catalog/mapping";
import { reconcile } from "@/lib/catalog/reconcile";
import { parseSheet } from "@/lib/catalog/sheet";
import type { Db } from "@/lib/db/client";
import { productAttributes } from "@/lib/db/schema";

// Shared by the admin and scripts/catalog/import.mts so both compute the same change set and hash.
export const SHEET_FILE = "data/catalog/sheet-tabs.json";
export const TAXONOMY_FILE = "src/content/prayag/catalog/taxonomy.json";
export const APPROVED_FILE = "src/content/prayag/catalog/label-mappings.json";

export function prepareReconciliation(db: Db) {
  const file = (f: string) => path.join(/* turbopackIgnore: true */ process.cwd(), f);
  if (!fs.existsSync(file(SHEET_FILE))) return { ok: false as const, message: `Sheet snapshot ${SHEET_FILE} is missing (see docs/catalog/README.md).` };
  const taxonomy = JSON.parse(fs.readFileSync(file(TAXONOMY_FILE), "utf8")) as Taxonomy;
  const approved: ApprovedLabel[] = fs.existsSync(file(APPROVED_FILE)) ? JSON.parse(fs.readFileSync(file(APPROVED_FILE), "utf8")).labels : [];
  const records = parseSheet(JSON.parse(fs.readFileSync(file(SHEET_FILE), "utf8")).tabs);
  const known: Record<string, string[]> = {};
  for (const a of db.selectDistinct({ key: productAttributes.key, value: productAttributes.value }).from(productAttributes).all()) (known[a.key] ??= []).push(a.value);
  const mappings = draftMappings(records, taxonomy, approved, categoryIdByTid(db), known);
  const cs = reconcile(records, loadCurrent(db), mappings, categoryParents(db));
  const hash = createHash("sha256")
    .update(fs.readFileSync(file(SHEET_FILE)))
    .update(fs.existsSync(file(APPROVED_FILE)) ? fs.readFileSync(file(APPROVED_FILE)) : "")
    .update(fs.readFileSync(file(TAXONOMY_FILE)))
    .digest("hex");
  return { ok: true as const, records, mappings, cs, hash, taxonomy, sourceFile: SHEET_FILE };
}
