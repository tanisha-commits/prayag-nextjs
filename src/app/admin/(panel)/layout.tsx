import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { getAdminSession } from "@/lib/auth/server";

export const metadata: Metadata = { title: { template: "%s | Prayag admin", default: "Prayag admin" }, robots: { index: false, follow: false } };

const NAV = [
  ["/admin", "Dashboard"],
  ["/admin/products", "Products"],
  ["/admin/categories", "Categories"],
  ["/admin/content", "Content"],
  ["/admin/import", "Import"],
  ["/admin/ai", "AI suggestions"],
  ["/admin/audit", "Audit log"],
] as const;

// Server-side session + role check for every admin page (the proxy only checks for a cookie).
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#1a1a1a]">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[#e5e7eb] bg-white px-5 py-3">
        <Link href="/admin" className="text-[16px] font-semibold">Prayag admin</Link>
        <nav className="flex flex-wrap gap-4 text-[14px]">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} className="text-[#333] hover:text-[#007ac3]">{label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-[13px] text-[#5b5f66]">
          {session.email}
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto max-w-[1280px] px-5 py-8">{children}</main>
    </div>
  );
}
