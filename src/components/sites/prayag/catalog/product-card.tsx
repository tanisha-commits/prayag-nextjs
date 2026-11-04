import Link from "next/link";
import { withBasePath } from "@/lib/base-path";

export interface ProductCardData {
  publicId: string;
  slug: string;
  title: string;
  itemCode: string | null;
  image: string | null;
  status?: string;
  attributes?: { key: string; value: string; hex: string | null }[];
}

const DETAIL_LABELS: [key: string, label: string][] = [
  ["type", "Type"], ["collection", "Collection"], ["series", "Series"], ["range", "Range"], ["finish", "Finish"], ["capacity", "Capacity"],
];
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function cardDetails(product: ProductCardData) {
  const attrs = (product.attributes ?? []).filter((a) => a.value.trim());
  const details = DETAIL_LABELS.flatMap(([key, label]) => {
    const values = [...new Set(attrs.filter((a) => a.key === key).map((a) => a.value.trim()))];
    if (!values.length || (key === "type" && values.every((v) => norm(product.title).includes(norm(v))))) return [];
    return [{ key, label, text: values.join(", ") }];
  });
  return { details, colours: attrs.filter((a) => a.key === "colour") };
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const { details, colours } = cardDetails(product);
  const colourNames = colours.map((c) => c.value.trim()).join(", ");
  return (
    <Link
      href={`/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-white transition-[box-shadow,border-color] duration-200 hover:border-[#d1d5db] hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]"
    >
      <div className="flex aspect-square items-center justify-center bg-[#f7f9fa] p-4">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- source product images vary in size; shown as delivered
          <img src={withBasePath(product.image)} alt="" loading="lazy" className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : (
          <span className="text-[13px] text-[#9aa0a6]">Image coming soon</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 px-4 pt-3 pb-4">
        {product.status && product.status !== "published" && (
          <span className="self-start rounded-full bg-[#fff4e5] px-2 py-0.5 text-[11px] font-semibold text-[#b45309] uppercase">Draft — local preview</span>
        )}
        {product.itemCode && <span className="text-[12px] font-semibold tracking-wide text-[#007ac3] uppercase">{product.itemCode}</span>}
        <h3 className="m-0 text-[15px] leading-[1.4] font-medium text-[#1a1a1a]">{product.title}</h3>
        {details.length > 0 && (
          <dl className="m-0 mt-1 flex flex-col gap-0.5 text-[13px] leading-[1.45] text-[#5b5f66]">
            {details.map((d) => (
              <div key={d.key} className="flex min-w-0 gap-1">
                <dt className="shrink-0 text-[#9aa0a6]">{d.label}</dt>
                <dd className="m-0 min-w-0 truncate" title={d.text}>{d.text}</dd>
              </div>
            ))}
          </dl>
        )}
        {colours.length > 0 && (
          <div className="mt-auto flex flex-col gap-1 pt-2">
            {colours.some((c) => c.hex) && (
              <div aria-hidden="true" className="flex flex-wrap gap-1.5">
                {colours.map((c) => (c.hex ? <span key={c.value} title={c.value} className="size-[18px] rounded-full border border-black/20" style={{ background: c.hex }} /> : null))}
              </div>
            )}
            <span className="text-[13px] leading-[1.45] text-[#5b5f66]">{colourNames}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
