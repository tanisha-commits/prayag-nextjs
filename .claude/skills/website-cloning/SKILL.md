---
name: website-cloning
description: Clone or fix a prayagindia.com page in this repo so it matches the live page 1:1 (layout, content, assets). Use when adding a missing Prayag page or when a local page differs from live.
---

# Prayag page cloning

The general workflow is `.agents/skills/clone-website/SKILL.md` (canonical; read it for new pages).
These are the project rules that override any default.

## Non-negotiable
- **Same design as live.** No custom cards, labels, layouts or "improvements". Extra data needs the
  user's approval and must fit the live design. Do not hide content to make something fit.
- Real live content and assets only. Never invent copy, prices, specs or dates. If something cannot
  be retrieved, record it in the day's QA report under missing assets.
- GET only against the live site. Never submit forms, log in, or write anything remote.
- Preserve the live URL spelling exactly (e.g. `/download-cataglogue`). Live redirects are mirrored
  in `next.config.ts` with the same status code.

## How pages are built here
- Routes: `src/app/(pages)/<slug>/page.tsx` (shared header/footer from `(pages)/layout.tsx`).
  Products, blog articles and category landings resolve through `src/app/(pages)/[slug]/page.tsx`.
- Components/data: `src/components/sites/prayag/<area>/`; content JSON in `src/content/prayag/`.
- Assets: download what the page references into `public/sites/prayag/` (GET from live only) and record
  them in `docs/research/prayag/<page>-assets.json`; check `file --mime-type` afterwards.
- Pixel-faithful theme CSS: copy the live page's used rules and scope them under one root class `.pcat-<name>`.
  Then render the live DOM (same class names) inside `<div className="pcat-<name>">` and import the CSS.
  Use relative hrefs (`/faucets`), never `https://prayagindia.com/...`, for internal links.
- SEO per page via `pageMetadata()` + `BreadcrumbJsonLd` from `src/components/sites/prayag/seo.tsx`,
  using the live title/description.

## Verify (required before calling a page done)
```bash
PLAYWRIGHT_DIR=$(npm root -g)/@playwright/cli node scripts/qa/compare.mjs <out-dir> /<path>   # heights per section, 1440 + 390
python3 -I scripts/qa/pixel-diff.py <out-dir>                                                  # % px differing + diff sheets
```
Open the `*-diff.png` sheets and look at them. A page is done when section heights match and the
remaining differences are explained (dev indicator, lazy-loaded icons, live-only data).
