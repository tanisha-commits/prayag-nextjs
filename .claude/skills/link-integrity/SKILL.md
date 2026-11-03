---
name: link-integrity
description: Crawl the Prayag local site and verify internal links, navigation, redirects, assets and PDFs — no broken links, no "#" links, no links to the live domain or localhost. Use after adding pages or changing navigation.
---

# Prayag link integrity

```bash
node scripts/qa/links.mjs http://localhost:3000 <out.json>
```
Starts from `/sitemap.xml`, follows every internal `<a>` and checks every `img/source/video/iframe/link`
reference. Reports `broken`, `redirected`, `hash`, `toLive`, `toLocal`, `undiscovered`.

## Rules
- Internal links are relative (`/faucets`). A `https://prayagindia.com/...` href on a local page is a
  bug unless it is deliberately external content (none expected); canonicals/JSON-LD are not links.
- Never link to `localhost`.
- No `href="#"` placeholders; a control that is not a link should be a `<button>`.
- Nav/footer/CTA links must not hit a redirect; legacy URLs may (they mirror live's redirects).
- A broken target that also 404s/403s on live: keep the link as live has it only if live shows the
  link; record it in the report. Never invent a page to satisfy a link.
- Live is the reference for URL spelling — compare with `curl -s -o /dev/null -w '%{http_code} %{redirect_url}' https://prayagindia.com<path>`.
- Manually click through: header mega menu, mobile drawer, footer, a category → product → category
  round trip, blog list → article → related article, search, catalogue PDF download.
