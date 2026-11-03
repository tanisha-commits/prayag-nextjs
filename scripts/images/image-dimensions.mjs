// Records the natural width/height of every raster image under public/sites/prayag into
// src/lib/image-dimensions.generated.json ({ "/sites/prayag/...": [width, height] }).
// The site uses it (server-side only) to give <img> elements width/height attributes and to build
// srcset candidates through the image optimizer. Runs automatically before `npm run build`; run it by
// hand (`node scripts/images/image-dimensions.mjs`) after adding images if you use `next dev`.
// Read-only on the images themselves.
import { readdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp"); // ships with Next.js (its image optimizer dependency)

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const publicDir = path.join(root, "public");
const startDir = path.join(publicDir, "sites/prayag");
const out = path.join(root, "src/lib/image-dimensions.generated.json");

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(webp|png|jpe?g)$/i.test(entry.name)) files.push(full);
  }
})(startDir);
files.sort();

const dims = {};
let failed = 0;
for (const file of files) {
  try {
    const meta = await sharp(file).metadata();
    // EXIF-rotated JPEGs display with swapped axes.
    const rotated = (meta.orientation ?? 1) >= 5;
    const width = rotated ? meta.height : meta.width;
    const height = rotated ? meta.width : meta.height;
    if (width && height) dims["/" + path.relative(publicDir, file).split(path.sep).join("/")] = [width, height];
  } catch {
    failed++;
  }
}

const json = JSON.stringify(dims, null, 0).replace(/\],"/g, '],\n"') + "\n";
if (!existsSync(out) || readFileSync(out, "utf8") !== json) writeFileSync(out, json);
console.log(`image-dimensions: ${Object.keys(dims).length} images${failed ? `, ${failed} unreadable` : ""} -> ${path.relative(root, out)}`);
