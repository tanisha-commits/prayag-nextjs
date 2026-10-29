import { migrateDb, openDb } from "@/lib/db/client";
import type { Taxonomy } from "@/lib/catalog/mapping";
import type { SheetRecord } from "@/lib/catalog/sheet";
import { codeKey } from "@/lib/catalog/normalize";

export function memoryDb() {
  const { db, sqlite } = openDb(":memory:");
  migrateDb(db);
  return { db, sqlite };
}

/** Small taxonomy shaped like the real one (tids from Drupal). */
export const taxonomy: Taxonomy = {
  categories: [
    { tid: 1, name: "CP Faucets", parent: null, slug: "faucets", published: true },
    { tid: 2, name: "PTMT", parent: null, slug: "ptmt-taps", published: true },
    { tid: 163, name: "Shower", parent: 2, slug: "ptmt-taps/shower", published: true },
    { tid: 164, name: "Accessories", parent: 2, slug: "ptmt-taps/accessories", published: true },
    { tid: 170, name: "Bathroom Accessories", parent: null, slug: "bathroom-accessories", published: true },
    { tid: 172, name: "Accessories", parent: 170, slug: "bathroom-accessories/accessories", published: true },
    { tid: 24, name: "Hardware", parent: null, slug: "hardware", published: true },
  ],
  vocabularies: {
    series: [{ tid: 5, name: "Vignette", parent: null }],
    design_collection: [{ tid: 8, name: "Lagoon", parent: null }],
    cp_type: [{ tid: 12, name: "Sink Mixer", parent: null }],
    ptmt_: [{ tid: 80, name: "Standard Series", parent: null }],
    ptmt_type: [{ tid: 85, name: "Bib Cock", parent: null }],
  },
};

export function rec(p: Partial<SheetRecord> & { tab: string; row: number }): SheetRecord {
  const r: SheetRecord = {
    ref: `${p.tab}:${p.row}`, code: "", codeKey: "", name: "", category: "", series: "", collection: "", type: "",
    colours: [], finish: "", range: "", capacity: "", size: "", highlights: [], description: "", features: [],
    applications: [], specs: "", pageTitle: "", remarks: [], ...p,
  };
  r.codeKey = codeKey(r.code);
  return r;
}
