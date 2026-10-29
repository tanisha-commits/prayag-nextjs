import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { applyChangeSet, categoryIdByTid, loadCurrent, recordPreview, seedCategories, seedLiveProducts } from "@/lib/catalog/importer";
import { liveAssignments, type LiveProduct } from "@/lib/catalog/live";
import { draftMappings } from "@/lib/catalog/mapping";
import { listProducts } from "@/lib/catalog/queries";
import { reconcile } from "@/lib/catalog/reconcile";
import { productAttributes, productCategories, products } from "@/lib/db/schema";
import { memoryDb, rec, taxonomy } from "./helpers";

const live = (nid: number, path: string, code: string, crumb: string, colours: string[] = []): LiveProduct => ({
  nid, path, canonical: "", metaTitle: `${code} meta`, metaDescription: "", title: `${code} Product`, itemCode: code, breadcrumb: [crumb], short: "short",
  colours: colours.map((name) => ({ name, hex: "#000" })), highlights: [], features: ["f"], descriptionHtml: "<p>desc</p>", specsHtml: "", sizesHtml: "", images: [{ src: `/img/${code}.webp`, alt: code }],
});

function seeded() {
  const { db } = memoryDb();
  seedCategories(db, taxonomy);
  const items = [live(1, "/ba-45", "BA-45", "CP Faucets", ["Chrome"]), live(2, "/6102-rg", "6102-RG", "CP Faucets", ["Gold", "Chrome"]), live(3, "/123-u", "123-U", "Shower")];
  const membership = { faucets: { all: ["/ba-45", "/6102-rg"], filters: {} }, "ptmt-taps": { all: ["/123-u"], filters: {} } };
  seedLiveProducts(db, items, liveAssignments(items, membership, taxonomy));
  return { db, items, membership };
}

describe("import", () => {
  it("seeds categories and live products idempotently", () => {
    const { db, items, membership } = seeded();
    expect(seedCategories(db, taxonomy)).toBe(0);
    expect(seedLiveProducts(db, items, liveAssignments(items, membership, taxonomy))).toMatchObject({ inserted: 0, existing: 3 });
    expect(db.select().from(products).all()).toHaveLength(3);
    // The PTMT "Shower" breadcrumb resolves inside the PTMT listing, not to another "Shower".
    const shower = loadCurrent(db).find((p) => p.itemCode === "123-U")!;
    expect(shower.categoryIds).toEqual([categoryIdByTid(db)(163)]);
  });

  it("applies a category-only change without touching any other product field, and is idempotent", () => {
    const { db } = seeded();
    const before = db.select().from(products).where(eq(products.itemCode, "BA-45")).get()!;
    const records = [rec({ tab: "CP", row: 2, code: "BA-45", category: "Bathroom Accessories", description: "sheet text" }), rec({ tab: "CP", row: 3, code: "9999", category: "CP Faucets", type: "Sink Mixer" })];
    const maps = () => draftMappings(records, taxonomy, [], categoryIdByTid(db));
    const cs = reconcile(records, loadCurrent(db), maps());
    expect(cs.counts).toMatchObject({ category: 1, new: 1 });
    const runId = recordPreview(db, cs, "test", "hash", "test");
    applyChangeSet(db, cs, runId, "test", new Set());

    const after = db.select().from(products).where(eq(products.itemCode, "BA-45")).get()!;
    // name, description, SEO, slug, status, publicId… all unchanged (only updatedAt moves)
    expect({ ...after, updatedAt: null }).toEqual({ ...before, updatedAt: null });
    expect(db.select().from(productCategories).where(eq(productCategories.productId, after.id)).all().map((c) => c.categoryId)).toEqual([categoryIdByTid(db)(170)]);

    const added = db.select().from(products).where(eq(products.itemCode, "9999")).get()!;
    expect(added).toMatchObject({ status: "draft", origin: "sheet", title: "9999 Sink Mixer" });

    // Running the same source again finds nothing left to do and creates no duplicates.
    const again = reconcile(records, loadCurrent(db), maps());
    expect(again.counts.category ?? 0).toBe(0);
    expect(again.counts.new ?? 0).toBe(0);
    applyChangeSet(db, cs, recordPreview(db, cs, "test", "hash", "test"), "test", new Set());
    expect(db.select().from(products).where(eq(products.itemCode, "9999")).all()).toHaveLength(1);
  });
});

describe("filters", () => {
  it("combines filters (OR within a key, AND across keys) and counts facets against the other filters", () => {
    const { db } = seeded();
    const all = listProducts(db, { category: "faucets" });
    expect(all.total).toBe(2);
    expect(listProducts(db, { category: "faucets", filters: { colour: ["gold"] } }).items.map((i) => i.itemCode)).toEqual(["6102-RG"]);
    expect(listProducts(db, { category: "faucets", filters: { colour: ["gold", "chrome"] } }).total).toBe(2);
    const id = db.select().from(products).where(eq(products.itemCode, "6102-RG")).get()!.id;
    db.insert(productAttributes).values({ productId: id, key: "series", value: "Vignette", valueSlug: "vignette", source: "test" }).run();
    const r = listProducts(db, { category: "faucets", filters: { colour: ["chrome"], series: ["vignette"] } });
    expect(r.items.map((i) => i.itemCode)).toEqual(["6102-RG"]);
    // Colour facet ignores the colour filter itself but respects the series filter.
    expect(r.facets.find((f) => f.key === "colour")?.values.map((v) => [v.slug, v.count])).toEqual([["chrome", 1], ["gold", 1]]);
  });

  it("hides drafts publicly and includes subcategories", () => {
    const { db } = seeded();
    expect(listProducts(db, { category: "ptmt-taps" }).total).toBe(1);
    db.update(products).set({ status: "draft" }).where(eq(products.itemCode, "123-U")).run();
    expect(listProducts(db, { category: "ptmt-taps" }).total).toBe(0);
    expect(listProducts(db, { category: "ptmt-taps", includeUnpublished: true }).total).toBe(1);
    expect(listProducts(db, { category: "no-such-category" }).total).toBe(0);
  });
});
