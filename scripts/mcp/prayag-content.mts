// Local MCP server: lets Claude read and edit the site's content in the same database, with the same
// validation and audit log as the admin (src/lib/content/store.ts). Runs over stdio on this machine
// only; edits reach the live site with the next deploy (content-sync.json, newer edits win).
//
//   npx tsx scripts/mcp/prayag-content.mts        (registered for Claude Code in .mcp.json)
//
// Environment: PRAYAG_DB_PATH (default data/prayag.db), PRAYAG_MCP_ACTOR (audit name, default
// "claude-mcp"), PRAYAG_PREVIEW_URL (optional local dev URL whose pages Claude can be pointed at).
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { LISTS, SINGLETONS, isList, isSingleton, type SingletonId } from "../../src/lib/content/schemas";
import { MARKDOWN_TEMPLATE, parseMarkdownPage, parseMarkdownPost, parseMarkdownSection } from "../../src/lib/content/markdown";
import { PAGE_TEMPLATE } from "../../src/lib/content/markdown-template";
import { SITE_PAGES, sitePage, type SitePageSlug } from "../../src/lib/content/page-registry";
import { applyTextEdits, markdownToPage, pageTexts, pageToMarkdown } from "../../src/lib/content/page-texts";
import { ContentError, contentDb, deleteEntry, readList, readListEntry, readSingleton, saveEntry } from "../../src/lib/content/store";

const ACTOR = process.env.PRAYAG_MCP_ACTOR || "claude-mcp";
const db = contentDb();

const json = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });
const fail = (message: string, extra?: unknown) => ({ isError: true, content: [{ type: "text" as const, text: extra ? `${message}\n${JSON.stringify(extra, null, 2)}` : message }] });

function guard<T>(fn: () => T) {
  try {
    return fn();
  } catch (e) {
    if (e instanceof ContentError) return fail(e.message, e.issues);
    return fail(`Unexpected error: ${(e as Error).message}`);
  }
}

const server = new McpServer(
  { name: "prayag-content", version: "1.0.0" },
  {
    instructions: [
      "Edits the content of the Prayag website (prayagindia.com clone): site contact details, social links, header/footer/drawer menus, homepage sections, FAQ, press coverage, privacy policy and blog posts.",
      "Workflow: list_content → get_content (current value) → change only what was asked → save_content with the FULL value (or patch_content for top-level fields). Every save is validated against the entry's schema (get_schema) and recorded in the audit log; invalid input is rejected with the failing paths.",
      "Single-document entries are addressed by id ('site/contact', 'home/hero', 'pages/faq', …). Blog posts: id 'blog' plus key = URL slug.",
      "Every existing page (About, Plumbing Solutions, CPVC, Inspiration pages, …; see list_pages) keeps its design and can get Markdown sections at the top or bottom plus SEO title/description: id 'page-content', key = page slug ('home' = homepage). add_page_section appends one section from Markdown.",
      "Page TEXT (the words already on a page) is edited with get_page_texts / set_page_texts, or as one .md with export_page_markdown / import_page_markdown; SEO keywords and marketing points live on the same page entry (patch_content id 'page-content': seoTitle, seoDescription, seoKeywords, marketingPoints, marketingHeading, showMarketing). When asked to write marketing or SEO points, write specific, factual points from the page's own texts and products; no invented claims or figures.",
      "New pages written in Markdown: id 'custom-pages', key = URL slug; import_markdown_page creates one from a .md document (format: get_markdown_template with kind 'page').",
      "Images and links are site paths (e.g. /sites/prayag/files/…, /contact-us) or https:// URLs. HTML fields are sanitized (no scripts/iframes/handlers).",
      "Blog posts can also be created from Markdown (import_markdown_post; format via get_markdown_template). Images must already be site paths or https URLs; uploading images is done in the admin.",
      "Products are read-only here (list_products/get_product); product edits are made in the admin.",
      "Changes are saved to the local database; the local dev site shows them on reload, and they reach the live site with the next deploy package.",
    ].join("\n"),
  },
);

server.registerTool(
  "list_content",
  {
    title: "List editable content",
    description: "All content entries with their description and whether they were edited (saved) or still show the built-in content. Blog posts are summarised; use list_blog_posts for the posts.",
    inputSchema: {},
    annotations: { readOnlyHint: true },
  },
  () =>
    guard(() =>
      json({
        entries: (Object.keys(SINGLETONS) as SingletonId[]).map((id) => {
          const r = readSingleton(id, db);
          return { id, title: SINGLETONS[id].title, description: SINGLETONS[id].description, source: r.source, updatedBy: r.updatedBy ?? null, updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : null };
        }),
        lists: Object.entries(LISTS).map(([id, l]) => ({ id, title: l.title, description: l.description, count: readList(id as keyof typeof LISTS, db).length })),
      }),
    ),
);

server.registerTool(
  "get_schema",
  {
    title: "Get an entry's schema",
    description: "JSON Schema of an entry ('site/contact', 'blog', …): field names, types, titles and descriptions. Saves must match it.",
    inputSchema: { id: z.string().describe("Entry id, e.g. 'home/hero' or 'blog'") },
    annotations: { readOnlyHint: true },
  },
  ({ id }) =>
    guard(() => {
      const schema = isSingleton(id) ? SINGLETONS[id].schema : isList(id) ? LISTS[id].schema : null;
      if (!schema) return fail(`Unknown id "${id}". Use list_content.`);
      return json(z.toJSONSchema(schema, { io: "input", unrepresentable: "any" }));
    }),
);

server.registerTool(
  "get_content",
  {
    title: "Get content",
    description: "Current value of an entry: a single-document id ('site/footer'), or id 'blog' with key = post slug.",
    inputSchema: { id: z.string(), key: z.string().optional().describe("Blog post slug (only for id 'blog')") },
    annotations: { readOnlyHint: true },
  },
  ({ id, key }) =>
    guard(() => {
      if (isSingleton(id)) return json(readSingleton(id, db));
      if (isList(id)) {
        if (!key) return fail("Give the entry key: post slug (list_blog_posts), page slug (list_pages) or custom page slug.");
        const entry = readListEntry(id, key, db);
        if (entry) return json(entry);
        if (id === "page-content" && sitePage(key)) return json({ key, data: { sections: [] }, source: "default" });
        return fail(`No ${id} entry "${key}".`);
      }
      return fail(`Unknown id "${id}". Use list_content.`);
    }),
);

server.registerTool(
  "list_blog_posts",
  {
    title: "List blog posts",
    description: "Blog posts newest first: slug, title, date, and whether edited here. Optional text filter on title/slug.",
    inputSchema: { search: z.string().optional(), limit: z.number().int().min(1).max(500).optional() },
    annotations: { readOnlyHint: true },
  },
  ({ search, limit }) =>
    guard(() => {
      const term = (search ?? "").toLowerCase();
      const posts = readList("blog", db)
        .filter((p) => !term || p.key.includes(term) || p.data.title.toLowerCase().includes(term))
        .sort((a, b) => b.data.timestamp - a.data.timestamp)
        .slice(0, limit ?? 50)
        .map((p) => ({ slug: p.key, title: p.data.title, published: p.data.published, source: p.source }));
      return json(posts);
    }),
);

server.registerTool(
  "save_content",
  {
    title: "Save content",
    description:
      "Replace an entry with a complete new value (validated). For a blog post pass id 'blog' and key = slug; a new slug creates a post (it must not collide with an existing page/product URL). Read the current value first and keep fields you are not changing.",
    inputSchema: { id: z.string(), key: z.string().optional(), data: z.record(z.string(), z.unknown()).describe("The full entry value") },
    annotations: { destructiveHint: false, idempotentHint: true },
  },
  ({ id, key, data }) =>
    guard(() => {
      const saved = saveEntry({ id, key }, data, ACTOR, db);
      return json({ ok: true, id, key: key ?? null, saved });
    }),
);

server.registerTool(
  "patch_content",
  {
    title: "Patch content",
    description: "Change some top-level fields of an entry and keep the rest (e.g. { email } of site/contact, or { title, bodyHtml } of a blog post). The merged value is validated.",
    inputSchema: { id: z.string(), key: z.string().optional(), fields: z.record(z.string(), z.unknown()).describe("Top-level fields to replace") },
    annotations: { destructiveHint: false, idempotentHint: true },
  },
  ({ id, key, fields }) =>
    guard(() => {
      let current: Record<string, unknown> | undefined;
      if (isSingleton(id)) current = readSingleton(id, db).data as Record<string, unknown>;
      else if (isList(id) && key) current = (readListEntry(id, key, db)?.data ?? (id === "page-content" && sitePage(key) ? { sections: [] } : undefined)) as Record<string, unknown> | undefined;
      if (!current) return fail(isList(id) ? `No blog post "${key}". Use save_content to create one.` : `Unknown id "${id}".`);
      const saved = saveEntry({ id, key }, { ...current, ...fields }, ACTOR, db);
      return json({ ok: true, id, key: key ?? null, saved });
    }),
);

server.registerTool(
  "delete_content",
  {
    title: "Delete / reset content",
    description: "Blog post (id 'blog' + key): removes it from the site. Single-document entry: discards the edits and restores the built-in content. Only do this when explicitly asked.",
    inputSchema: { id: z.string(), key: z.string().optional() },
    annotations: { destructiveHint: true },
  },
  ({ id, key }) =>
    guard(() => {
      deleteEntry({ id, key }, ACTOR, db);
      return json({ ok: true, id, key: key ?? null, result: isList(id) ? "removed" : "reset to built-in content" });
    }),
);

server.registerTool(
  "import_markdown_post",
  {
    title: "Create a blog post from Markdown",
    description:
      "Create (or with overwrite, replace) a blog post from a Markdown document with a YAML header: title, slug, date (YYYY-MM-DD), metaTitle, description, bannerImage (site path or https URL), bannerAlt, related (list of existing slugs). Same format as the admin's 'Import .md files'. Use get_markdown_template for an example.",
    inputSchema: { markdown: z.string().max(400_000), overwrite: z.boolean().optional() },
    annotations: { destructiveHint: false },
  },
  ({ markdown, overwrite }) =>
    guard(() => {
      const r = parseMarkdownPost(markdown, { posts: readList("blog", db) });
      if (!r.ok) return fail("The Markdown could not be imported.", r.errors);
      const { slug, post, warnings } = r.value;
      if (readListEntry("blog", slug, db) && !overwrite) return fail(`/${slug} already exists. Pass overwrite: true to replace it, or change the slug.`);
      saveEntry({ id: "blog", key: slug }, post, ACTOR, db);
      return json({ ok: true, slug, url: `/${slug}`, title: post.title, warnings });
    }),
);

server.registerTool(
  "get_markdown_template",
  {
    title: "Markdown templates",
    description: "The .md format, with comments: kind 'post' (blog post, default) or 'page' (custom page).",
    inputSchema: { kind: z.enum(["post", "page"]).optional() },
    annotations: { readOnlyHint: true },
  },
  ({ kind }) => ({ content: [{ type: "text" as const, text: kind === "page" ? PAGE_TEMPLATE : MARKDOWN_TEMPLATE }] }),
);

server.registerTool(
  "list_pages",
  {
    title: "List site pages",
    description: "Every existing page that can carry Markdown sections and SEO overrides: slug, path, title, group, number of sections, SEO overridden. Also lists custom (Markdown) pages.",
    inputSchema: {},
    annotations: { readOnlyHint: true },
  },
  () =>
    guard(() => {
      const saved = new Map(readList("page-content", db).map((e) => [e.key, e.data]));
      return json({
        pages: SITE_PAGES.map((p) => {
          const c = saved.get(p.slug);
          return { ...p, sections: c?.sections.length ?? 0, seo: !!(c?.seoTitle || c?.seoDescription) };
        }),
        customPages: readList("custom-pages", db).map((p) => ({ slug: p.key, path: `/${p.key}`, title: p.data.title })),
      });
    }),
);

server.registerTool(
  "add_page_section",
  {
    title: "Add a Markdown section to a page",
    description:
      "Append a section to an existing page (keeps the page's design). position 'bottom' (above the footer, default) or 'top' (under the header). The markdown may start with a --- header holding position/heading. Images must be site paths or https URLs.",
    inputSchema: {
      page: z.string().describe("Page slug from list_pages, e.g. 'about-prayag'; 'home' for the homepage"),
      markdown: z.string().max(300_000),
      heading: z.string().max(300).optional(),
      position: z.enum(["top", "bottom"]).optional(),
    },
    annotations: { destructiveHint: false },
  },
  ({ page, markdown, heading, position }) =>
    guard(() => {
      if (!sitePage(page)) return fail(`"${page}" is not one of the site's pages (see list_pages).`);
      const parsed = parseMarkdownSection(markdown);
      const current = readListEntry("page-content", page, db)?.data ?? { sections: [] };
      const section = { position: position ?? parsed.position ?? "bottom", ...((heading ?? parsed.heading) ? { heading: heading ?? parsed.heading } : {}), markdown: parsed.markdown };
      const saved = saveEntry({ id: "page-content", key: page }, { ...current, sections: [...current.sections, section] }, ACTOR, db);
      return json({ ok: true, page, sections: (saved as { sections: unknown[] }).sections.length, warnings: parsed.warnings });
    }),
);

server.registerTool(
  "import_markdown_page",
  {
    title: "Create a page from Markdown",
    description: "Create (or with overwrite, replace) a custom page at /<slug> from a Markdown document with a YAML header: title, slug, metaTitle, description, bannerImage (optional), bannerAlt. Format: get_markdown_template kind 'page'.",
    inputSchema: { markdown: z.string().max(400_000), overwrite: z.boolean().optional() },
    annotations: { destructiveHint: false },
  },
  ({ markdown, overwrite }) =>
    guard(() => {
      const r = parseMarkdownPage(markdown);
      if (!r.ok) return fail("The Markdown could not be imported.", r.errors);
      const { slug, page, warnings } = r.value;
      if (readListEntry("custom-pages", slug, db) && !overwrite) return fail(`/${slug} already exists. Pass overwrite: true to replace it, or change the slug.`);
      saveEntry({ id: "custom-pages", key: slug }, page, ACTOR, db);
      return json({ ok: true, slug, url: `/${slug}`, title: page.title, warnings });
    }),
);

/** A page's editable texts; checks a running local site (PRAYAG_PREVIEW_URL) when available. */
async function textsOf(slug: SitePageSlug) {
  const content = readListEntry("page-content", slug, db)?.data;
  let html: string | undefined;
  const base = process.env.PRAYAG_PREVIEW_URL?.replace(/\/$/, "");
  const path = sitePage(slug)!.path;
  if (base) html = await fetch(base + (path === "/" ? "" : path), { signal: AbortSignal.timeout(10000) }).then((r) => (r.ok ? r.text() : undefined)).catch(() => undefined);
  return { content, texts: pageTexts(slug, content, html), checked: !!html };
}

server.registerTool(
  "get_page_texts",
  {
    title: "Get a page's texts",
    description:
      "Every editable text of an existing page (the words on the page; the design stays). Each has an id, the original and the current text. Without a running local site (PRAYAG_PREVIEW_URL) the list may include a few strings that are not shown.",
    inputSchema: { page: z.string().describe("Page slug from list_pages"), search: z.string().optional() },
    annotations: { readOnlyHint: true },
  },
  async ({ page, search }) => {
    if (!sitePage(page)) return fail(`"${page}" is not one of the site's pages (see list_pages).`);
    const { texts, checked } = await textsOf(page as SitePageSlug);
    const q = (search ?? "").toLowerCase();
    return json({ page, checkedAgainstRenderedPage: checked, texts: texts.filter((t) => !q || t.original.toLowerCase().includes(q) || t.text.toLowerCase().includes(q)) });
  },
);

server.registerTool(
  "set_page_texts",
  {
    title: "Change texts on a page",
    description: "Replace texts on an existing page without changing its design. Identify each text by id (from get_page_texts) or by its exact original. Setting a text back to its original removes the edit.",
    inputSchema: {
      page: z.string(),
      changes: z.array(z.object({ id: z.string().optional(), original: z.string().optional(), text: z.string() })).min(1).max(1000),
    },
    annotations: { destructiveHint: false, idempotentHint: true },
  },
  async ({ page, changes }) => {
    if (!sitePage(page)) return fail(`"${page}" is not one of the site's pages (see list_pages).`);
    const { content, texts } = await textsOf(page as SitePageSlug);
    const byId = new Map(texts.map((t) => [t.id, t.original]));
    const resolved: { original: string; text: string }[] = [];
    const notFound: string[] = [];
    for (const c of changes) {
      const original = c.id ? byId.get(c.id) : texts.find((t) => t.original === c.original || t.original.trim() === c.original?.trim())?.original;
      if (original) resolved.push({ original, text: c.text });
      else notFound.push(c.id ?? c.original ?? "?");
    }
    if (!resolved.length) return fail("None of the texts were found on this page (use get_page_texts).", notFound);
    return guard(() => {
      saveEntry({ id: "page-content", key: page }, applyTextEdits(content, resolved), ACTOR, db);
      return json({ ok: true, page, changed: resolved.length, notFound });
    });
  },
);

server.registerTool(
  "export_page_markdown",
  { title: "Page as .md", description: "The page's texts, SEO and marketing points as one editable .md document (same file as the admin's Download .md).", inputSchema: { page: z.string() }, annotations: { readOnlyHint: true } },
  async ({ page }) => {
    if (!sitePage(page)) return fail(`"${page}" is not one of the site's pages.`);
    const { content, texts } = await textsOf(page as SitePageSlug);
    return { content: [{ type: "text" as const, text: pageToMarkdown(page as SitePageSlug, content, texts) }] };
  },
);

server.registerTool(
  "import_page_markdown",
  {
    title: "Apply a page .md",
    description: "Apply an edited page .md (from export_page_markdown): texts by their <!-- text:id --> markers, and seoTitle/seoDescription/seoKeywords/marketingPoints/marketingHeading/showMarketing from the header.",
    inputSchema: { page: z.string(), markdown: z.string().max(2_000_000) },
    annotations: { destructiveHint: false },
  },
  async ({ page, markdown }) => {
    if (!sitePage(page)) return fail(`"${page}" is not one of the site's pages.`);
    const { content, texts } = await textsOf(page as SitePageSlug);
    const r = markdownToPage(page as SitePageSlug, markdown, content, texts);
    if (r.errors.length) return fail("The .md could not be applied.", r.errors);
    return guard(() => {
      saveEntry({ id: "page-content", key: page }, r.content, ACTOR, db);
      return json({ ok: true, page, textChanges: r.changed, skippedBlocks: r.unknown });
    });
  },
);

type ProductRow = { public_id: string; slug: string; title: string; item_code: string | null; status: string; short_description: string | null; description_html: string | null; seo_title: string | null; seo_description: string | null };

server.registerTool(
  "list_products",
  {
    title: "List products (read-only)",
    description: "Catalog products with slug (URL /<slug>), title, item code and status. Optional search on title/slug/item code.",
    inputSchema: { search: z.string().optional(), limit: z.number().int().min(1).max(500).optional() },
    annotations: { readOnlyHint: true },
  },
  ({ search, limit }) =>
    guard(() => {
      const term = `%${(search ?? "").toLowerCase()}%`;
      const rows = db
        .prepare("SELECT public_id, slug, title, item_code, status FROM products WHERE lower(title) LIKE ? OR slug LIKE ? OR lower(coalesce(item_code, '')) LIKE ? ORDER BY title LIMIT ?")
        .all(term, term, term, limit ?? 50);
      return json(rows);
    }),
);

server.registerTool(
  "get_product",
  {
    title: "Get a product (read-only)",
    description: "One product by slug or public id: text fields and categories. Edit products in the admin (/admin/products).",
    inputSchema: { slugOrId: z.string() },
    annotations: { readOnlyHint: true },
  },
  ({ slugOrId }) =>
    guard(() => {
      const p = db.prepare("SELECT id, public_id, slug, title, item_code, status, short_description, description_html, seo_title, seo_description FROM products WHERE slug = ? OR public_id = ?").get(slugOrId, slugOrId) as (ProductRow & { id: number }) | undefined;
      if (!p) return fail(`No product "${slugOrId}".`);
      const categories = db.prepare("SELECT c.slug, c.name FROM product_categories pc JOIN categories c ON c.id = pc.category_id WHERE pc.product_id = ?").all(p.id);
      return json({ ...p, id: undefined, categories });
    }),
);

await server.connect(new StdioServerTransport());
