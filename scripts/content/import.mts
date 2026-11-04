// Merge a content export (e.g. downloaded from the live admin) into the local database. An entry is
// applied only when it is newer than the local copy. Usage: npm run content:import -- <file.json>
import fs from "node:fs";
import { importContent } from "../../src/lib/content/store";

const file = process.argv[2];
if (!file) {
  console.error("Usage: npm run content:import -- <content.json>");
  process.exit(1);
}
const r = importContent(JSON.parse(fs.readFileSync(file, "utf8")));
console.log(`Applied ${r.applied}, kept ${r.kept} newer local entr${r.kept === 1 ? "y" : "ies"}${r.skipped.length ? `, skipped invalid: ${r.skipped.join(", ")}` : ""}.`);
