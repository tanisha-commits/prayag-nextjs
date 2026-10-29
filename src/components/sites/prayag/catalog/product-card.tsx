import Link from "next/link";

export interface ProductCardData {
  publicId: string;
  slug: string;
  title: string;
  itemCode: string | null;
  image: string | null;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-white transition-[box-shadow,border-color] duration-200 hover:border-[#d1d5db] hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]"
    >
      <div className="flex aspect-square items-center justify-center bg-[#f7f9fa] p-4">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- source product images vary in size; shown as delivered
          <img src={product.image} alt="" loading="lazy" className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : (
          <span className="text-[13px] text-[#9aa0a6]">Image coming soon</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 px-4 pt-3 pb-4">
        {product.itemCode && <span className="text-[12px] font-semibold tracking-wide text-[#007ac3] uppercase">{product.itemCode}</span>}
        <h3 className="m-0 text-[15px] leading-[1.4] font-medium text-[#1a1a1a]">{product.title}</h3>
      </div>
    </Link>
  );
}
