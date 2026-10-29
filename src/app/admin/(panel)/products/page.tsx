import Link from "next/link";
import { ActionForm } from "@/components/admin/action-form";
import { setProductStatus } from "@/lib/admin/actions";
import { adminCategories, adminProducts } from "@/lib/admin/data";

const STATUSES = ["published", "draft", "archived"] as const;

export default async function AdminProducts({ searchParams }: PageProps<"/admin/products">) {
  const sp = await searchParams;
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const status = STATUSES.find((s) => s === one("status"));
  const page = Math.max(1, Number(one("page")) || 1);
  const [list, cats] = await Promise.all([
    adminProducts({ q: one("q"), category: one("category") || undefined, status, uncategorised: one("uncategorised") === "1", page, sort: "title" }),
    adminCategories(),
  ]);
  const pages = Math.max(1, Math.ceil(list.total / list.pageSize));
  const qs = (p: number) => {
    const u = new URLSearchParams(Object.entries(sp).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])));
    u.set("page", String(p));
    return `?${u}`;
  };
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-[26px] font-semibold">Products</h1>
        <Link href="/admin/products/new" className="h-10 rounded-[8px] bg-black px-4 text-[14px] leading-10 text-white">New product</Link>
      </div>
      <form className="mb-5 flex flex-wrap gap-3 text-[14px]">
        <input name="q" defaultValue={one("q")} placeholder="Search title or item code" className="h-10 min-w-[220px] flex-1 rounded-[8px] border border-[#d1d5db] bg-white px-3" />
        <select name="category" defaultValue={one("category") ?? ""} className="h-10 rounded-[8px] border border-[#d1d5db] bg-white px-2">
          <option value="">All categories</option>
          {cats.map((c) => (
            <option key={c.id} value={c.slug}>{c.parentId ? "— " : ""}{c.name}</option>
          ))}
        </select>
        <select name="status" defaultValue={status ?? ""} className="h-10 rounded-[8px] border border-[#d1d5db] bg-white px-2">
          <option value="">Any status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="uncategorised" value="1" defaultChecked={one("uncategorised") === "1"} /> No category
        </label>
        <button className="h-10 rounded-[8px] border border-[#d1d5db] bg-white px-4">Filter</button>
      </form>

      <ActionForm action={setProductStatus} submitLabel="Apply to selected" className="rounded-[10px] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex flex-wrap items-center gap-3 text-[14px]">
          <span>{list.total} product(s). Set selected to</span>
          <select name="status" className="h-9 rounded-[8px] border border-[#d1d5db] px-2">
            <option value="published">published</option>
            <option value="draft">draft (unpublish)</option>
            <option value="archived">archived</option>
          </select>
          <label className="flex items-center gap-2 text-[13px] text-[#5b5f66]">
            <input type="checkbox" name="confirm" value="yes" /> confirm (required for archive)
          </label>
        </div>
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-left text-[#5b5f66]">
              <th className="w-8 py-2" />
              <th className="py-2">Item code</th>
              <th className="py-2">Title</th>
              <th className="py-2">Status</th>
              <th className="py-2">URL</th>
            </tr>
          </thead>
          <tbody>
            {list.items.map((p) => (
              <tr key={p.publicId} className="border-b border-[#f0f0f0]">
                <td className="py-2"><input type="checkbox" name="publicId" value={p.publicId} aria-label={`Select ${p.title}`} /></td>
                <td className="py-2">{p.itemCode ?? "—"}</td>
                <td className="py-2"><Link href={`/admin/products/${p.publicId}`} className="text-[#007ac3] hover:underline">{p.title}</Link></td>
                <td className="py-2">{p.status}</td>
                <td className="py-2 text-[#5b5f66]">/{p.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ActionForm>
      {pages > 1 && (
        <nav className="mt-4 flex gap-3 text-[14px]" aria-label="Pagination">
          {page > 1 && <Link href={qs(page - 1)}>Previous</Link>}
          <span>Page {page} of {pages}</span>
          {page < pages && <Link href={qs(page + 1)}>Next</Link>}
        </nav>
      )}
    </>
  );
}
