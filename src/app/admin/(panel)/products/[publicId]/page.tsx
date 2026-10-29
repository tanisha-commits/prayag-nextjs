import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { adminCategories, adminProduct } from "@/lib/admin/data";

export default async function EditProduct({ params, searchParams }: PageProps<"/admin/products/[publicId]">) {
  const { publicId } = await params;
  const [product, categories] = await Promise.all([adminProduct(publicId), adminCategories()]);
  if (!product) notFound();
  const created = (await searchParams).created === "1";
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-[24px] font-semibold">{product.title}</h1>
        {product.status === "published" && <Link href={`/${product.slug}`} className="text-[14px] text-[#007ac3]">View on site ↗</Link>}
      </div>
      {created && <p className="mb-4 rounded-[8px] bg-[#e8f5ec] px-4 py-2 text-[14px] text-[#1e7d3a]">Product created.</p>}
      <p className="mb-5 text-[13px] text-[#5b5f66]">
        ID {product.publicId} · origin {product.origin}{product.drupalNid ? ` (Drupal node ${product.drupalNid})` : ""} · updated {product.updatedAt.toLocaleString("en-IN")}
      </p>
      <ProductForm product={product} categories={categories} />
      <h2 className="mt-10 mb-3 text-[18px] font-semibold">History</h2>
      <ul className="m-0 list-none p-0 text-[13px]">
        {product.history.map((h) => (
          <li key={h.id} className="border-b border-[#e5e7eb] py-1.5">{h.at.toLocaleString("en-IN")} — {h.actor} — {h.action}</li>
        ))}
        {product.history.length === 0 && <li className="text-[#5b5f66]">No changes recorded since import.</li>}
      </ul>
    </>
  );
}
