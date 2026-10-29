import { ActionForm } from "@/components/admin/action-form";
import { saveProduct } from "@/lib/admin/actions";
import type { adminCategories, adminProduct } from "@/lib/admin/data";

type Product = NonNullable<Awaited<ReturnType<typeof adminProduct>>>;
type Category = Awaited<ReturnType<typeof adminCategories>>[number];

const input = "h-10 rounded-[8px] border border-[#d1d5db] bg-white px-3 text-[14px] font-normal";
const area = "min-h-[96px] rounded-[8px] border border-[#d1d5db] bg-white p-3 font-mono text-[13px] font-normal";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-[14px] font-medium">
      {label}
      {children}
      {hint && <span className="text-[12px] font-normal text-[#5b5f66]">{hint}</span>}
    </label>
  );
}

/** Create / edit form. Every save is validated, authorised and audited on the server. */
export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const byParent = (id: number | null) => categories.filter((c) => c.parentId === id);
  const selected = new Set(product?.categoryIds ?? []);
  return (
    <ActionForm action={saveProduct} submitLabel={product ? "Save changes" : "Create product"} className="gap-5">
      <input type="hidden" name="publicId" value={product?.publicId ?? ""} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Title"><input name="title" defaultValue={product?.title} required className={input} /></Field>
        <Field label="Item code"><input name="itemCode" defaultValue={product?.itemCode ?? ""} className={input} /></Field>
        <Field label="URL slug" hint="Leave empty to derive from the title. Changing it changes the public URL."><input name="slug" defaultValue={product?.slug} className={input} /></Field>
        <Field label="Status">
          <select name="status" defaultValue={product?.status ?? "draft"} className={input}>
            <option value="published">published</option>
            <option value="draft">draft</option>
            <option value="archived">archived</option>
          </select>
        </Field>
      </div>
      <fieldset className="rounded-[10px] border border-[#e5e7eb] bg-white p-4">
        <legend className="px-1 text-[14px] font-medium">Categories (the first checked is primary)</legend>
        <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-[14px] md:grid-cols-3">
          {byParent(null).map((top) => (
            <div key={top.id} className="mb-2">
              <label className="flex items-center gap-2 font-medium"><input type="checkbox" name="categoryIds" value={top.id} defaultChecked={selected.has(top.id)} /> {top.name}</label>
              {byParent(top.id).map((c) => (
                <label key={c.id} className="ml-5 flex items-center gap-2"><input type="checkbox" name="categoryIds" value={c.id} defaultChecked={selected.has(c.id)} /> {c.name}</label>
              ))}
            </div>
          ))}
        </div>
      </fieldset>
      <Field label="Short description"><textarea name="shortDescription" defaultValue={product?.shortDescription ?? ""} className={area} /></Field>
      <Field label="Description (HTML)" hint="Scripts, frames and event handlers are removed on save."><textarea name="descriptionHtml" defaultValue={product?.descriptionHtml ?? ""} className={area} /></Field>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Specifications (HTML)" hint="Only verified specifications."><textarea name="specsHtml" defaultValue={product?.specsHtml ?? ""} className={area} /></Field>
        <Field label="Available sizes (HTML)"><textarea name="sizesHtml" defaultValue={product?.sizesHtml ?? ""} className={area} /></Field>
        <Field label="Features" hint="One per line."><textarea name="features" defaultValue={product?.features.join("\n")} className={area} /></Field>
        <Field label="Highlights" hint="One per line."><textarea name="highlights" defaultValue={product?.highlights.map((h) => h.text).join("\n")} className={area} /></Field>
        <Field label="Applications" hint="One per line."><textarea name="applications" defaultValue={product?.applications.join("\n")} className={area} /></Field>
        <Field label="Filter attributes" hint="One `key: value` per line, e.g. type: Pillar Cock, colour: Chrome Finish, series: Vignette.">
          <textarea name="attributes" defaultValue={product?.attributes.map((a) => `${a.key}: ${a.value}`).join("\n")} className={area} />
        </Field>
        <Field label="Images" hint="One per line: /path/to/image.webp | alt text"><textarea name="images" defaultValue={product?.images.map((i) => `${i.src} | ${i.alt}`).join("\n")} className={area} /></Field>
        <Field label="Add-ons" hint="Item codes of add-on products, one per line."><textarea name="addons" defaultValue={product?.addons.map((r) => r.code).filter(Boolean).join("\n")} className={area} /></Field>
        <Field label="Related products" hint="Item codes, one per line (otherwise products of the same category are shown)."><textarea name="related" defaultValue={product?.related.map((r) => r.code).filter(Boolean).join("\n")} className={area} /></Field>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="SEO title"><input name="seoTitle" defaultValue={product?.seoTitle ?? ""} className={input} /></Field>
        <Field label="SEO description"><input name="seoDescription" defaultValue={product?.seoDescription ?? ""} className={input} /></Field>
      </div>
    </ActionForm>
  );
}
