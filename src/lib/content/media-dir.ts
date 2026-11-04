// Where uploaded images live, and the deploy copy step. Kept apart from media.ts (which loads sharp)
// so the server start-up code can use it without the build tracing image files into the bundle.
import fs from "node:fs";
import path from "node:path";
import { dbPath } from "@/lib/db/client";

export function mediaDir(): string {
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.PRAYAG_MEDIA_DIR || path.join(path.dirname(dbPath), "media"));
}

/** Copy images that exist in `from` but not in `to` (deploy media sync). Returns the count copied. */
export function copyMissingMedia(from: string, to: string): number {
  if (!fs.existsSync(/* turbopackIgnore: true */ from)) return 0;
  let n = 0;
  for (const month of fs.readdirSync(/* turbopackIgnore: true */ from)) {
    if (!/^\d{4}-\d{2}$/.test(month)) continue;
    for (const name of fs.readdirSync(/* turbopackIgnore: true */ path.join(from, month))) {
      const target = path.join(/* turbopackIgnore: true */ to, month, name);
      if (fs.existsSync(/* turbopackIgnore: true */ target)) continue;
      fs.mkdirSync(/* turbopackIgnore: true */ path.dirname(target), { recursive: true });
      fs.copyFileSync(/* turbopackIgnore: true */ path.join(from, month, name), target);
      n++;
    }
  }
  return n;
}
