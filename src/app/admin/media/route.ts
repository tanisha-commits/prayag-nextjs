import { AuthError, requireAdmin } from "@/lib/auth/server";
import { MAX_UPLOAD_BYTES, MediaError, saveMedia } from "@/lib/content/media";

export const dynamic = "force-dynamic";

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Admin image upload (multipart field "file"). Responds { path, width, height, bytes }. */
export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch (e) {
    return Response.json({ error: "Please sign in again." }, { status: e instanceof AuthError ? e.status : 403 });
  }
  if (!sameOrigin(request)) return Response.json({ error: "Upload refused (different origin)." }, { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > MAX_UPLOAD_BYTES + 64 * 1024) return Response.json({ error: "The file is larger than 15 MB." }, { status: 413 });
  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file received." }, { status: 400 });
  try {
    return Response.json(await saveMedia(Buffer.from(await file.arrayBuffer()), file.name));
  } catch (e) {
    if (e instanceof MediaError) return Response.json({ error: e.message }, { status: 400 });
    console.error("[media] upload failed", e);
    return Response.json({ error: "Could not store the image." }, { status: 500 });
  }
}
