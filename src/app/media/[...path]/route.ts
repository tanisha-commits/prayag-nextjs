import fs from "node:fs/promises";
import path from "node:path";
import { MEDIA_TYPES, mediaFile } from "@/lib/content/media";

export const dynamic = "force-dynamic";

/** Images uploaded in the admin (src/lib/content/media.ts). Names carry a content hash: cache forever. */
export async function GET(_request: Request, { params }: RouteContext<"/media/[...path]">) {
  const file = mediaFile((await params).path);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(await fs.readFile(/* turbopackIgnore: true */ file)), {
    headers: {
      "content-type": MEDIA_TYPES[path.extname(file)] ?? "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
    },
  });
}
