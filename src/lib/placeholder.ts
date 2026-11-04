import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const cache = new Map<string, Promise<string | undefined>>();

export function blurPlaceholder(src: string | undefined): Promise<string | undefined> {
  if (!src || !src.startsWith("/sites/")) return Promise.resolve(undefined);
  let hit = cache.get(src);
  if (!hit) {
    hit = (async () => {
      try {
        const { default: sharp } = await import("sharp");
        // turbopackIgnore on both: tracing this read would copy all of public/ into the build.
        const file = path.join(/* turbopackIgnore: true */ process.cwd(), "public", src);
        const buf = await sharp(await fs.readFile(/* turbopackIgnore: true */ file)).resize(40).blur(1.2).webp({ quality: 45 }).toBuffer();
        return `data:image/webp;base64,${buf.toString("base64")}`;
      } catch {
        return undefined;
      }
    })();
    cache.set(src, hit);
  }
  return hit;
}
