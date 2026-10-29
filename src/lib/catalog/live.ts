import { textKey } from "./normalize";
import type { Taxonomy } from "./mapping";

/** One record of data/catalog/live-products.json (scripts/catalog/extract-live.py). */
export interface LiveProduct {
  nid: number;
  path: string;
  canonical: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  itemCode: string;
  breadcrumb: string[];
  short: string;
  colours: { name: string; hex: string }[];
  highlights: { text: string; icon: string }[];
  features: string[];
  descriptionHtml: string;
  specsHtml: string;
  sizesHtml: string;
  images: { src: string; alt: string }[];
}

/**
 * Live category listings captured with GET (crawl/membership.json): for every category landing page
 * the product paths it lists, and for every exposed filter option (a Drupal term id) the paths it
 * returns. This is Drupal's own assignment, so it is the verified "existing" mapping.
 */
export interface Membership {
  [landing: string]: { all: string[]; filters: Record<string, Record<string, string[]>> };
}

/** Landing page -> top category tid. */
export const LANDING_TID: Record<string, number> = {
  faucets: 1,
  "ptmt-taps": 2,
  ceramicware: 21,
  "kitchen-sinks": 22,
  "storage-tank": 23,
  "pipes-fittings": 25,
  "water-heaters": 134,
  "bathroom-accessories": 170,
};

/**
 * Exposed filter field -> what its term ids mean. `category`: the term is a subcategory on the site
 * (mapped to our product_category tid where Drupal used a parallel vocabulary); otherwise an
 * attribute key for filters.
 */
export const FILTER_MEANING: Record<string, { attribute?: string; category?: Record<string, number> | "vocab" }> = {
  field_products_series_target_id: { attribute: "series" },
  field_cp_design_collection_target_id: { attribute: "collection" },
  field_ptmt_series_target_id: { attribute: "series" },
  field_ptmt_collection_target_id: { attribute: "collection" },
  field_ptmt_type_target_id: { attribute: "type" },
  field_cp_color_target_id: { attribute: "colour" },
  field_kitchen_finishes_target_id: { attribute: "finish" },
  field_kitchen_design_collection_target_id: { attribute: "collection" },
  field_kitchen_ranges_target_id: { attribute: "range" },
  field_select_plumbing_category_target_id: { attribute: "plumbing type" },
  field_bathroom_accessories_type_target_id: { attribute: "accessory range" },
  // "Showers" / "Accessories" vocabulary terms = the Bathroom Accessories subcategories.
  field_bathroom_accessories_target_id_1: { category: { "166": 171, "167": 172 } },
  // Ceramicware categories have their own vocabulary; they become CeramicWare subcategories.
  field_select_ceramicware_categor_target_id: { category: "vocab" },
};

export interface LiveAssignment {
  categoryTids: number[];
  attributes: { key: string; value: string }[];
  /** Why the category could not be decided (empty when it could). */
  issues: string[];
}

/** Category + attributes Drupal assigns to each live product (by path). */
export function liveAssignments(products: LiveProduct[], membership: Membership, tax: Taxonomy): Map<string, LiveAssignment> {
  const termName = new Map<number, string>();
  for (const terms of Object.values(tax.vocabularies)) for (const t of terms) termName.set(t.tid, t.name);
  const byTid = new Map(tax.categories.map((c) => [c.tid, c]));
  const children = (tid: number) => tax.categories.filter((c) => c.parent === tid);

  const out = new Map<string, LiveAssignment>();
  const get = (path: string) => {
    let a = out.get(path);
    if (!a) out.set(path, (a = { categoryTids: [], attributes: [], issues: [] }));
    return a;
  };

  const tops = new Map<string, number[]>();
  for (const [landing, m] of Object.entries(membership)) {
    const top = LANDING_TID[landing];
    if (top === undefined) continue;
    for (const p of m.all) tops.set(p, [...(tops.get(p) ?? []), top]);
    for (const [field, options] of Object.entries(m.filters)) {
      const meaning = FILTER_MEANING[field];
      if (!meaning) continue;
      for (const [tid, paths] of Object.entries(options)) {
        for (const p of paths) {
          const a = get(p);
          if (meaning.attribute) {
            const value = termName.get(Number(tid));
            if (value && !a.attributes.some((x) => x.key === meaning.attribute && x.value === value))
              a.attributes.push({ key: meaning.attribute, value });
          } else if (meaning.category === "vocab") a.categoryTids.push(Number(tid));
          else if (meaning.category?.[tid] !== undefined) a.categoryTids.push(meaning.category[tid]);
        }
      }
    }
  }

  for (const p of products) {
    const a = get(p.path);
    const topList = [...new Set(tops.get(p.path) ?? [])];
    const leaf = p.breadcrumb.at(-1) ?? "";
    if (!a.categoryTids.length) {
      // Resolve the breadcrumb leaf inside the listing's category; fall back to a globally unique name.
      const scope = topList.length ? topList.flatMap((t) => [byTid.get(t)!, ...children(t)]) : tax.categories;
      const hits = leaf ? scope.filter((c) => textKey(c.name) === textKey(leaf)) : [];
      if (hits.length === 1) a.categoryTids.push(hits[0].tid);
      else if (topList.length === 1) a.categoryTids.push(topList[0]);
      else a.issues.push(hits.length > 1 ? `breadcrumb "${leaf}" matches ${hits.length} categories` : topList.length > 1 ? `listed under ${topList.length} categories` : leaf ? `breadcrumb "${leaf}" not in taxonomy` : "no category on the live site");
    }
    a.categoryTids = [...new Set(a.categoryTids)];
    for (const c of p.colours)
      if (!a.attributes.some((x) => x.key === "colour" && textKey(x.value) === textKey(c.name))) a.attributes.push({ key: "colour", value: c.name });
  }
  return out;
}
