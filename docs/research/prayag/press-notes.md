# Press Coverages — migration notes

Source: https://prayagindia.com/press-coverages (node 60, template `page--node--60.html.twig`, paragraph field
`field_media_associations`). Clone: `/press-coverages`, data `src/content/prayag/press/items.ts` (96 items, source order).
Assets: 97 files (96 scans + banner) copied from the Drupal backup — `press-assets.json`; 0 missing; types
55 webp / 17 jpeg / 25 png, extensions match content.

## Behaviour on the source (checked live, 2026-10-28)
- Card image = `<a data-fancybox="gallery0">` → Fancybox v4 gallery of all 96 images (counter, zoom, slideshow,
  full-screen, thumbnails, close; arrows loop; URL hash `#gallery0-N`; Esc closes).
- `.press_clickable` / `data-link` have **no handler** (no script references them; clicking the card does nothing).
- "Know More" `href` = `field_uploaded_media_link`: 21 real URLs, 10 `internal:#.` (broken Drupal value — the
  browser cannot open it), 65 empty (`href=""` + `target=_blank` → opens the same page in a new tab).

## Clone decisions
- Lightbox reimplemented without dependencies (`press-lightbox.tsx`): same layout/sizes as Fancybox, counter,
  slideshow (3 s), full-screen, thumbnail toggle + strip, close, looping prev/next, ←/→/Esc, swipe, click outside
  closes, focus trap, focus returned to opener, body scroll lock, `#gallery0-N` hash (deep links open the image).
  Not reproduced: Fancybox zoom/pan button and slide-to-slide sliding animation (fade/zoom-in instead).
- "Know More": the 21 real URLs open in a new tab with `rel="noopener noreferrer"`; the 75 empty/`internal:#.`
  ones open that item's image in the lightbox (href = image, so it also works without JS). No article URLs invented.
- One source URL ends with `" ("` (data-entry typo):
  `https://constructionnarchitecture.com/prayag-india-launches-advanced-pvc-o-pipes-for-next-gen-water-transport-solutions/ (`
  → trimmed to end at `/`. (Both variants answered 406 to a scripted GET — bot protection — so not verifiable.)
- Mobile (<768): source cards are fixed 280 px tall and long titles overflow into the next card (reproduced 1:1,
  including the `.container-fluid { overflow: hidden }` clipping).
- Three items have an empty title (cards 46, 50, 51): rendered as an empty spacer (no empty heading); their
  image link gets the label "Press coverage N".

## Dates (reproduced verbatim — content issues for the owner)
The template prints `<publication name> | <date>` where the date is the paragraph's **created** timestamp (entry
date), not the publication date; the publication-name field is empty everywhere, hence the leading "| ".
- Placeholder-like: 20 × "2nd,Aug - 2025", 14 × "6th,Sep - 2024", 12 × "27th,Jun - 2025", 12 × "27th,Dec - 2024",
  11 × "28th,Feb - 2025", 8 × "7th,Sep - 2024" (batch-entry dates).
- Impossible dates: cards 1–11 show "2nd,Aug - 2025" but their files were uploaded in 2025-09/2025-11 and titles
  say "24.9.25" / "June 2025" / NDTV conclave.
- Old coverage shows entry dates, e.g. "The Political and Business Daily 16 May 2016" → "7th,Sep - 2024".
- Duplicate titles (different scans): Business Standard ×4, Lokmat Times ×3, and ×2: A&I India- Special Feature-
  Bathroom Story, The Print, The Tribune, Dainik Bhaskar, Realty & More, Construction Xperts, ANI. No duplicate images.
