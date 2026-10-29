// Product catalog import. Usage (see docs/catalog/README.md):
//   npm run catalog:import -- seed            existing catalog: Drupal categories + live products (insert-only)
//   npm run catalog:import -- assets          point stored image paths at the local copies (idempotent)
//   npm run catalog:import -- preview         reconcile the Google Sheet; writes a report, changes nothing
//   npm run catalog:import -- apply <runId>   apply a previewed run (backup + one transaction + re-check)
import fs from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { migrateDb, openDb } from "../../src/lib/db/client";
import { importRuns } from "../../src/lib/db/schema";
import { prepareReconciliation } from "../../src/lib/admin/import-run";
import { applyChangeSet, assertMatchesPreview, localiseAssets, recordPreview, seedCategories, seedLiveProducts } from "../../src/lib/catalog/importer";
import { liveAssignments, type LiveProduct, type Membership } from "../../src/lib/catalog/live";
import type { Taxonomy } from "../../src/lib/catalog/mapping";
import { reservedSlugs } from "../../src/lib/catalog/reserved";
import { writeReport } from "../../src/lib/catalog/report";

const DATA = "data/catalog";
const read = <T,>(f: string): T => JSON.parse(fs.readFileSync(f, "utf8"));
const actor = `cli:${process.env.USER ?? "local"}`;

const taxonomyFile = "src/content/prayag/catalog/taxonomy.json";
const sheetFile = path.join(DATA, "sheet-tabs.json");

const { db, sqlite } = openDb();
migrateDb(db);
const tax = read<Taxonomy>(taxonomyFile);

function prepare() {
  const prep = prepareReconciliation(db);
  if (!prep.ok) throw new Error(prep.message);
  return prep;
}

const [cmd, arg] = process.argv.slice(2);

if (cmd === "seed") {
  const live = read<LiveProduct[]>(path.join(DATA, "live-products.json"));
  const membership = read<Membership>(path.join(DATA, "membership.json"));
  const insertedCategories = seedCategories(db, tax);
  const assign = liveAssignments(live, membership, tax);
  const r = seedLiveProducts(db, live, assign);
  console.log(`categories inserted ${insertedCategories}; live products inserted ${r.inserted}, already present ${r.existing}, uncategorised ${r.uncategorised.length}`);
  fs.mkdirSync(path.join(DATA, "reports"), { recursive: true });
  fs.writeFileSync(path.join(DATA, "reports", "seed-uncategorised.txt"), r.uncategorised.join("\n") + "\n");
} else if (cmd === "assets") {
  console.log("rows pointed at local copies:", localiseAssets(db));
} else if (cmd === "preview") {
  const { records, mappings, cs, hash } = prepare();
  const runId = recordPreview(db, cs, sheetFile, hash, actor);
  const file = writeReport(path.join(DATA, "reports"), runId, { records, mappings, cs, hash, db });
  console.log(`preview run ${runId}:`, cs.counts, "\nreport:", file);
} else if (cmd === "apply") {
  const runId = Number(arg);
  const run = db.select().from(importRuns).where(eq(importRuns.id, runId)).get();
  if (!run || run.status !== "preview") throw new Error(`run ${arg} is not an open preview`);
  const { cs, hash } = prepare();
  if (hash !== run.sourceHash) throw new Error("sources or approved mappings changed since the preview; run preview again");
  assertMatchesPreview(db, runId, cs); // exact same changes as previewed, or abort
  fs.mkdirSync("data/backups", { recursive: true });
  const backupPath = path.join("data/backups", `prayag-before-run-${runId}-${Date.now()}.db`);
  await sqlite.backup(backupPath);
  db.update(importRuns).set({ backupPath }).where(eq(importRuns.id, runId)).run();
  const result = applyChangeSet(db, cs, runId, actor, reservedSlugs(tax));
  const again = prepare().cs.counts;
  console.log("applied:", result, "| backup:", backupPath, "| re-check (must be 0/0):", { category: again.category ?? 0, new: again.new ?? 0 });
} else {
  console.log("usage: npm run catalog:import -- seed | assets | preview | apply <runId>");
  process.exitCode = 1;
}
sqlite.close();
