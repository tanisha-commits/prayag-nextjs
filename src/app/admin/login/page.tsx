import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { withBasePath } from "@/lib/base-path";
import { getAdminSession } from "@/lib/auth/server";

export const metadata: Metadata = { title: { absolute: "Admin sign in | Prayag" }, robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  if (await getAdminSession()) redirect("/admin");
  const next = (await searchParams).next;
  const target = typeof next === "string" && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_10%,#e6f2fb_0,#f4f6f9_45%)] px-4">
      <div className="w-full max-w-[420px] rounded-[16px] border border-[#e6e9ee] bg-white p-8 shadow-[0_12px_40px_rgba(15,40,70,0.08)]">
        {/* eslint-disable-next-line @next/next/no-img-element -- brand logo */}
        <img src={withBasePath("/sites/prayag/theme/logo.png")} alt="Prayag" width={140} height={29} className="mb-6 h-auto w-[140px]" />
        <h1 className="mb-1 text-[22px] font-semibold">Admin sign in</h1>
        <p className="mb-6 text-[14px] text-[#5b5f66]">Manage the website content and product catalog.</p>
        <LoginForm next={target} />
      </div>
    </main>
  );
}
