import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/lib/auth/server";

export const metadata: Metadata = { title: { absolute: "Admin sign in | Prayag" }, robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  if (await getAdminSession()) redirect("/admin");
  const next = (await searchParams).next;
  const target = typeof next === "string" && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f5f7] px-4">
      <div className="w-full max-w-[400px] rounded-[12px] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <h1 className="mb-1 text-[22px] font-semibold">Prayag catalog admin</h1>
        <p className="mb-6 text-[14px] text-[#5b5f66]">Sign in with your admin account.</p>
        <LoginForm next={target} />
      </div>
    </main>
  );
}
