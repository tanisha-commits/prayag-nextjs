import type { PublicListResult } from "./public";
import { paramsFromQuery, type PublicQuery } from "./url";

import { withBasePath } from "@/lib/base-path";
export async function fetchCatalogList(q: PublicQuery, signal?: AbortSignal): Promise<PublicListResult> {
  const res = await fetch(withBasePath(`/api/catalog/products?${paramsFromQuery(q, true)}`), { signal });
  if (!res.ok) throw new Error(`Catalog request failed (${res.status})`);
  return res.json();
}
