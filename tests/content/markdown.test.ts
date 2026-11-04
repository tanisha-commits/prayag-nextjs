import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { MARKDOWN_TEMPLATE, parseMarkdownPost, slugify } from "@/lib/content/markdown";
import { copyMissingMedia, mediaFile, saveMedia } from "@/lib/content/media";

describe("markdown posts", () => {
  it("parses the template, linking uploaded images by file name", () => {
    const r = parseMarkdownPost(MARKDOWN_TEMPLATE, { media: { "Banner.JPG": "/media/2026-11/banner-1.webp", "photo-1.jpg": "/media/2026-11/p-2.webp" } });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.slug).toBe("how-to-choose-the-right-kitchen-sink");
    expect(r.value.post.published).toBe("4-Nov-2026");
    expect(r.value.post.bannerImage).toBe("/media/2026-11/banner-1.webp");
    expect(r.value.post.bodyHtml).toContain('<img src="/media/2026-11/p-2.webp"');
    expect(r.value.post.bodyHtml).toContain("<h2>A heading</h2>");
    // related slugs were not found (no posts passed): skipped with a warning
    expect(r.value.warnings.some((w) => w.includes("does not exist"))).toBe(true);
  });

  it("explains what is wrong", () => {
    expect(parseMarkdownPost("no header")).toMatchObject({ ok: false });
    const r = parseMarkdownPost("---\ntitle: X\ndate: 31/12/2026\n---\nbody");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(" ")).toMatch(/date .* YYYY-MM-DD.*bannerImage is missing/);
    const colon = parseMarkdownPost("---\ntitle: Pipes: a guide\n---\nx");
    if (!colon.ok) expect(colon.errors[0]).toMatch(/double quotes/);
    const missing = parseMarkdownPost("---\ntitle: T\nbannerImage: banner.jpg\n---\nbody");
    if (!missing.ok) expect(missing.errors[0]).toMatch(/was not uploaded/);
  });

  it("makes slugs from titles", () => {
    expect(slugify("Kitchen Sinks: Steel vs Quartz — 2026 Guide!")).toBe("kitchen-sinks-steel-vs-quartz-2026-guide");
  });
});

describe("media", () => {
  it("stores real images as webp under a content-hash name and refuses others", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "media-"));
    process.env.PRAYAG_MEDIA_DIR = dir;
    const { default: sharp } = await import("sharp");
    const png = await sharp({ create: { width: 3000, height: 1000, channels: 3, background: "#c00" } }).png().toBuffer();
    const saved = await saveMedia(png, "My Banner.PNG");
    expect(saved.path).toMatch(/^\/media\/\d{4}-\d{2}\/my-banner-[0-9a-f]{10}\.webp$/);
    expect(saved.width).toBe(2000);
    const parts = saved.path.split("/").slice(2);
    expect(mediaFile(parts)).toBeTruthy();
    expect(mediaFile(["..", "x.webp"])).toBeNull();
    await expect(saveMedia(Buffer.from("<svg onload=alert(1)>"), "x.svg")).rejects.toThrow(/not a JPEG/);
    const other = fs.mkdtempSync(path.join(os.tmpdir(), "media2-"));
    expect(copyMissingMedia(dir, other)).toBe(1);
    expect(copyMissingMedia(dir, other)).toBe(0);
    delete process.env.PRAYAG_MEDIA_DIR;
  });
});
