import { FilePlus2, Newspaper, Package, PanelsTopLeft, Upload } from "lucide-react";
import Link from "next/link";
import { adminDashboard } from "@/lib/admin/data";
import { SITE_PAGES } from "@/lib/content/page-registry";
import { readList } from "@/lib/content/store";

const card = "rounded-[12px] border border-[#e6e9ee] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]";

export default async function AdminDashboard() {
  const d = await adminDashboard();
  const n = (s: string) => d.byStatus.find((x) => x.status === s)?.n ?? 0;
  const pageEdits = readList("page-content");
  const posts = readList("blog");
  const custom = readList("custom-pages");
  const stats: [string, number | string, string][] = [
    ["Published products", n("published"), "/admin/products?status=published"],
    ["Draft products", n("draft"), "/admin/products?status=draft"],
    ["Without a category", d.uncategorised, "/admin/products?uncategorised=1"],
    ["Blog posts", posts.length, "/admin/content/blog"],
    ["Pages with edits", `${pageEdits.length} / ${SITE_PAGES.length}`, "/admin/content/page-content"],
    ["AI suggestions waiting", d.pendingAi, "/admin/ai"],
  ];
  const actions = [
    { href: "/admin/content/page-content", label: "Edit a page", hint: "Texts, .md sections, SEO", icon: PanelsTopLeft },
    { href: "/admin/content/blog/new", label: "Write a blog post", hint: "Or import .md files", icon: Newspaper },
    { href: "/admin/content/custom-pages/new", label: "Create a page", hint: `${custom.length} custom page(s)`, icon: FilePlus2 },
    { href: "/admin/products/new", label: "Add a product", hint: `${n("published")} published`, icon: Package },
    { href: "/admin/import", label: "Import catalog", hint: "From the source sheet", icon: Upload },
  ];
  return (
    <>
      <div className="mb-6">
        <h1 className="m-0 text-[26px] font-semibold">Dashboard</h1>
        <p className="mt-1 mb-0 text-[14px] text-[#5b5f66]">Overview of the Prayag website and catalog.</p>
      </div>

      <h2 className="mb-3 text-[13px] font-semibold tracking-[0.05em] text-[#8a9099] uppercase">Quick actions</h2>
      <ul className="m-0 mb-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 xl:grid-cols-5">
        {actions.map(({ href, label, hint, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className={`${card} group flex h-full items-start gap-3 p-4 transition-shadow hover:shadow-[0_6px_18px_rgba(16,24,40,0.08)]`}>
              <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-[#e7f1fb] text-[#007ac3] group-hover:bg-[#007ac3] group-hover:text-white">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0 leading-5">
                <span className="block text-[14px] font-semibold">{label}</span>
                <span className="block text-[12px] text-[#6b7280]">{hint}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mb-3 text-[13px] font-semibold tracking-[0.05em] text-[#8a9099] uppercase">At a glance</h2>
      <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-3">
        {stats.map(([label, value, href]) => (
          <li key={label}>
            <Link href={href} className={`${card} block p-5 transition-shadow hover:shadow-[0_6px_18px_rgba(16,24,40,0.08)]`}>
              <span className="block text-[28px] leading-9 font-semibold">{value}</span>
              <span className="text-[13px] text-[#5b5f66]">{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 mb-3 text-[13px] font-semibold tracking-[0.05em] text-[#8a9099] uppercase">Recent catalog imports</h2>
      <div className={card}>
        {d.runs.length === 0 ? (
          <p className="m-0 p-4 text-[14px] text-[#5b5f66]">No imports yet.</p>
        ) : (
          <ul className="m-0 list-none p-0 text-[14px]">
            {d.runs.map((r) => (
              <li key={r.id} className="flex flex-wrap gap-x-3 border-b border-[#f0f1f3] px-4 py-2.5 last:border-0">
                <b>Run {r.id}</b>
                <span className="text-[#5b5f66]">{r.status}</span>
                <span className="text-[#5b5f66]">{r.createdAt.toLocaleString("en-IN")}</span>
                <span className="text-[#8a9099]">{Object.entries(r.summary).map(([k, v]) => `${k} ${v}`).join(", ")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
