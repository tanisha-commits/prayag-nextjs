---
name: seo-audit
description: Technical SEO audit for the Prayag Next.js clone — titles, descriptions, canonicals, headings, alt text, Open Graph, structured data, robots, sitemap, status codes. Use before handover or after adding pages.
---

# Prayag technical SEO

```bash
node scripts/qa/seo.mjs http://localhost:3000 <out.json>
```
Checks every URL of the local `/sitemap.xml`, then duplicates, robots.txt and 404 handling.

## Where things live
- `src/components/sites/prayag/seo.tsx`: `SITE_URL` (production origin, `NEXT_PUBLIC_SITE_URL`
  override, default `https://prayagindia.com`), `pageMetadata()` (absolute title, description,
  canonical, Open Graph) and `BreadcrumbJsonLd`.
- `src/app/sitemap.ts`, `src/app/robots.ts`, live redirects in `next.config.ts`.
- Product JSON-LD in `src/components/sites/prayag/catalog/catalog-route.tsx`.

## Rules
- Use the live page's own title and meta description. Do not rewrite copy for SEO unless asked.
- Canonicals and structured-data URLs always use the production origin, never localhost.
- Structured data: only facts stored in the catalog/content. **Never** add price, offers, rating,
  review, availability or business details that are not on the live site.
- Search results, admin and API stay out of the index (`noindex` + robots disallow); nothing else
  may be noindexed by accident. Nested category URLs that live redirects are not indexable here.
- Unknown URLs must answer HTTP 404 (not 200 with a "not found" page).
- Do not change URL structure; preserve the live slugs exactly.
