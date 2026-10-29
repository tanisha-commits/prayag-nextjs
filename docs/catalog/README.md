# Product catalog: database, admin and import

The catalog (categories, products, filters, add-ons, import history, audit log, admin users) lives in a
local **SQLite** database accessed with **Drizzle ORM**. The public pages, filters and the admin all
read it; Redux only holds client UI state (the current listing query/result). Nothing here deploys
anything.

## Local setup

```bash
npm install --engine-strict=false        # Node 22 works; the project targets 24
cp .env.example .env.local               # then fill in the values below (never commit .env.local)
npm run db:migrate                       # creates data/prayag.db and applies drizzle/*.sql
npm run admin:create                     # first admin: prompts for email, name, password (hidden)
npm run dev                              # http://localhost:3000 — admin at /admin
```

`.env.local` values:

| Variable | Purpose |
|---|---|
| `PRAYAG_DB_PATH` | SQLite file (default `data/prayag.db`) |
| `BETTER_AUTH_SECRET` | 32+ random bytes, e.g. `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Site origin, `http://localhost:3000` locally |
| `PRAYAG_AI_PROVIDER`, `PRAYAG_AI_API_KEY`, `PRAYAG_AI_MODEL` | Optional; empty = no language model (rules-based checks still work) |

**First admin.** `npm run admin:create` asks for the password with echo off (12–128 characters), so it
never appears in code, files or shell history. Running it for an existing email only grants the admin
role. There is no public sign-up and no default account.

## Security model

- Better Auth (email + password, admin plugin): HttpOnly session cookies, scrypt password hashing,
  origin checks on auth endpoints, sign-in rate limit (5 per 5 minutes, stored in the database).
- `src/proxy.ts` only redirects `/admin/*` to the login when no session cookie exists. Real checks are
  server-side: the admin layout and every admin read (`src/lib/admin/data.ts`) and action
  (`src/lib/admin/actions.ts`) call `requireAdmin()` (role `admin`, not banned).
- Admin mutations are server actions (POST, same-origin check by Next.js), validated with zod,
  written in a transaction with an `audit_log` row, then the affected pages are revalidated.
- Stored rich text is sanitised (`src/lib/catalog/sanitize.ts`). The public API
  (`/api/catalog/products`) returns only published products and public fields.

## Data sources and import

| Source | File (git-ignored under `data/catalog/`) | Produced by |
|---|---|---|
| Live product pages (761) | `live-products.json` | GET crawl + `scripts/catalog/extract-live.py` |
| Live category / filter memberships | `membership.json` | GET crawl of the category listings |
| Google Sheet "prayag updated" (11 tabs) | `sheet-tabs.json` | Chrome download from the signed-in sheet |
| Drupal category taxonomy | `src/content/prayag/catalog/taxonomy.json` (committed) | SQL dump (product tables are not in the dump) |
| Label decisions | `src/content/prayag/catalog/label-mappings.json` (committed) | admins |

```bash
npm run catalog:import -- seed            # categories + live products; insert-only, re-runnable
python3 -I scripts/catalog/copy-assets.py data/catalog/live-products.json <backup-root> docs/research/prayag/catalog-assets.json
npm run catalog:import -- assets          # point stored image paths at the local copies
npm run catalog:import -- preview         # reconcile the sheet -> data/catalog/reports/run-<n>-preview.md
npm run catalog:import -- apply <n>       # apply that preview (backup + one transaction + re-check)
```

The same preview/apply is available in the admin under **Import** (typed `APPLY` confirmation).
`apply` refuses when the sources, the label decisions or the catalog changed since the preview, copies
the database to `data/backups/` first, and re-runs the reconciliation afterwards (it must find 0
remaining changes). Rules are summarised in `.agents/skills/catalog-import/SKILL.md`.

### Deciding labels

`label-mappings.json` holds one decision per sheet label (not per row):

```json
{ "labels": [
  { "tab": "CP", "field": "category", "label": "Faucet", "categoryTid": 1, "decision": "map" },
  { "tab": "CP", "field": "type", "label": "*", "decision": "accept" },
  { "tab": "CP", "field": "series", "label": "7000-6000", "attribute": { "key": "series", "value": "6000-7000" }, "decision": "map" },
  { "tab": "Hardware", "field": "category", "label": "(blank)", "categoryTid": 24, "decision": "map" },
  { "tab": "PTMT", "field": "collection", "label": "Prestige Series", "decision": "skip" }
] }
```

`categoryTid` is the Drupal term id from `taxonomy.json`; `"*"` decides a whole attribute column;
`(blank)` is the category for *new* products whose sheet category is empty; `skip` keeps the live value.

## Tests

`npm test` (Vitest): matching, category-only updates, specificity, duplicates, idempotent seed/apply,
filter combinations. `npm run check` = lint + typecheck + build.
