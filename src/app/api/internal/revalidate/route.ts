import { revalidatePath } from "next/cache";
import { revalidateSecretMatches } from "@/lib/content/startup";

export const dynamic = "force-dynamic";

/** Server-internal: re-render every page from the database (called once at start-up). */
export async function POST(request: Request) {
  if (!revalidateSecretMatches(request.headers.get("x-prayag-revalidate"))) return new Response("Not found", { status: 404 });
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
