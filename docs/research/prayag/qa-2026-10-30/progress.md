# Prayag clone — progress report, 30 October 2026

Local only. Nothing pushed, deployed or written to any production system.

## Starting state (Phase 1)

- Working directory: `/home/tanisha/Desktop/prayag/ai-website-cloner-template-master` (Next.js 16.3.5, React 19, SQLite via Drizzle).
- Database: local SQLite `data/prayag.db` only (no remote/production database is configured).
- Last commit `0f62e35`; uncommitted work from 29 Oct = live-design rebuild of the 8 category pages
  (`src/components/sites/prayag/catalog/category-page/`, `category-pages.json`, `scripts/prayag-category-pages.py`)
  plus a `/search` page. typecheck, lint and 37 tests passed before any change today.
- Backups taken before any change:
  - `data/backups/prayag-before-qa-20261030-1001.db` (SQLite online backup)
  - `data/backups/worktree-before-qa-20261030-1001.tgz` (every modified + untracked file)
- Live sitemap: 928 URLs. Local coverage at start: 892 return 200, 36 do not (see below).

### The 36 sitemap URLs missing locally at start

| Live behaviour | URLs | Action |
|---|---|---|
| 301 redirect | `/cpvc-0`, `/plumber-bablu`, `/latest-faqs`, `/cpvc`, `/ba-45-soap-dish-0`, `/bos-41ss-over-head-shower-0`, 10× `/<n>-q-<type>` → `/<n>-qp-<type>` | add identical redirects |
| 302 redirect to `/` | 16× `/taxonomy/term/<id>` | add identical redirects |
| real page | `/products`, `/search/node` | clone |
| 403 "Access denied" on live | `/where-buy-isi-certified-bathroom-accessories-online-india`, `/ba-47-robe-hook` | no source content; stay 404 (documented) |

Linked from live pages but not in the sitemap: `/node/947` (301 → `/`), `/PVC-O%20Pipes` (301 → `/pvc-o-pipes`),
`/search/node/help` (301 → `/`) — add the same redirects.

## Checklist

- [x] Phase 1 — inventory, backups, coverage baseline
- [x] Phase 2 — six project skills in `.claude/skills/` + QA scripts in `scripts/qa/`
- [x] Phase 3 — `/products`, `/search/node`, `/pipes-fittings`, `/traps`, 761 product pages on the live template, live redirects
- [x] Phase 4 — link integrity: 0 broken / 0 `#` / 0 localhost links
- [x] Phase 5 — responsive: 6 widths on key pages, 2 widths site-wide; overflow fixes
- [x] Phase 6 — technical SEO: sitemap, robots, category meta, homepage structured data
- [x] Phase 7 — performance: measured before/after (not 100/100 — see lighthouse.md)
- [x] Phase 8 — full QA: matrix.md (36 PASS, 9 NEEDS REVIEW, 0 FAIL)
- [x] Phase 9 — handover: qa-report.md
