import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminSession } from "@/lib/auth/server";

export const metadata: Metadata = { title: { template: "%s | Prayag admin", default: "Prayag admin" }, robots: { index: false, follow: false } };

// Server-side session + role check for every admin page (the proxy only checks for a cookie).
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <AdminShell email={session.email}>{children}</AdminShell>;
}
