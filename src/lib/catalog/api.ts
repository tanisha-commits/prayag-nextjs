import type { PublicListResult } from "./public";
import { paramsFromQuery, type PublicQuery } from "./url";

/** Typed browser client for the public catalog API. */
export async function fetchCatalogList(q: PublicQuery, signal?: AbortSignal): Promise<PublicListResult> {
  const res = await fetch(`/api/catalog/products?${paramsFromQuery(q, true)}`, { signal });
  if (!res.ok) throw new Error(`Catalog request failed (${res.status})`);
  return res.json();
}
