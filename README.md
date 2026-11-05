# Prayag Polymers — prayagindia.com

The Prayag Polymers Limited website, built with Next.js 16 (App Router, React 19, TypeScript) and Tailwind CSS v4.

## Requirements

- Node.js 24 (see `.nvmrc`)

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: enquiry form forwarding settings
npm run dev                  # http://localhost:3000
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build (runs `scripts/images/image-dimensions.mjs` first) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run check` | Lint, typecheck and build |
| `npm run deploy:package` | Build with `BASE_PATH=/prayagindia` and package a standalone zip in `dist/` |

## Project structure

```
src/
  app/                      Routes (pages, API routes, sitemap, robots)
  components/sites/prayag/  Page sections and components
  content/prayag/           Page, blog and catalog content (JSON)
  lib/                      Catalog queries, enquiry handling, helpers
public/sites/prayag/        Images, fonts, video, PDFs and vendor assets
scripts/                    Build and deployment scripts
```

## Configuration

All settings are environment variables; see `.env.example`.

- `PRAYAG_ENQUIRY_FORWARDING` and the `PRAYAG_*` API keys forward the contact and dealership enquiry forms (server-side only).
- `BASE_PATH` serves the site under a sub-path, e.g. `/prayagindia` (build time).
- `NEXT_PUBLIC_SITE_URL` sets the canonical, Open Graph and sitemap origin (build time, default `https://prayagindia.com`).

## Deployment

The app builds with `output: "standalone"`.

- **Server zip:** `npm run deploy:package` writes `dist/prayagindia-<date>-<commit>.zip`. Unzip it on the server and run `node server.js`.
- **Docker:** `docker compose up app` builds and runs the production image on port 3000.
