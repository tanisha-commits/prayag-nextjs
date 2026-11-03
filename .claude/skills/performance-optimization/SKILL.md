---
name: performance-optimization
description: Measure and improve Core Web Vitals / Lighthouse scores of the Prayag clone (LCP, CLS, TBT, images, fonts, JS) without changing its design. Use when asked about page speed or PageSpeed scores.
---

# Prayag performance

## Measure (always before and after, on the production build)
```bash
npm run build && PORT=3100 npm start      # never measure `next dev`
npx -y lighthouse@12.8.2 http://localhost:3100/<path> --quiet --chrome-path=/usr/bin/google-chrome \
  --chrome-flags="--headless=new" --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path=<out>/<name>-mobile.json
# desktop: add --preset=desktop
```
Record score + LCP/CLS/TBT/FCP/SI per page and form factor. Localhost has no CDN, HTTP/2 or
compression parity with production; say so when reporting.

## Allowed optimisations
- Prioritise the real LCP element (`fetchPriority="high"`, no `loading="lazy"` on it); lazy-load
  below-the-fold images; explicit width/height or aspect boxes to stop layout shift.
- `next/image` only where the rendered box is identical to the source markup.
- Fonts: local Graphik via `next/font/local` (already `display: swap`); preload only weights used above the fold.
- Move client components to server components when they hold no state; dynamic-import heavy,
  below-the-fold interactive parts (sliders, video players).
- Cache headers for `/sites/prayag/**` static assets.

## Not allowed
- Changing the design, removing sections, videos, sliders or animations to gain points.
- Removing code without confirming it is unused (grep imports, run typecheck/build).
