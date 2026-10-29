import { describe, expect, it } from "vitest";
import { codeKey, titleCodeCandidate } from "@/lib/catalog/normalize";
import { reconcile, type CurrentProduct, type LabelMapping } from "@/lib/catalog/reconcile";
import { rec } from "./helpers";

const p = (publicId: string, itemCode: string | null, categoryIds: number[], attributes: { key: string; value: string }[] = [], title = `${itemCode} Product`): CurrentProduct => ({ publicId, itemCode, categoryIds, attributes, title });
const exact = (tab: string, field: LabelMapping["field"], label: string, target: Partial<LabelMapping>): LabelMapping => ({ tab, field, label, basis: "exact", ...target });

describe("normalisation", () => {
  it("compares item codes ignoring case, spaces and punctuation", () => {
    expect(codeKey("6102-rg")).toBe(codeKey("6102 RG"));
    expect(codeKey("BOS-41SS")).toBe("BOS41SS");
  });
  it("only takes code-like first tokens from titles", () => {
    expect(titleCodeCandidate("101 Waste Coupling")).toBe("101");
    expect(titleCodeCandidate("Bromo Vertical")).toBeNull();
  });
});

describe("reconcile", () => {
  const maps = [
    exact("CP", "category", "Bathroom Accessories", { categoryId: 170 }),
    exact("CP", "category", "CP Faucets", { categoryId: 1 }),
    exact("CP", "series", "Vignette", { attribute: { key: "series", value: "Vignette" } }),
    { tab: "CP", field: "category", label: "Faucet", basis: "suggested", categoryId: 1 } as LabelMapping,
  ];

  it("proposes a category-only update for an exact code match with a verified label", () => {
    // The product has no category yet, so the verified sheet category fills it.
    const cs = reconcile([rec({ tab: "CP", row: 2, code: "BA-45", category: "Bathroom Accessories", description: "new text" })], [p("a", "BA-45", [])], maps);
    const c = cs.changes[0];
    expect(c.action).toBe("category");
    if (c.action !== "category") return;
    expect(c.set).toEqual({ categoryIds: [170] });
    expect(c.contentDiffs).toContain("description"); // reported only, never applied
  });

  it("leaves a product unchanged when the mapping already matches or the label is blank", () => {
    const cs = reconcile([rec({ tab: "CP", row: 2, code: "6102-RG", category: "CP Faucets" }), rec({ tab: "CP", row: 3, code: "7000" })], [p("a", "6102-RG", [1]), p("b", "7000", [1])], maps);
    expect(cs.changes.map((c) => c.action)).toEqual(["unchanged", "unchanged"]);
  });

  it("never applies a suggested (unapproved) label; it waits for a decision", () => {
    const cs = reconcile([rec({ tab: "CP", row: 2, code: "6102-RG", category: "Faucet" })], [p("a", "6102-RG", [170])], maps);
    expect(cs.changes[0]).toMatchObject({ action: "pending" });
  });

  it("applies verified fields of a row while holding back its unverified ones", () => {
    const cs = reconcile([rec({ tab: "CP", row: 2, code: "5", category: "Bathroom Accessories", type: "Bib Cock" })], [p("a", "5", [])], maps);
    expect(cs.changes[0]).toMatchObject({ action: "category", set: { categoryIds: [170] }, pending: ['type "Bib Cock"'] });
  });

  it("sends ambiguous code matches to review instead of picking one", () => {
    const cs = reconcile([rec({ tab: "CP", row: 2, code: "7180", category: "CP Faucets" })], [p("a", "7180", [1]), p("b", "7180", [1])], maps);
    expect(cs.changes[0].action).toBe("review");
  });

  it("does not let a title-only code match change anything", () => {
    const cs = reconcile([rec({ tab: "CP", row: 2, code: "101", category: "Bathroom Accessories" })], [p("a", null, [1], [], "101 Waste Coupling")], maps);
    expect(cs.changes[0]).toMatchObject({ action: "review", match: "title-code" });
  });

  it("adds a new product only with a verified category, and never twice", () => {
    const cs = reconcile(
      [rec({ tab: "CP", row: 2, code: "9999", name: "Mixer", category: "CP Faucets" }), rec({ tab: "CP", row: 3, code: "9999", name: "Mixer", category: "CP Faucets" }), rec({ tab: "CP", row: 4, code: "8888", name: "Tap", category: "Faucet" })],
      [],
      maps,
    );
    expect(cs.changes.map((c) => c.action)).toEqual(["new", "skip", "pending"]);
  });

  it("reports duplicate sheet rows with different mappings as conflicts", () => {
    const cs = reconcile([rec({ tab: "CP", row: 2, code: "1", category: "CP Faucets" }), rec({ tab: "CP", row: 3, code: "1", category: "Bathroom Accessories" })], [], maps);
    expect(cs.changes[1].action).toBe("review");
  });

  it("fills an empty attribute but reports a different existing value as a conflict", () => {
    const fill = reconcile([rec({ tab: "CP", row: 2, code: "5", series: "Vignette" })], [p("a", "5", [1])], maps).changes[0];
    expect(fill).toMatchObject({ action: "category", set: { attributes: [{ key: "series", value: "Vignette" }] } });
    const conflict = reconcile([rec({ tab: "CP", row: 2, code: "5", series: "Vignette" })], [p("a", "5", [1], [{ key: "series", value: "6000-7000" }])], maps).changes[0];
    expect(conflict.action).toBe("review");
  });

  it("skips rows with no item code and no existing product of that name", () => {
    expect(reconcile([rec({ tab: "Traps and Gratings", row: 2, name: "ABC" })], [], maps).changes[0].action).toBe("skip");
  });

  it("keeps products the sheet does not mention untouched", () => {
    const cs = reconcile([], [p("hw", "LD-1208", [24])], maps);
    expect(cs.untouched.map((x) => x.publicId)).toEqual(["hw"]);
  });
});

describe("blank categories", () => {
  const blank = (basis: LabelMapping["basis"]): LabelMapping => ({ tab: "Hardware", field: "category", label: "(blank)", basis, categoryId: 24 });
  it("uses the tab default for a new product only after approval", () => {
    const r = rec({ tab: "Hardware", row: 2, code: "LD-1208", name: "Aldrop" });
    expect(reconcile([r], [], [blank("suggested")]).changes[0].action).toBe("pending");
    expect(reconcile([r], [], [blank("approved")]).changes[0]).toMatchObject({ action: "new", categoryIds: [24] });
  });
  it("never applies the tab default to an existing product", () => {
    const r = rec({ tab: "Hardware", row: 2, code: "LD-1208" });
    const cs = reconcile([r], [{ publicId: "x", title: "LD-1208", itemCode: "LD-1208", categoryIds: [99], attributes: [] }], [blank("approved")]);
    expect(cs.changes[0].action).toBe("unchanged");
  });
});

describe("category specificity", () => {
  const maps = [exact("BA", "category", "Bathroom Accessories", { categoryId: 170 }), exact("BA", "category", "Shower", { categoryId: 171 })];
  const parents = new Map<number, number | null>([[170, null], [171, 170], [172, 170]]);
  it("keeps the more specific live category when the sheet names its parent", () => {
    const cs = reconcile([rec({ tab: "BA", row: 2, code: "BS-73", category: "Bathroom Accessories" })], [p("a", "BS-73", [171])], maps, parents);
    expect(cs.changes[0].action).toBe("unchanged");
  });
  it("applies a more specific sheet category", () => {
    const cs = reconcile([rec({ tab: "BA", row: 2, code: "BS-73", category: "Shower" })], [p("a", "BS-73", [170])], maps, parents);
    expect(cs.changes[0]).toMatchObject({ action: "category", set: { categoryIds: [171] } });
  });
});

describe("sheet remarks", () => {
  it("never adds or changes a row the sheet marks for deletion", () => {
    const maps = [exact("CP", "category", "CP Faucets", { categoryId: 1 })];
    const newRow = rec({ tab: "CP", row: 2, code: "PD-40-N", category: "CP Faucets", remarks: ["Delete this from website"] });
    expect(reconcile([newRow], [], maps).changes[0].action).toBe("review");
    const existing = reconcile([{ ...newRow, code: "6102-RG", codeKey: "6102RG" }], [p("a", "6102-RG", [170])], maps).changes[0];
    expect(existing).toMatchObject({ action: "review", product: { publicId: "a" } });
  });
});

describe("variants", () => {
  it("does not add a code that only differs from an existing product by a colour suffix", () => {
    const maps = [exact("CP", "category", "CP Faucets", { categoryId: 1 })];
    const cs = reconcile([rec({ tab: "CP", row: 2, code: "6108-RG", category: "CP Faucets" })], [p("a", "6108-G", [1])], maps);
    expect(cs.changes[0]).toMatchObject({ action: "review", candidates: [{ publicId: "a" }] });
    expect(reconcile([rec({ tab: "CP", row: 2, code: "7777", name: "Tap", category: "CP Faucets" })], [p("a", "6108-G", [1])], maps).changes[0].action).toBe("new");
  });
});

describe("owner decisions (2026-10-29)", () => {
  const maps = [exact("CP", "category", "CP Faucets", { categoryId: 1 }), exact("CP", "category", "Bathroom Accessories", { categoryId: 170 })];
  const colour = (value: string) => ({ key: "colour", value });

  it("confirms a title-code match only when a sheet detail appears in the live title", () => {
    const live = [p("a", null, [1], [], "4001 Drenche Fully Loaded Floor Mounted WC")];
    // Confirmed: the match is accepted (the unmapped collection label itself only waits as "pending").
    expect(reconcile([rec({ tab: "CP", row: 2, code: "4001", collection: "Drenche" })], live, maps).changes[0]).toMatchObject({ action: "pending", match: "title-code+", product: { publicId: "a" } });
    expect(reconcile([rec({ tab: "CP", row: 2, code: "4001", type: "Wash Basin" })], live, maps).changes[0].action).toBe("review");
  });

  it("resolves two live products with one code by the title, and flags the other", () => {
    const live = [p("a", "130-U", [1], [], "130-U Pillar Cock"), p("b", "130-U", [1], [], "1375-U Wall Mixer")];
    const cs = reconcile([rec({ tab: "CP", row: 2, code: "130-U", type: "Pillar Cock", category: "CP Faucets" })], live, maps);
    expect(cs.changes.map((c) => [c.action, "product" in c ? c.product?.publicId : undefined])).toEqual([["pending", "a"], ["review", "b"]]);
    expect(cs.changes[1]).toMatchObject({ reasons: [expect.stringContaining("live code conflict")] });
  });

  it("treats a colour code as covered when the base product already lists that colour", () => {
    const live = [p("a", "6103-G", [1], [colour("Gold"), colour("Rose Gold")], "6103-G Pillar Cock")];
    expect(reconcile([rec({ tab: "CP", row: 2, code: "6103-RG", category: "CP Faucets" })], live, maps).changes[0]).toMatchObject({ action: "variant" });
    const noRose = [p("a", "6103-G", [1], [colour("Gold")], "6103-G Pillar Cock")];
    expect(reconcile([rec({ tab: "CP", row: 2, code: "6103-RG", category: "CP Faucets" })], noRose, maps).changes[0].action).toBe("review");
  });

  it("keeps the duplicate row whose type matches the live title and skips the other", () => {
    const live = [p("a", "BA-46", [172], [], "BA-46 Tumble Holder")];
    const rows = [rec({ tab: "BA", row: 12, code: "BA-46", type: "Tumble Holder" }), rec({ tab: "CP", row: 369, code: "BA-46", type: "Tumbler Holder" })];
    const cs = reconcile(rows, live, maps).changes;
    expect(cs.map((c) => c.action)).toEqual(["pending", "skip"]);
    expect(cs[0]).toMatchObject({ product: { publicId: "a" } });
    const both = [rec({ tab: "CP", row: 1, code: "X-1", type: "A" }), rec({ tab: "CP", row: 2, code: "X-1", type: "B" })];
    expect(reconcile(both, [p("a", "X-1", [1], [], "X-1 C")], maps).changes.map((c) => c.action)).toEqual(["review", "review"]);
  });
});

describe("category conflicts", () => {
  const maps = [exact("CP", "category", "CP Faucets", { categoryId: 1 }), exact("CP", "category", "Shower", { categoryId: 163 })];
  const parents = new Map<number, number | null>([[1, null], [2, null], [163, 2], [170, null], [171, 170]]);
  it("keeps the live category when the sheet puts the product somewhere else", () => {
    const cs = reconcile([rec({ tab: "CP", row: 2, code: "1811", category: "Shower" })], [p("a", "1811", [171])], maps, parents);
    expect(cs.changes[0]).toMatchObject({ action: "review", reasons: [expect.stringContaining("live kept")] });
  });
  it("still fills an empty category", () => {
    const cs = reconcile([rec({ tab: "CP", row: 2, code: "1811", category: "Shower" })], [p("a", "1811", [])], maps, parents);
    expect(cs.changes[0]).toMatchObject({ action: "category", set: { categoryIds: [163] } });
  });
});

describe("recorded blank-category decisions", () => {
  it("are honoured by draftMappings (approve -> new, skip -> review)", async () => {
    const { draftMappings } = await import("@/lib/catalog/mapping");
    const { taxonomy } = await import("./helpers");
    const hw = rec({ tab: "Hardware", row: 2, code: "LD-1208", name: "Aldrop" });
    const approved = draftMappings([hw], taxonomy, [{ tab: "Hardware", field: "category", label: "(blank)", categoryTid: 24, decision: "map" }], (t) => t);
    expect(reconcile([hw], [], approved).changes[0]).toMatchObject({ action: "new", categoryIds: [24] });
    const skipped = draftMappings([hw], taxonomy, [{ tab: "Hardware", field: "category", label: "(blank)", decision: "skip" }], (t) => t);
    expect(reconcile([hw], [], skipped).changes[0].action).toBe("review");
  });
});

describe("titled pages with another item code", () => {
  it("never adds a code whose live page carries a different item code", () => {
    const maps = [exact("CP", "category", "CP Faucets", { categoryId: 1 })];
    const cs = reconcile([rec({ tab: "CP", row: 2, code: "8510", category: "CP Faucets" })], [p("a", "8509", [1], [], "8510 Angular Stop Cock")], maps);
    expect(cs.changes[0]).toMatchObject({ action: "review", candidates: [{ publicId: "a" }] });
  });
});

describe("final decisions (skip column, held names, typo normalisation)", () => {
  it("ignores a skipped column without blocking the row's other fields", () => {
    const maps: LabelMapping[] = [
      exact("Ceramicware", "category", "Water Closet", { categoryId: 183 }),
      { tab: "Ceramicware", field: "collection", label: "S Trap", basis: "skipped" },
    ];
    const cs = reconcile([rec({ tab: "Ceramicware", row: 2, code: "4001", category: "Water Closet", collection: "S Trap" })], [p("a", "4001", [])], maps);
    expect(cs.changes[0]).toMatchObject({ action: "category", set: { categoryIds: [183] }, pending: [] });
  });
  it("holds a new product whose name would be its code alone", () => {
    const maps = [{ tab: "Hardware", field: "category", label: "(blank)", basis: "approved", categoryId: 24 } as LabelMapping];
    const cs = reconcile([rec({ tab: "Hardware", row: 2, code: "LD-1208", highlights: ["ALDROP Ø12x200 MM"] })], [], maps);
    expect(cs.changes[0]).toMatchObject({ action: "review", reasons: [expect.stringContaining("no product name")] });
  });
  it("stores the corrected spelling for an approved typo mapping", async () => {
    const { draftMappings } = await import("@/lib/catalog/mapping");
    const { taxonomy } = await import("./helpers");
    const r = rec({ tab: "Kitchen Sinks", row: 2, code: "1216", type: "Single Blow" });
    const m = draftMappings([r], taxonomy, [{ tab: "Kitchen Sinks", field: "type", label: "Single Blow", attribute: { key: "type", value: "Single Bowl" }, decision: "map" }], (t) => t);
    expect(m.find((x) => x.field === "type")).toMatchObject({ basis: "approved", attribute: { value: "Single Bowl" } });
  });
});
