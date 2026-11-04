// Write every edited content entry to a sync file. Usage: npm run content:export [-- out.json]
import fs from "node:fs";
import { exportContent } from "../../src/lib/content/store";

const out = process.argv[2] || "content-sync.json";
const file = exportContent();
fs.writeFileSync(out, JSON.stringify(file, null, 1) + "\n");
console.log(`Wrote ${file.entries.length} edited entr${file.entries.length === 1 ? "y" : "ies"} to ${out}.`);
