import Link from "next/link";
import type { publicCategory, PublicListResult } from "@/lib/catalog/public";
import type { PublicQuery } from "@/lib/catalog/url";
import { StoreProvider } from "@/app/store-provider";
import { CatalogBrowser } from "./catalog-browser";

type Category = NonNullable<ReturnType<typeof publicCategory>>;

export function CategoryView({ category, query, result }: { category: Category; query: PublicQuery; result: PublicListResult }) {
  return (
    <>
      <div className="bg-black py-12 text-center text-white md:py-16">
        <div className="prayag-container">
          {category.parent && (
            <Link href={`/${category.parent.slug}`} className="mb-2 inline-block text-[14px] text-white/70 hover:text-white">
              {category.parent.name}
            </Link>
          )}
          <h1 className="m-0 text-[30px] leading-[1.2] font-medium md:text-[40px]">{category.name}</h1>
          {category.description && <p className="mx-auto mt-3 max-w-[760px] text-[16px] text-white/80">{category.description}</p>}
        </div>
      </div>
      <div className="prayag-container py-10">
        {category.children.length > 0 && (
          <nav aria-label={`${category.name} categories`} className="mb-8">
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {category.children.map((c) => (
                <li key={c.id}>
                  <Link href={`/${c.slug}`} className="inline-flex h-10 items-center rounded-full border border-[#d1d5db] px-4 text-[14px] hover:border-[#007ac3] hover:text-[#007ac3]">
                    {c.name}
                    <span className="ml-2 text-[12px] text-[#9aa0a6]">{c.productCount}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {/* Redux is only needed by the filterable grid, so its provider wraps just this part. */}
        <StoreProvider>
          <CatalogBrowser category={category.slug} initialQuery={query} initialResult={result} />
        </StoreProvider>
      </div>
    </>
  );
}
