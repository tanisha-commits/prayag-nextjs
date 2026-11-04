import Database from "better-sqlite3";
import { beforeEach, describe, expect, it } from "vitest";
import { PAGE_TEMPLATE, SECTION_TEMPLATE } from "@/lib/content/markdown-template";
import { parseMarkdownPage, parseMarkdownSection, renderMarkdown } from "@/lib/content/markdown";
import { SITE_PAGES } from "@/lib/content/page-registry";
import { ContentError, contentDb, readListEntry, saveEntry } from "@/lib/content/store";

function freshDb() {
  const db = new Database(":memory:");
  db.exec(`CREATE TABLE audit_log (id integer primary key autoincrement, actor text not null, action text not null, entity text not null, entity_id text not null, before text, after text, created_at integer not null default (unixepoch() * 1000));`);
  return contentDb(db);
}
let db: Database.Database;
beforeEach(() => {
  db = freshDb();
});

describe("page registry", () => {
  it("lists home plus every page folder, without the blog/product catch-all or search", () => {
    const slugs = SITE_PAGES.map((p) => p.slug);
    expect(slugs).toContain("home");
    expect(slugs).toContain("about-prayag");
    expect(slugs).toContain("plumbing-solutions");
    expect(slugs).toContain("press-coverages");
    expect(slugs).not.toContain("search");
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("page sections", () => {
  it("saves sections and SEO for an existing page only", () => {
    saveEntry({ id: "page-content", key: "about-prayag" }, { seoTitle: "About us", sections: [{ position: "bottom", markdown: "Hello **world**" }] }, "t", db);
    expect(readListEntry("page-content", "about-prayag", db)?.data.sections[0].markdown).toBe("Hello **world**");
    expect(() => saveEntry({ id: "page-content", key: "no-such-page" }, { sections: [] }, "t", db)).toThrow(/not one of the site's pages/);
  });

  it("parses section files with or without a header", () => {
    const withHeader = parseMarkdownSection(SECTION_TEMPLATE, { "photo-1.jpg": "/media/2026-11/p.webp" });
    expect(withHeader).toMatchObject({ position: "bottom", heading: "Why choose Prayag CPVC pipes" });
    expect(withHeader.markdown).toContain("(/media/2026-11/p.webp)");
    expect(parseMarkdownSection("Just **text**")).toMatchObject({ position: undefined, markdown: "Just **text**" });
  });

  it("renders Markdown to sanitized HTML (tables included)", () => {
    const html = renderMarkdown('| a | b |\n|---|---|\n| 1 | 2 |\n\n<script>x()</script><a href="javascript:y()">l</a>');
    expect(html).toContain("<table>");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("javascript:");
  });
});

describe("custom pages", () => {
  it("parses the page template and links uploaded images", () => {
    const r = parseMarkdownPage(PAGE_TEMPLATE, { media: { "banner.jpg": "/media/2026-11/b.webp", "photo-1.jpg": "/media/2026-11/p.webp" } });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.slug).toBe("prayag-service-centres");
    expect(r.value.page.bannerImage).toBe("/media/2026-11/b.webp");
    expect(r.value.page.markdown).toContain("(/media/2026-11/p.webp)");
  });

  it("shares the URL space with blog posts", () => {
    const page = { title: "Service", metaTitle: null, description: null, markdown: "x" };
    saveEntry({ id: "custom-pages", key: "service-centres" }, page, "t", db);
    const post = { title: "P", published: "1-Jan-2026", timestamp: 1, metaTitle: null, description: null, bannerImage: "/x.webp", bannerAlt: "x", bodyHtml: "<p>x</p>", related: [] };
    expect(() => saveEntry({ id: "blog", key: "service-centres" }, post, "t", db)).toThrow(ContentError);
    expect(() => saveEntry({ id: "custom-pages", key: "about-prayag" }, page, "t", db)).toThrow(/already used/);
    // A built-in blog article's slug is taken too.
    expect(() => saveEntry({ id: "custom-pages", key: "double-bowl-kitchen-sink-price" }, page, "t", db)).toThrow(/blog post/);
  });
});
