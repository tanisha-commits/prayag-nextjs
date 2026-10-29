import Link from "next/link";
import { adminDashboard } from "@/lib/admin/data";

export default async function AdminDashboard() {
  const d = await adminDashboard();
  const n = (s: string) => d.byStatus.find((x) => x.status === s)?.n ?? 0;
  const cards: [string, number | string, string][] = [
    ["Published products", n("published"), "/admin/products?status=published"],
    ["Draft products", n("draft"), "/admin/products?status=draft"],
    ["Archived products", n("archived"), "/admin/products?status=archived"],
    ["Without a category", d.uncategorised, "/admin/products?uncategorised=1"],
    ["Categories", d.categories, "/admin/categories"],
    ["AI suggestions waiting", d.pendingAi, "/admin/ai"],
  ];
  return (
    <>
      <h1 className="mb-6 text-[26px] font-semibold">Dashboard</h1>
      <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3">
        {cards.map(([label, value, href]) => (
          <li key={label}>
            <Link href={href} className="block rounded-[10px] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
              <span className="block text-[28px] font-semibold">{value}</span>
              <span className="text-[14px] text-[#5b5f66]">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mt-10 mb-3 text-[18px] font-semibold">Recent imports</h2>
      {d.runs.length === 0 ? (
        <p className="text-[14px] text-[#5b5f66]">No imports yet.</p>
      ) : (
        <ul className="m-0 list-none p-0 text-[14px]">
          {d.runs.map((r) => (
            <li key={r.id} className="border-b border-[#e5e7eb] py-2">
              Run {r.id} — {r.status} — {r.createdAt.toLocaleString("en-IN")} — {Object.entries(r.summary).map(([k, v]) => `${k} ${v}`).join(", ")}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
