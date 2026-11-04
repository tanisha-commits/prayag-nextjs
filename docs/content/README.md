# Editable content (admin + Claude)

Text, images and links of the site live in one table (`content_entries`, same SQLite file as the
catalog). The admin (**/admin/content**) and Claude (through the local MCP server) read and write
the **same entries**, with the same validation and the same audit log. An entry nobody has edited
shows the content the site launched with ("built-in"). Until something is edited, every page renders
exactly as before.

| Entry | What it controls |
|---|---|
| `site/contact`, `site/social` | Footer address/phones/email; social links (footer, drawer, blog share bar) |
| `site/header`, `site/drawer`, `site/footer` | Header menus (desktop + mobile), drawer/mobile-menu extras, footer columns |
| `home/hero` … `home/insights` | Homepage: hero slides, product tiles, Why Prayag, Experience, figures & customer service, sponsors, insight cards |
| `pages/faq`, `pages/press`, `pages/privacy-policy` | FAQ tabs and answers, press coverage items, privacy policy body |
| `blog` + slug | Blog posts (the 148 imported articles plus new ones), each at `/<slug>` |

Products and categories are still managed under **Products** and **Categories** in the admin. Claude
can look them up but not edit them (see "Sync" for why).

Code: schemas and defaults in `src/lib/content/schemas.ts`, storage in `src/lib/content/store.ts`,
admin forms generated from the schemas (`src/lib/content/fields.ts`, `src/components/admin/content-editor.tsx`).

## Rules applied to every save

- **Validation.** The entry's zod schema checks types, required fields, valid emails and URLs. Script
  links (`javascript:`, `data:`) are rejected.
- **Sanitising.** HTML fields (FAQ answers, policy body, blog articles) lose scripts, frames, styles
  and inline event handlers.
- **Free URLs.** A new blog post's slug must not already be used by a page, product or category.
- **Audit log.** Each change is logged with who made it (admin email, or `claude-mcp`). Every page
  is refreshed straight away.
- **Undoing.** "Reset" restores the built-in content of an entry. Removing a blog post hides it,
  imported articles included.

## Every page: Markdown sections, SEO, and new pages

- **Existing pages** (Home, About, CEO profile, Plumbing Solutions, CPVC, HDPE, the product
  categories, the Inspiration pages, Contact, FAQ, …: all 39 in `src/lib/content/page-registry.ts`)
  keep their design. Admin → Content → **Pages** → a page lets you:
  - **Override SEO.** Set the page's SEO title and description (empty keeps the original).
  - **Add Markdown sections.** Each goes at the **top** (under the header) or the **bottom** (above
    the footer). Write it in the editor (Markdown / Preview, **Insert image**, **Load .md file**), or
    use **Add sections from .md files**: select several `.md` files plus their images and each file
    becomes a section. An optional header in the file sets `position` and `heading` (download the
    section template).
  - **Undo.** "Remove all sections and SEO changes" restores the page.
- **New pages**: Admin → Content → **Custom pages** → New page, or **Import .md files** (page
  template: `title`, `slug`, `metaTitle`, `description`, optional `bannerImage`/`bannerAlt`, then
  Markdown). They live at `/<slug>`, show the Prayag banner and are listed in the sitemap. Their
  slugs can't clash with pages, products, categories or blog posts.
- **Claude**: `list_pages`, `add_page_section`, `import_markdown_page`, plus
  `get_content`/`save_content`/`patch_content` with id `page-content` (key = page slug) or
  `custom-pages`.
- **Code**: each page file is wrapped with `withPageContent("<slug>", Page)` and its metadata with
  `withSeo`/`withSeoFn` (`src/lib/content/page-content.tsx`). Sections reuse the blog article
  typography (`.cms-md .pf-bd-content`). **A new page folder must be added to the registry and
  wrapped the same way.**

## Images and Markdown blog posts

- **Upload images.** Every image field in the admin has an **Upload** button. Uploads are checked by
  their content (JPEG, PNG, GIF, WebP or AVIF; up to 15 MB) and stored as WebP, at most 2000 px wide.
  They go in a `media/` folder next to the database, are served at `/media/<yyyy-mm>/<name>.webp`
  and survive deploys.
- **Import Markdown.** Admin → Content → Blog posts → **Import .md files**. Download the template,
  write one `.md` file per post, then drop the `.md` files and their images in together.
  - **Header.** The block between the two `---` lines holds `title`, `slug`, `date` (YYYY-MM-DD),
    `metaTitle`, `description`, `bannerImage`, `bannerAlt` and `related` (slugs of existing posts).
  - **Body.** The article is Markdown, below the header.
  - **Images.** A `bannerImage` or `![…](photo.jpg)` that names an uploaded file is linked to it
    automatically.
  - **Preview first.** **Preview** shows each post with its warnings. An existing slug is replaced
    only when "Replace existing posts" is ticked.
- **Claude** can do the same through `import_markdown_post`; `get_markdown_template` returns the
  format. Images must already be site paths or URLs, because uploading is done in the admin.

## Claude (local MCP server)

`scripts/mcp/prayag-content.mts` runs on this machine over stdio and edits the local database
(`data/prayag.db`, or `PRAYAG_DB_PATH`).

- **Claude Code:** the project's `.mcp.json` registers it as `prayag-content`. Approve it once when
  Claude Code asks, then ask things like "change the toll-free number in the footer" or "draft a
  blog post about choosing a kitchen sink".
- **Claude Desktop:** add to `claude_desktop_config.json`:
  ```json
  { "mcpServers": { "prayag-content": { "command": "npx",
      "args": ["tsx", "--env-file-if-exists=.env.local", "scripts/mcp/prayag-content.mts"],
      "cwd": "/path/to/ai-website-cloner-template-master" } } }
  ```

Tools: `list_content`, `get_schema`, `get_content`, `list_blog_posts`, `save_content`,
`patch_content`, `delete_content`, `list_products`, `get_product`. See changes with `npm run dev`
(pages render on each request in development).

## Sync between your laptop and the live server

Local edits (yours or Claude's) and live-admin edits are in two different databases.

- **Laptop → live.** `npm run deploy:package` writes `content-sync.json` and `media-sync/` (images
  uploaded locally) into the zip. The server copies images it doesn't have yet. When the server
  starts, it merges the file entry by entry, and **the newer edit wins**: anything changed in the live
  admin after your export is kept. The server then re-renders all pages from its own database.
- **Live → laptop.** Admin → Content → *Download content.json*, then
  `npm run content:import -- prayag-content-….json`. The same "newer wins" rule applies.

Do a live → laptop import before asking Claude for edits that build on recent live changes.

Products are not part of this sync: product rows differ between the two databases (imports, images,
relations), so product edits stay in the admin where they are made.

## Commands

| Command | Does |
|---|---|
| `npm run mcp:content` | Run the MCP server by hand (Claude starts it itself) |
| `npm run content:export -- out.json` | Write all edited entries to a sync file |
| `npm run content:import -- file.json` | Merge a sync file into the local database (newer wins) |
| `npm run db:migrate` | Create the `content_entries` table locally. Servers create it on first use. |
