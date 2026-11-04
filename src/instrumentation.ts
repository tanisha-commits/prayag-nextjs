// Runs once when a server instance starts, before it handles requests.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { applyAdminBootstrap } = await import("@/lib/admin/bootstrap");
  await applyAdminBootstrap();
  const { applyContentSync, scheduleRevalidateAll } = await import("@/lib/content/startup");
  applyContentSync();
  scheduleRevalidateAll();
}
