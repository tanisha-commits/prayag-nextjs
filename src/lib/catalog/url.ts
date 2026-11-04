import type { ListQuery } from "./queries";

export type PublicQuery = Pick<ListQuery, "category" | "filters" | "q" | "sort" | "page">;

const SORTS = new Set(["title", "title-desc", "newest", "code"]);

export function queryFromParams(params: URLSearchParams | Record<string, string | string[] | undefined>, category?: string): PublicQuery {
  const get = (k: string): string[] => {
    if (params instanceof URLSearchParams) return params.getAll(k);
    const v = params[k];
    return v === undefined ? [] : Array.isArray(v) ? v : [v];
  };
  const keys = params instanceof URLSearchParams ? [...new Set(params.keys())] : Object.keys(params);
  const filters: Record<string, string[]> = {};
  for (const k of keys)
    if (k.startsWith("f.")) {
      const values = get(k).map((v) => v.slice(0, 80)).filter(Boolean);
      if (values.length) filters[k.slice(2).slice(0, 40)] = [...new Set(values)].slice(0, 20);
    }
  const sort = get("sort")[0];
  const page = Number(get("page")[0]);
  const q = get("q")[0]?.slice(0, 100);
  return {
    category: category ?? get("category")[0],
    filters,
    q: q || undefined,
    sort: sort && SORTS.has(sort) ? (sort as PublicQuery["sort"]) : undefined,
    page: Number.isInteger(page) && page > 1 ? Math.min(page, 1000) : undefined,
  };
}

export function paramsFromQuery(q: PublicQuery, withCategory = false): URLSearchParams {
  const p = new URLSearchParams();
  if (withCategory && q.category) p.set("category", q.category);
  for (const [k, values] of Object.entries(q.filters ?? {})) for (const v of values) p.append(`f.${k}`, v);
  if (q.q) p.set("q", q.q);
  if (q.sort && q.sort !== "title") p.set("sort", q.sort);
  if (q.page && q.page > 1) p.set("page", String(q.page));
  return p;
}
