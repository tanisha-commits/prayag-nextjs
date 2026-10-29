# /hdpe, /pvc-o-pipes, /agritech — port notes

Source: live HTML (taxonomy terms 221 / 218 / 219), content from `.breadcrumb_main` to `<footer>`.

## Behaviour actually in effect on the live pages
- `.ngp-features-slider`: the theme bundle has a Drupal behavior (autoplay 3 s, speed 420,
  breakpoints 1320/1200/992) but the page's inline script initialises the slider first, so the
  inline settings win (no autoplay; 4/3/2/1 at 1200/992/576). Verified on live: 4 slides at
  1250px, no autoplay after 3.6 s.
- Agritec fittings: the first inline script initialises both `.js-cfs-slider`s (3/2/1,
  adaptiveHeight); the second script then re-initialises only `#pane-nylon`'s with its own
  options (2 slides < 1200px, dots and no arrows < 768px). `#pane-brass` keeps the first settings.
- `.product_split_reveal_sec`: scroll-linked reveal from the theme `script.js` (ported as
  `SplitRevealSection`). `.main_filled_scrolled_sec` has no JS (static image).
- PVC-O "Read More" opens a Bootstrap 5.1.3 modal (Bootstrap bundle is loaded on the source).

## Source issues kept / handled
- Agritech `h1` is "Agritec" (sic); alt texts on the Agritec fitting cards are copy-pasted
  ("White Equal Tee", "Blue Coupler" …) — kept verbatim.
- Agritech has an orphan `#prayagReadMoreModal` with no trigger — kept, hidden.
- PVC-O icon SVGs all reuse `id="title"`/`id="desc"` with `aria-labelledby="title desc"`; ids and
  aria-labelledby dropped (the `<title>` child names each `role="img"`).
- PVC-O specs pane has `aria-labelledby="tab-pipes"` pointing at no element — dropped.
- hdpe/agritech have no meta description; none is emitted.
- Images without alt on the source (HDPE feature icons, Agritec hero + 4 application images)
  got `alt=""` (each sits next to its visible heading).

## Clone-side fixes
- `hdpe/preflight-reset.css`: Tailwind preflight makes img/svg `display:block`; source is inline
  (made the HDPE MDPE tiles 16px taller).
- `pvc-o-pipes/pvc-o-pipes-fixes.css`: Lightning CSS merges duplicate selectors in the generated
  page CSS and drops the earlier `!important` declarations (zebra rows, 600-weight first column).
- `pvc-o-pipes/bs-modal.css`: `.modal.show` / `.modal-backdrop` rules that pcat-base could not
  capture (only present while the modal is open).
