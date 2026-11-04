import { describe, expect, it } from "vitest";
import manifest from "@/lib/content/text-manifest.generated.json";
import { applyTextEdits, markdownToPage, pageTexts, pageToMarkdown, renderedTexts, textId } from "@/lib/content/page-texts";

const cpvc = (manifest as Record<string, string[]>)["cpvc-plumbing-solution"];

describe("page texts", () => {
  it("has a text list for the content pages", () => {
    expect(cpvc).toContain("What are cPVC Pipes?");
    expect(cpvc).toContain("Superior Hot & Cold Water Distribution System ");
    expect(cpvc).not.toContain("use client");
  });

  it("keeps only texts that render (plus edited ones) when the page HTML is known", () => {
    const html = "<main><h2>What are cPVC Pipes?</h2><p>Superior Hot &amp; Cold Water Distribution System </p></main>";
    expect(renderedTexts(html).has("Superior Hot & Cold Water Distribution System")).toBe(true);
    const list = pageTexts("cpvc-plumbing-solution", undefined, html);
    expect(list.map((t) => t.original)).toEqual(["What are cPVC Pipes?", "Superior Hot & Cold Water Distribution System "]);
    const edited = pageTexts("cpvc-plumbing-solution", applyTextEdits(undefined, [{ original: "cPVC Pipes", text: "CPVC Pipes" }]), html);
    expect(edited.find((t) => t.original === "cPVC Pipes")).toMatchObject({ text: "CPVC Pipes", edited: true });
  });

  it("keeps the original's surrounding spaces and drops edits set back to the original", () => {
    const c = applyTextEdits(undefined, [{ original: "Superior Hot & Cold Water Distribution System ", text: "Hot and cold water, sorted" }]);
    expect(c.texts[0].text).toBe("Hot and cold water, sorted ");
    expect(applyTextEdits(c, [{ original: "Superior Hot & Cold Water Distribution System ", text: "Superior Hot & Cold Water Distribution System" }]).texts).toEqual([]);
  });

  it("round-trips a page through .md: texts, SEO and marketing points", () => {
    const html = "<main><h2>What are cPVC Pipes?</h2><p>cPVC Pipes</p></main>";
    const texts = pageTexts("cpvc-plumbing-solution", undefined, html);
    const md = pageToMarkdown("cpvc-plumbing-solution", undefined, texts);
    expect(md).toContain(`<!-- text:${textId("What are cPVC Pipes?")} -->`);
    const edited = md
      .replace("What are cPVC Pipes?", "What is a cPVC pipe?")
      .replace('seoTitle: ""', 'seoTitle: "cPVC Pipes | Prayag"')
      .replace("marketingPoints: []", "marketingPoints:\n  - Rated for hot water up to 93°C\n  - Lead-free")
      .replace("showMarketing: false", "showMarketing: true");
    const r = markdownToPage("cpvc-plumbing-solution", edited, undefined, texts);
    expect(r.errors).toEqual([]);
    expect(r.changed).toBe(1);
    expect(r.content.texts).toEqual([{ original: "What are cPVC Pipes?", text: "What is a cPVC pipe?" }]);
    expect(r.content).toMatchObject({ seoTitle: "cPVC Pipes | Prayag", marketingPoints: ["Rated for hot water up to 93°C", "Lead-free"], showMarketing: true });
    expect(markdownToPage("about-prayag", edited, undefined, texts).errors[0]).toMatch(/not "about-prayag"/);
  });
});
