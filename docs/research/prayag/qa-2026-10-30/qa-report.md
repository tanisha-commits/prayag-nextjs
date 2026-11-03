# Prayag clone — QA and handover report, 30 October 2026

Local only. Nothing was pushed, deployed or written to any live system; every request to
prayagindia.com was a GET (forms and trackers were blocked in the test browsers). Database: local
SQLite only; no product data was changed today (all catalog differences below are listed for approval).

- Page-by-page matrix: [`matrix.md`](matrix.md)
- Lighthouse before/after: [`lighthouse.md`](lighthouse.md)
- Morning state and backups: [`progress.md`](progress.md)

## How to run and compare

```bash
cd /home/tanisha/Desktop/prayag/ai-website-cloner-template-master
npm run build && PORT=3100 npm start      # production build — http://localhost:3100  (use this for review)
npm run dev                                # dev server — http://localhost:3000 (shows local DRAFT products, PRAYAG_PREVIEW_DRAFTS=1)
```

Manual comparison: open the same path on `https://prayagindia.com<path>` and `http://localhost:3100<path>`
side by side (or with DevTools device mode at 375 / 390 / 768 / 1366 / 1440 / 1920).
Automated comparison (screenshots + per-section heights + pixel-diff sheets):

```bash
export PLAYWRIGHT_DIR=$(npm root -g)/@playwright/cli QA_BASE=http://localhost:3100
node scripts/qa/compare.mjs /tmp/cmp /faucets /6102-rg-pillar-cock     # writes *-live.png, *-local.png
python3 -I scripts/qa/pixel-diff.py /tmp/cmp                             # writes *-diff.png (live | local | red = differences)
node scripts/qa/responsive.mjs /tmp/resp.json --widths=375,1440 --all    # every sitemap page
node scripts/qa/links.mjs http://localhost:3100 /tmp/links.json          # link integrity
node scripts/qa/seo.mjs   http://localhost:3100 /tmp/seo.json            # technical SEO
```

Note: live pages use scroll-reveal animations and lazy images; an automated capture can show them
blank. Section heights are the reliable signal; check pixel differences by eye.

## What was done today

**Missing pages and URLs**
- `/products` (category grid) and `/search/node` (site search with keyword results, no-result state, Drupal pager) cloned on the live markup + captured CSS. The header search icon now goes to `/search/node?keys=products`, as on live; the earlier local `/search` redirects there.
- `/pipes-fittings` and `/traps` moved from a generic local layout to the live design.
- 31 legacy URLs redirect exactly as live does (same target, same 301/302): `/cpvc-0`, `/cpvc`, `/plumber-bablu`, `/latest-faqs`, `/node/947`, `/search/node/help`, `/PVC-O%20Pipes`, `/storage-tanks`, `/ba-45-soap-dish-0`, `/bos-41ss-over-head-shower-0`, 10 renamed `-q-` → `-qp-` products, `/taxonomy/term/*`, and one retired blog URL.
- **Product detail pages (761)** rebuilt on the live product template (gallery, tags, colours, highlights, features, Description/Specifications/Sizes tabs, Downloads & Support, About, product guide, FAQ, related-products slider, mobile sticky Enquire bar) with live's JavaScript behaviour ported. Before, they used a custom layout and showed grey "1000 × 1000" placeholders.

**Bugs fixed**
- Every category landing (`/faucets`, `/kitchen-sinks`, …) returned **HTTP 500 in production builds** (dev worked). Cause: they rendered inside the statically generated `[slug]` route and read query parameters. They now have their own route files.
- 1,054 links on local pages pointed to the live domain (contact page card, blog bodies, plumbing pages); now 8 remain, all malformed/retired links that appear identically on live or privacy-policy text naming the website.
- Sideways scrolling: tablet product grid at 768–1000px on all six filter category pages, and the mobile specs tables on 10 plumbing pages. Both bugs exist on live; fixed with rules that change nothing where the layout already fits.
- Keyboard focus was invisible on product pages (source sets `outline: 0`); a ring now shows for keyboard focus only.

**SEO**: `sitemap.xml` (948 URLs, production origin), `robots.txt` (admin, API and search excluded), live titles/descriptions for the 10 category landings, homepage Organization/LocalBusiness/WebPage/WebSite structured data copied from live (no prices, ratings or new facts), nested local-only category URLs set to `noindex`. Canonicals always use `https://prayagindia.com` (overridable with `NEXT_PUBLIC_SITE_URL`), never localhost.

**Performance**: homepage images no longer pre-download on every page (React preload hints travelled with link prefetches — ~3.5 MB per page), below-the-fold homepage images lazy-load, banners/product/category images get responsive sizes through the Next.js image optimizer (same `<img>` markup), fonts are no longer all preloaded, 30-day caching for `/sites/prayag/**`.

## Results

| Check | Result |
|---|---|
| Live sitemap coverage | 928/928 live sitemap URLs have a local destination (page or identical redirect), except 2 that are **403 "Access denied" on live** (`/where-buy-isi-certified-bathroom-accessories-online-india`, `/ba-47-robe-hook`) and stay 404 |
| Visual match (42 static/category/sample pages, 1440 + 390) | 36 PASS, 9 NEEDS REVIEW, 0 FAIL — see matrix |
| Links (1,799 pages crawled, 3,243 URLs checked) | **0 broken, 0 redirect hops, 0 `#` links, 0 localhost links**; 8 live-domain links (source content) |
| Responsive, final build (48 key pages × 6 widths = 294) | 0 broken images, 0 console errors, 0 failed requests; 1 overflow (cpvc slider dots, 28px; live 105px) |
| Responsive, whole site at 375 + 1440 | ~1,800 page-widths, no findings except the cpvc page (since fixed) and transient network errors |
| SEO (948 sitemap pages) | Unique canonical per page, valid JSON-LD, 1 h1 each, robots OK, unknown URL → **404**. Remaining items all mirror live: heading-level skips (live markup), 104 product pages + `/traps` without a meta description (live has none), 14 duplicate product titles (live's `-0` duplicates), 13 images without alt inside blog content |
| Accessibility (Lighthouse) | 95–98. Findings are live's own design: contrast, heading order, slider-dot target size, redundant alt texts. Keyboard: header, mega menu, product page and forms reachable with visible focus; all contact form inputs labelled |
| Typecheck / lint / unit tests / production build | pass / pass / 37 passed / pass |

### Performance (Lighthouse 12.8.2, production build on localhost)

Desktop after: 87–100 (home 87, everything else 96–100). Mobile after: 54–75.
Mobile LCP fell roughly 2–3× on most pages (e.g. `/products` 22.0 s → 6.2 s, `/about-prayag` 13.4 s → 5.5 s,
home 16.7 s → 11.6 s) and TBT fell on 8 of 10 pages. **Not 100/100.** Trade-off: without font preloading,
first paint is ~1 s later and two pages (`/faucets` 65 → 60, `/hdpe` 66 → 56) scored lower in single runs.
Remaining mobile limits: React's 228 KB runtime (~0.6–1.8 s CPU under 4× throttling), the homepage
hero video, multi-MB source PNGs in blog/plumbing banners, and localhost lacking CDN/HTTP2/Brotli —
PageSpeed Insights on the deployed site will differ. Full table in [`lighthouse.md`](lighthouse.md).

## Missing assets

None today: every asset referenced by the new pages was copied (the Drupal backup drive is not
mounted today, so files came from the live site by GET; types checked). Full-site sweep: 0 broken images.
Not retrievable from live: the 2 pages above that live itself answers 403.

## NEEDS REVIEW / incomplete — your decision needed

1. **Pipes & Fittings filter**: live filters on a "plumbing category" vocabulary (Plumbing Pipes › CPVC / UPVC / OPVC, Agriculture, Sewerage Drainage) that the catalog does not hold; local shows its own subcategories under live's labels. Matching it needs new categories + product assignments (catalog change).
2. **Product data gaps vs live** (no data changed without approval):
   - live "Applications" icon lists were never imported (e.g. `/123-d-bib-cock`, `/coupler`, `/bromo-vertical`);
   - live's generated "sample" specification/size rows are intentionally not shown (catalog-import rule) — live shows them;
   - 33 products store colours in a different order;
   - "Pipe Clip" has no category, so it is missing from `/pipes-fittings`;
   - local `/faucets` lists 7894 (published locally, not in live's listing).
3. **`/warranty-policy`**: live 301-redirects it to the homepage and links the PDF directly; local keeps the Warranty page added in an earlier session. Keep or mirror live?
4. **Search** (`/search/node`): same design, but result order/snippets cannot match Drupal's index exactly; product results show no date (not stored); static pages are not searchable.
5. Pages to check by eye: `/manufacturing-process` at 390px (live capture blocked by animations), `/blog` (−17px: compare newest posts), `/signs-your-pipes-need-replacement` (+77px at 1440), `/cpvc-plumbing-solution` slider dots at 375px.
6. Mobile product pages: the sticky "Enquire Now" bar stays above the open menu drawer — confirm live behaves the same.
7. Very large source images (`2026-10/Group-38.png` 15 MB, `Group-40.png` 11 MB, several 3–5 MB blog PNGs) — pre-resizing them would help mobile speed and server load (asset change, needs approval).
8. The local test admin `admin.test@prayag.localhost` (created 29 Oct) still exists — remove when done.

## Project skills (Phase 2)

Created in `.claude/skills/`: `website-cloning` (wraps the existing canonical `.agents/skills/clone-website`),
`responsive-qa`, `seo-audit`, `performance-optimization`, `link-integrity`, `accessibility-qa`, each wired
to the scripts in `scripts/qa/`. Nothing third-party was installed into the project; Lighthouse 12.8.2
(Google) was installed only in a temporary folder for measuring. The skills became loadable mid-session:
`seo-audit`, `responsive-qa`, `performance-optimization` and `accessibility-qa` were invoked through the
skill tool; `website-cloning` and `link-integrity` steps were followed from their SKILL.md (they were not
yet loadable when that work ran).

## Files changed today

New: `src/app/(pages)/products/`, `src/app/(pages)/search/node/`, 10 category route folders, `src/app/sitemap.ts`,
`src/app/robots.ts`, `src/lib/search.ts`, `src/components/sites/prayag/{products,search}/`,
`catalog/product-page/`, `catalog/category-page/{pipes-fittings,catalog-fixes}.css`, `responsive-image.ts`,
`scripts/qa/`, `.claude/skills/`, this folder. Modified: `next.config.ts` (redirects, cache headers), root and
homepage metadata, `seo.tsx`, `catalog-route.tsx`, `public.ts`/`queries.ts` (related range, attribute order),
`blog.ts` (local links), plumbing page CSS/links, `prayag-category-pages.py` (meta + per-slug merge).
Removed: the unused custom `catalog/product-view.tsx` (kept in the morning backup tarball).
Backups: `data/backups/prayag-before-qa-20261030-1001.db`, `data/backups/worktree-before-qa-20261030-1001.tgz`.
