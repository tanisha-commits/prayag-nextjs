"use client";

import { ExternalLink, FilePlus2, FolderTree, History, LayoutDashboard, Menu, Newspaper, Package, PanelsTopLeft, Sparkles, Upload, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";
import { SignOutButton } from "./sign-out-button";

const NAV = [
  {
    group: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    group: "Website content",
    items: [
      { href: "/admin/content/page-content", label: "Pages", icon: PanelsTopLeft },
      { href: "/admin/content/blog", label: "Blog posts", icon: Newspaper },
      { href: "/admin/content/custom-pages", label: "Custom pages", icon: FilePlus2 },
      { href: "/admin/content", label: "Site & homepage", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    group: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/import", label: "Import", icon: Upload },
    ],
  },
  {
    group: "Tools",
    items: [
      { href: "/admin/ai", label: "AI suggestions", icon: Sparkles },
      { href: "/admin/audit", label: "Audit log", icon: History },
    ],
  },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Admin chrome: sidebar with the Prayag logo and grouped navigation, top bar with the account. */
export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  // The mobile drawer remembers the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean) => setOpenOn(v ? pathname : null);

  // Singletons (site/…, home/…, pages/…) live under /admin/content/<group>/<key>: highlight "Site & homepage".
  const contentSingleton = /^\/admin\/content\/(site|home|pages)\//.test(pathname);

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-3 border-b border-[#eef0f3] px-5 py-5">
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size brand logo */}
        <img src={withBasePath("/sites/prayag/theme/logo.png")} alt="Prayag" width={120} height={25} className="h-auto w-[120px]" />
        <span className="rounded-full bg-[#e7f1fb] px-2 py-0.5 text-[11px] font-semibold tracking-wide text-[#0b5a91] uppercase">Admin</span>
      </Link>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((g) => (
          <div key={g.group} className="mb-5">
            <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-[0.06em] text-[#8a9099] uppercase">{g.group}</p>
            <ul className="m-0 grid list-none gap-0.5 p-0">
              {g.items.map((item) => {
                const active = isActive(pathname, item.href, "exact" in item && item.exact) || (item.label === "Site & homepage" && contentSingleton);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-[8px] px-3 py-2 text-[14px] transition-colors",
                        active ? "bg-[#007ac3] font-medium text-white shadow-[0_2px_8px_rgba(0,122,195,0.25)]" : "text-[#30343a] hover:bg-[#f1f4f8]",
                      )}
                    >
                      <Icon size={18} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[#eef0f3] px-5 py-4 text-[12px] text-[#8a9099]">
        Changes are saved to the database and shown on the site immediately.
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#1a1d21]">
      {/* Sidebar: fixed on desktop, drawer on small screens */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-[#e6e9ee] bg-white lg:block">{sidebar}</aside>
      {open && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-[270px] bg-white shadow-xl transition-transform lg:hidden", open ? "translate-x-0" : "-translate-x-full")} aria-hidden={!open}>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="absolute top-4 right-3 grid size-9 place-items-center rounded-[8px] hover:bg-[#f1f4f8]">
          <X size={18} />
        </button>
        {sidebar}
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-[60px] items-center gap-3 border-b border-[#e6e9ee] bg-white/90 px-4 backdrop-blur md:px-8">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="grid size-9 place-items-center rounded-[8px] hover:bg-[#f1f4f8] lg:hidden">
            <Menu size={20} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element -- brand logo on small screens */}
          <img src={withBasePath("/sites/prayag/theme/logo.png")} alt="Prayag" width={96} height={20} className="h-auto w-[96px] lg:hidden" />
          <div className="ml-auto flex items-center gap-3 text-[13px]">
            <a href={withBasePath("/")} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1.5 rounded-[8px] border border-[#dfe3e8] px-3 py-1.5 text-[#30343a] hover:bg-[#f1f4f8] sm:flex">
              <ExternalLink size={14} aria-hidden="true" /> View site
            </a>
            <span className="hidden items-center gap-2 text-[#5b5f66] md:flex">
              <span className="grid size-7 place-items-center rounded-full bg-[#007ac3] text-[12px] font-semibold text-white uppercase">{email[0]}</span>
              {email}
            </span>
            <SignOutButton />
          </div>
        </header>
        <main className="mx-auto max-w-[1180px] px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
