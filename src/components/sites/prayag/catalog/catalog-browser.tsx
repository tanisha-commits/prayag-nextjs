"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { hydrateCatalog, loadCatalog, setFiltersOpen } from "@/lib/features/catalog-slice";
import type { PublicListResult } from "@/lib/catalog/public";
import { paramsFromQuery, type PublicQuery } from "@/lib/catalog/url";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";
import { Tx } from "@/components/sites/prayag/cms/tx-client";

const LABELS: Record<string, string> = {
  type: "Type", series: "Series", collection: "Collection", colour: "Colour", finish: "Finish", range: "Range",
  capacity: "Capacity", "plumbing type": "Plumbing type", "accessory range": "Range",
};

/**
 * Filterable product grid for one category, or for every category when `category` is omitted (site-wide
 * search, which needs a search term). Server-rendered first; later changes go through Redux.
 */
export function CatalogBrowser({ category, initialQuery, initialResult }: { category?: string; initialQuery: PublicQuery; initialResult: PublicListResult }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const state = useAppSelector((s) => s.catalog);
  const mine = state.query.category === category && state.result;
  const query = mine ? state.query : initialQuery;
  const result = mine ? state.result! : initialResult;
  const [search, setSearch] = useState(initialQuery.q ?? "");
  const searchTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    dispatch(hydrateCatalog({ query: initialQuery, result: initialResult }));
  }, [dispatch, initialQuery, initialResult]);

  const go = (next: PublicQuery) => {
    const q = { ...next, category };
    const qs = paramsFromQuery(q).toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // Site-wide search without a term: nothing to list (the API needs a category or a term).
    if (!category && !q.q) dispatch(hydrateCatalog({ query: q, result: { items: [], total: 0, facets: [], page: 1, pageSize: result.pageSize } }));
    else dispatch(loadCatalog(q));
  };
  const awaitingTerm = !category && !query.q;

  const toggle = (key: string, slug: string) => {
    const current = query.filters?.[key] ?? [];
    const values = current.includes(slug) ? current.filter((v) => v !== slug) : [...current, slug];
    go({ ...query, filters: { ...query.filters, [key]: values }, page: undefined });
  };

  const selectedCount = Object.values(query.filters ?? {}).reduce((n, v) => n + v.length, 0);
  const pages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const loading = state.status === "loading";

  const filters = (
    <div className="flex flex-col gap-6">
      {result.facets.length === 0 && <p className="text-[14px] text-[#5b5f66]"><Tx>{"No filters for this selection."}</Tx></p>}
      {result.facets.map((f) => (
        <fieldset key={f.key} className="m-0 border-0 p-0">
          <legend className="mb-2 text-[15px] font-semibold text-black">{LABELS[f.key] ?? f.key}</legend>
          <ul className="m-0 flex max-h-[260px] list-none flex-col gap-1.5 overflow-y-auto p-0 pr-1">
            {f.values.map((v) => {
              const checked = query.filters?.[f.key]?.includes(v.slug) ?? false;
              return (
                <li key={v.slug}>
                  <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-[#333]">
                    <input type="checkbox" checked={checked} onChange={() => toggle(f.key, v.slug)} className="size-4 accent-[#007ac3]" />
                    {v.hex && <span aria-hidden="true" className="size-3.5 rounded-full border border-black/20" style={{ background: v.hex }} />}
                    <span className="flex-1"><Tx>{v.value}</Tx></span>
                    <span className="text-[12px] text-[#9aa0a6]"><Tx>{v.count}</Tx></span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="hidden lg:block" aria-label="Filters">
        <Tx>{filters}</Tx>
      </aside>

      {state.filtersOpen && (
        <div className="fixed inset-0 z-[60] flex lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" aria-label="Close filters" className="flex-1 bg-black/40" onClick={() => dispatch(setFiltersOpen(false))} />
          <div className="w-[min(340px,90vw)] overflow-y-auto bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[18px] font-semibold"><Tx>{"Filters"}</Tx></span>
              <button type="button" className="text-[14px] text-[#007ac3]" onClick={() => dispatch(setFiltersOpen(false))}>
                <Tx>{"Done"}</Tx>
              </button>
            </div>
            <Tx>{filters}</Tx>
          </div>
        </div>
      )}

      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <label className="relative min-w-[200px] flex-1">
            <span className="sr-only"><Tx>{"Search products"}</Tx></span>
            <input
              type="search"
              value={search}
              autoFocus={!category}
              placeholder="Search by name or item code"
              onChange={(e) => {
                const v = e.target.value;
                setSearch(v);
                window.clearTimeout(searchTimer.current);
                searchTimer.current = window.setTimeout(() => go({ ...query, q: v.trim() || undefined, page: undefined }), 350);
              }}
              className="h-11 w-full rounded-[8px] border border-[#d1d5db] px-3.5 text-[15px] outline-none focus:border-[#007ac3]"
            />
          </label>
          <label className="flex items-center gap-2 text-[14px] text-[#333]">
            <Tx>{"Sort"}</Tx>
            <select
              value={query.sort ?? "title"}
              onChange={(e) => go({ ...query, sort: e.target.value as PublicQuery["sort"], page: undefined })}
              className="h-11 rounded-[8px] border border-[#d1d5db] bg-white px-2.5 text-[14px]"
            >
              <option value="title">Name A–Z</option>
              <option value="title-desc">Name Z–A</option>
              <option value="code">Item code</option>
              <option value="newest">Newest</option>
            </select>
          </label>
          <button type="button" className="h-11 rounded-[8px] border border-[#d1d5db] px-4 text-[14px] lg:hidden" onClick={() => dispatch(setFiltersOpen(true))}>
            <Tx>{"Filters"}</Tx>{selectedCount ? ` (${selectedCount})` : ""}
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3 text-[14px] text-[#5b5f66]" aria-live="polite">
          <span>{loading ? "Loading…" : `${result.total} product${result.total === 1 ? "" : "s"}`}</span>
          {(selectedCount > 0 || query.q) && (
            <button type="button" className="text-[#007ac3] underline" onClick={() => { setSearch(""); go({ sort: query.sort }); }}>
              <Tx>{"Clear all filters"}</Tx>
            </button>
          )}
        </div>

        {state.status === "failed" && <p role="alert" className="mb-4 rounded-[8px] bg-[#fdecea] px-4 py-3 text-[14px] text-[#a12622]"><Tx>{state.error}</Tx><Tx>{" — please try again."}</Tx></p>}

        {awaitingTerm ? (
          <p className="rounded-[10px] bg-[#f7f9fa] px-5 py-10 text-center text-[15px] text-[#5b5f66]"><Tx>{"Type a product name or item code to search all products."}</Tx></p>
        ) : result.items.length === 0 ? (
          <p className="rounded-[10px] bg-[#f7f9fa] px-5 py-10 text-center text-[15px] text-[#5b5f66]"><Tx>{"No products match these filters."}</Tx></p>
        ) : (
          <ul className={cn("m-0 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3 xl:grid-cols-4", loading && "opacity-60")}>
            {result.items.map((p) => (
              <li key={p.publicId}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}

        {pages > 1 && (
          <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2 text-[14px]">
            <button type="button" disabled={result.page <= 1} onClick={() => go({ ...query, page: result.page - 1 })} className="h-10 rounded-[8px] border border-[#d1d5db] px-4 disabled:opacity-40">
              <Tx>{"Previous"}</Tx>
            </button>
            <span className="px-2">
              <Tx>{"Page "}</Tx><Tx>{result.page}</Tx><Tx>{" of "}</Tx><Tx>{pages}</Tx>
            </span>
            <button type="button" disabled={result.page >= pages} onClick={() => go({ ...query, page: result.page + 1 })} className="h-10 rounded-[8px] border border-[#d1d5db] px-4 disabled:opacity-40">
              <Tx>{"Next"}</Tx>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
