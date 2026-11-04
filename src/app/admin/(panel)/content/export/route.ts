import { AuthError, requireAdmin } from "@/lib/auth/server";
import { exportContent } from "@/lib/content/store";

export const dynamic = "force-dynamic";

/** Every edited content entry as a sync file (merge it elsewhere with `npm run content:import`). */
export async function GET() {
  try {
    await requireAdmin();
  } catch (e) {
    return new Response(e instanceof AuthError && e.status === 401 ? "Please sign in." : "Forbidden", { status: e instanceof AuthError ? e.status : 403 });
  }
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
  return new Response(JSON.stringify(exportContent(), null, 1), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="prayag-content-${stamp}.json"`,
      "cache-control": "no-store",
    },
  });
}
