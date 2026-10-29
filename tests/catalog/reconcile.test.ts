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
    const cs = reconcile([rec({ tab: "CP", row: 2, code: "BA-45", category: "Bathroom Accessories", description: "new text" })], [p("a", "BA-45", [1])], maps);
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
    const cs = reconcile([rec({ tab: "CP", row: 2, code: "5", category: "Bathroom Accessories", type: "Bib Cock" })], [p("a", "5", [1])], maps);
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
      [rec({ tab: "CP", row: 2, code: "9999", category: "CP Faucets" }), rec({ tab: "CP", row: 3, code: "9999", category: "CP Faucets" }), rec({ tab: "CP", row: 4, code: "8888", category: "Faucet" })],
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
    const r = rec({ tab: "Hardware", row: 2, code: "LD-1208" });
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
