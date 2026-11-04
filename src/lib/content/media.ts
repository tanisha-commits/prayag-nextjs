// Images uploaded in the admin (or with a Markdown blog post). Stored next to the database, outside
// the app folder, so deploys never remove them; served by src/app/media/[...path]/route.ts at
// /media/<yyyy-mm>/<name>-<hash>.webp. Plain module (scripts and the MCP server use it too).
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { mediaDir } from "./media-dir";

export { copyMissingMedia, mediaDir } from "./media-dir";

// Every runtime path below is marked turbopackIgnore: they point at the media folder next to the
// database, and letting the build trace them made it copy public/ and dist/ into the server bundle.

export const MEDIA_URL = "/media";
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
/** Uploads wider than this are scaled down (the hero is the widest image, at 1920 px). */
const MAX_WIDTH = 2000;


export const MEDIA_TYPES: Record<string, string> = { ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif", ".avif": "image/avif" };

/** Real image type from the file's first bytes (the extension and browser type are not trusted). */
function sniff(buf: Buffer): "jpeg" | "png" | "gif" | "webp" | "avif" | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.subarray(0, 6).toString("ascii") === "GIF87a" || buf.subarray(0, 6).toString("ascii") === "GIF89a") return "gif";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  if (buf.subarray(4, 12).toString("ascii").startsWith("ftypavi")) return "avif";
  return null;
}

export class MediaError extends Error {}

const slugName = (name: string) =>
  path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";

/**
 * Store an uploaded image and return its site path. JPEG/PNG/WebP/AVIF become WebP (quality 80, at
 * most 2000 px wide, metadata stripped); GIFs are kept as they are (animation). Same bytes → same path.
 */
export async function saveMedia(buf: Buffer, originalName: string): Promise<{ path: string; width?: number; height?: number; bytes: number }> {
  if (buf.length > MAX_UPLOAD_BYTES) throw new MediaError(`"${originalName}" is larger than 15 MB.`);
  const kind = sniff(buf);
  if (!kind) throw new MediaError(`"${originalName}" is not a JPEG, PNG, GIF, WebP or AVIF image.`);
  let out = buf;
  let ext = ".gif";
  let width: number | undefined;
  let height: number | undefined;
  if (kind !== "gif") {
    const { default: sharp } = await import("sharp");
    const { data, info } = await sharp(buf).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer({ resolveWithObject: true });
    out = data;
    ext = ".webp";
    width = info.width;
    height = info.height;
  }
  const month = new Date().toISOString().slice(0, 7);
  const name = `${slugName(originalName)}-${createHash("sha256").update(out).digest("hex").slice(0, 10)}${ext}`;
  const dir = path.join(/* turbopackIgnore: true */ mediaDir(), month);
  fs.mkdirSync(/* turbopackIgnore: true */ dir, { recursive: true });
  const file = path.join(/* turbopackIgnore: true */ dir, name);
  if (!fs.existsSync(/* turbopackIgnore: true */ file)) fs.writeFileSync(/* turbopackIgnore: true */ file, out);
  return { path: `${MEDIA_URL}/${month}/${name}`, width, height, bytes: out.length };
}

/** Absolute file for a /media/… request path, or null when it is not a stored image. */
export function mediaFile(parts: string[]): string | null {
  if (parts.length !== 2 || !/^\d{4}-\d{2}$/.test(parts[0]) || !/^[a-z0-9-]+\.(webp|gif)$/.test(parts[1])) return null;
  const file = path.join(/* turbopackIgnore: true */ mediaDir(), parts[0], parts[1]);
  return fs.existsSync(/* turbopackIgnore: true */ file) ? file : null;
}
