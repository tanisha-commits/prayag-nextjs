import { ActionForm } from "@/components/admin/action-form";
import { saveCategory } from "@/lib/admin/actions";
import { adminCategories } from "@/lib/admin/data";

const input = "h-9 rounded-[6px] border border-[#d1d5db] bg-white px-2 text-[13px]";

function CategoryFields({ c, all }: { c?: Awaited<ReturnType<typeof adminCategories>>[number]; all: Awaited<ReturnType<typeof adminCategories>> }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-6">
      {c && <input type="hidden" name="id" value={c.id} />}
      <input name="name" defaultValue={c?.name} placeholder="Name" required className={input} aria-label="Name" />
      <input name="slug" defaultValue={c?.slug} placeholder="url/slug" required className={input} aria-label="URL slug" />
      <select name="parentId" defaultValue={c?.parentId ?? ""} className={input} aria-label="Parent">
        <option value="">(top level)</option>
        {all.filter((o) => o.id !== c?.id).map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
      <input name="seoTitle" defaultValue={c?.seoTitle ?? ""} placeholder="SEO title" className={input} aria-label="SEO title" />
      <input name="seoDescription" defaultValue={c?.seoDescription ?? ""} placeholder="SEO description" className={input} aria-label="SEO description" />
      <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" name="published" defaultChecked={c?.published ?? true} /> published</label>
      <textarea name="description" defaultValue={c?.description ?? ""} placeholder="Description (shown on the category page)" className="min-h-[38px] rounded-[6px] border border-[#d1d5db] p-2 text-[13px] md:col-span-6" aria-label="Description" />
    </div>
  );
}

export default async function AdminCategories() {
  const all = await adminCategories();
  const children = (id: number | null) => all.filter((c) => c.parentId === id);
  const render = (id: number | null, depth: number): React.ReactNode =>
    children(id).map((c) => (
      <li key={c.id} className="border-b border-[#e5e7eb] py-3" style={{ paddingLeft: depth * 20 }}>
        <details>
          <summary className="cursor-pointer text-[14px]">
            <b>{c.name}</b> <span className="text-[#5b5f66]">/{c.slug} · {c.productCount} product(s){c.published ? "" : " · unpublished"}</span>
          </summary>
          <div className="mt-3"><ActionForm action={saveCategory} submitLabel="Save category"><CategoryFields c={c} all={all} /></ActionForm></div>
        </details>
        <ul className="m-0 list-none p-0">{render(c.id, depth + 1)}</ul>
      </li>
    ));
  return (
    <>
      <h1 className="mb-6 text-[26px] font-semibold">Categories</h1>
      <section className="mb-8 rounded-[10px] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h2 className="mt-0 mb-3 text-[16px] font-semibold">New category</h2>
        <ActionForm action={saveCategory} submitLabel="Create category"><CategoryFields all={all} /></ActionForm>
      </section>
      <ul className="m-0 list-none rounded-[10px] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">{render(null, 0)}</ul>
    </>
  );
}
