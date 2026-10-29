# /cpvc-plumbing-solution and /ugd-pipes-fittings: port notes

## Which slider settings apply
- The cPVC page HTML arrives from the server with `data-once="ngp-feature-slider"` and `data-once="cp-slider"` already set. Because of that, the theme's `Drupal.behaviors.ngpFeatureSlider` and `cpSlider` (script.js) skip both sliders, and the page's own inline script initialises them. That script uses speed 300 and these breakpoints: cp 1200→3, 768→2 (no arrows), 576→1; ngp 1024→3, 768→2 with dots, 576→1 with dots. The live page confirms it: both sliders show 3 slides at 820 px, which only the inline settings give.
- The UGD page has no inline script, so the theme behaviour applies: speed 420, 1320→3, 1200→2, 992→1, no dots.

## cp-slider dot count
- The source has **64** `.cp-card` items, not 16. Several cards repeat images: the "Full Turn" and "Long" concealed valves share two photos, and one card is titled "Pipe Sch 80 (Duplicate)".
- With slidesToShow 4, slidesToScroll 1 and infinite, slick builds 64 dots at every width. At ≥768 px the page CSS hides them (`.cp-slider .slick-dots { display: none !important }`). Below 768 px all 64 dots show and wrap over several rows. That is what the source shows, and the port reproduces it.
- The live track is very wide (about 50,000 px at 390) because slick lays out 64 real slides plus clones at full list width each.

## Source bugs kept as-is
- At 390 px the cPVC page has 105 px of horizontal overflow, live and local alike. It comes from the specs `thead` (the mobile card layout positions it absolutely) and from the ngp `.slick-dots`.
- The heading "Why Choose Prayag cPVC Casing</strong> Pipes?" has a stray `</strong>` and says "Casing". There are also typos: "Plumling Solution" and the anchor `#advanced_plumbling`.
- "Brass Elbow Kithchen Mixer.webp" is the file name on the source.
- On UGD, the image alt texts "UPVC Column Pipes" and "Premium Bathroom Basin" were copied over from other pages.
