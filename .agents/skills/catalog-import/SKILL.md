---
name: catalog-import
description: Rules for reconciling Prayag product data (Google Sheet, live site, Drupal taxonomy) into the catalog database. Use before changing products, categories, filters or the importer.
---

# Prayag catalog import rules

Read `docs/catalog/README.md` for commands. Code: `src/lib/catalog/` (reconcile.ts holds the rules).

**Sources, in order of trust**
1. Live product pages (via `data/catalog/live-products.json`) and live category listings
   (`membership.json`): the existing, verified catalog. Specs/sizes the live template fills with
   keyword "sample" rows are NOT data (dropped by `extract-live.py`); never reintroduce them.
2. Drupal taxonomy (`src/content/prayag/catalog/taxonomy.json`): the category tree and term names.
3. Google Sheet tabs (`sheet-tabs.json`): Category / Series / Design-Collection / Type columns define the
   mapping; tabs `abacus` and `Images done` are excluded; `Product Bifurcation` is an unfilled template.

**Matching**: item-code key (case/punctuation-insensitive) -> exactly one product. Title-only codes,
name-only matches and multiple candidates go to review. Never match on fuzzy similarity.

**Existing products**: change only categories and *empty* series/collection/type values, and only via
an `exact` or admin-`approved` label. A sheet category that is the live one or its ancestor is agreement
(keep the more specific live category). Conflicts with an existing attribute go to review. Content
(names, descriptions, images, specs, SEO) is never overwritten by the sheet. Blank sheet values keep live data.

**New products**: added as `draft` only with a verified category (a blank category needs an approved
`(blank)` tab default); only sheet fields; title = "CODE Type"; slug must not collide with a route.

**Safety**: preview first; apply only the previewed hash; backup + single transaction; re-run must
yield 0 changes; every change is in `import_changes` / `audit_log`. AI output is a suggestion only.
