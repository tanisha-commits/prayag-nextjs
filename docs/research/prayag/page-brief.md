# Prayag homepage — page brief

Source: https://prayagindia.com/ (Drupal 10, theme `themes/custom/prayag`, template `page--homepage.html.twig`)
Captured: 2026-10-28. Local route: `/` → `src/app/page.tsx`.

Comparison images (left = source, right = local): `docs/design-references/prayag/cmp-*.jpg`.
Source → local asset map: `asset-map.json` (61 files; 58 copied from the local Drupal backup, 3 downloaded from the live site because the page uses Drupal image-style derivatives or the file is absent from the backup).

## Global

| Item | Value |
|---|---|
| Font | Graphik 300/400/500/600/700 (woff2 from the Drupal theme), body 18px / 28.8px, `#212529` |
| Container | `.container-fluid`: 90px side padding >1320px, 60px 769–1320px, 12px ≤768px (`prayag-container` utility) |
| Grid | Bootstrap 5 rows/cols, 24px gutters (rebuilt as `-mx-3` rows + `px-3` cols) |
| Breakpoints | sm 576, md 769, lg 991 (desktop nav), xl 1200, 2xl 1321 (overridden in `globals.css`) |
| Button `.prayag-btn` | black pill, radius 28, 13/40/13/35 padding, 18px/24 500, arrow SVG; hover: `linear-gradient(135deg,#0056b3,#004085)` + translateY(-2px) |

## Sections (desktop 1440 offsets; page height 6035 on both)

1. **Header** — absolute, transparent, white text/logo; on hover → white bg, black text; after scrollY > 90 → fixed, white, 70px tall, `stickyTransition` slide-in. Left: category hamburger + logo (logo.png, CSS `brightness` filter for white/black). Right: Products / Inspiration / Blog / About / Contact (+ carets) and search. Mega menus are full-width white panels: links (Products in 2 columns) + thumbnail image.
   Below 991px: static white bar, centred brand, burger at right that opens an accordion menu with +/− toggles.
2. **Category drawer** (`.pm-panel`) — 380px off-canvas from the left with blurred backdrop: HDPE "New" card, Prayag Ka Bablu App card, Plumbing Solutions `<details>` with 10 sub-categories, Quick links, social footer. Closes on ×, backdrop, Escape. Scroll lock ≤991px.
3. **Hero video slider** — 16:7 (4:3 ≤768). 3 slides; poster `<picture>` (desktop/mobile art direction) cross-fades to a muted webm once playable; advances on video `ended`; next button, dots, sound toggle. First video loads on `requestIdleCallback`.
4. **Explore Our Products** — `rgba(221,221,221,.47)` bg, 9 tiles (Pipes & Fittings hidden by source CSS), 3 cols desktop / 2 cols mobile (132px tall, last tile centred), gradient overlay, zoom on hover.
5. **Why Prayag** — image + 5 icon points + Know More; right image offset 150px (sticky inside overflow-hidden container = static offset); right image hidden on mobile.
6. **Experience Prayag** — black, 700px; text left, two image marquees (20s linear, one up, one down). 370px tall on mobile.
7. **Stats / Customer Service** — #f2f2f2 stats box (5 / 4500+ / 1600+), #141414 service box, photo; 350px tall.
8. **Fueling India's Sporting Spirit** — heading + copy; slick carousel: 13 logos, 4/4/3/2 per view (≥768/≥576/<576), autoplay 2s, 500ms slide, infinite, pause on hover; slide 315px with 22px total side padding → 271px box.
9. **Our Latest Insights** — 3 latest blog cards (300px images, 180px ≤991), "View all Insights" (hidden mobile).
10. **Footer** — #171717; Follow Us (social icons), Products / Media / Information / Get In Touch columns; copyright + "Developed by AbacusDesk".

Not rendered: `section.stay_touch` (present in HTML, `display:none` on the live site).

## Known source quirks reproduced deliberately

- Category hamburger lines are white when the header isn't hovered — on mobile (white header) they are invisible until tapped.
- Desktop nav wraps onto two lines at ~991–1200px widths.
- "Folllow Us On" (triple l) and the first insight title ending in ".webp" are verbatim source text.
- Extra space between "Inspiration" and its caret (whitespace in the source markup).
