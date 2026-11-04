import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const cache = new Map<string, Promise<string | undefined>>();

/**
 * A tiny blurred preview of a local image (about 0.5 KB, data URI) to paint behind it while the real
 * file loads, so the first frames show the image's colours instead of an empty box. Undefined for
 * remote or missing images; never throws.
 */
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
