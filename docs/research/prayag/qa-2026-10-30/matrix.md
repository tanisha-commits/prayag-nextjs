# Page-by-page verification matrix — 30 Oct 2026

Production build on localhost:3100. **Content/Desktop/Mobile** = live-vs-local capture (section heights + pixel diff at 1440 and 390). **Links** = page reached by the crawl and none of its links broken. **Responsive** = 375/390/768/1366/1440/1920: no sideways scroll, broken image, console error or failed request. **SEO** = title, canonical, robots, one h1, JSON-LD valid; heading order / missing descriptions that live shares are not counted as failures.

PASS* = section heights match live exactly; the remaining pixel difference is explained in Notes and was checked by eye.

| Page URL | Cloned | Content | Links | Desktop | Mobile | Responsive (6 widths) | SEO | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|
| `/` | PASS | PASS* | PASS | PASS* | PASS* | PASS | PASS | **PASS** | Pixel diff = hero video frame + live scroll-reveal effects not fired in the automated capture; section heights identical at 1440/390. |
| `/products` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/about-prayag` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/ceo-profile` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/sustainability` | PASS | PASS* | PASS | PASS* | PASS* | PASS | PASS | **PASS** | Pixel diff = live scroll-reveal sections not yet visible in the automated capture (checked visually); heights identical. |
| `/manufacturing-process` | PASS | NEEDS REVIEW | PASS | NEEDS REVIEW | NEEDS REVIEW | PASS | PASS | **NEEDS REVIEW** | NEEDS REVIEW: 390px capture of live misses scroll-revealed blocks; compare manually |
| `/dealership-enquiry` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/contact-us` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/blog` | PASS | NEEDS REVIEW | PASS | NEEDS REVIEW | NEEDS REVIEW | PASS | PASS | **NEEDS REVIEW** | Blog list −17px: compare newest posts with live |
| `/press-coverages` | PASS | PASS* | PASS | PASS* | PASS* | PASS | PASS | **PASS** | Pixel diff = live gallery lazy-loading/reveal in the capture; heights identical. |
| `/product-video` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/video-tv-advertisement` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/feedback-videos` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/warranty-policy` | PASS | NEEDS REVIEW | PASS | NEEDS REVIEW | NEEDS REVIEW | PASS | PASS | **NEEDS REVIEW** | NEEDS REVIEW: live 301-redirects this URL to / and links the PDF directly; local keeps the page added in an earlier session |
| `/download-cataglogue` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/faq` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/privacy-policy` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/prayag-ka-bablu-plumbers-loyalty-program` | PASS | PASS* | PASS | PASS* | PASS* | PASS | PASS | **PASS** | Pixel diff = live `.reveal` scroll animations not fired in the capture; heights identical. |
| `/plumbing-solutions` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/hdpe` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** | Lighthouse SEO 92 (as live) |
| `/agritech` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/swr-plumbing-solution` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/cpvc-plumbing-solution` | PASS | NEEDS REVIEW | PASS | NEEDS REVIEW | PASS | NEEDS REVIEW | PASS | **NEEDS REVIEW** | 390px: 28px sideways scroll from slider dots (live: 105px); thead part fixed |
| `/casing-pipes` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/composite-pipes` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/ugd-pipes-fittings` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/upvc-column-pipes` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/ppr-pipes` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/pvc-o-pipes` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/faucets` | PASS | NEEDS REVIEW | PASS | NEEDS REVIEW | NEEDS REVIEW | PASS | PASS | **NEEDS REVIEW** | NEEDS REVIEW: +1 product row (7894 published locally, not in live listing); live content images lazy-load late in capture |
| `/ptmt-taps` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/ceramicware` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/kitchen-sinks` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/water-heaters` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/storage-tank` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/bathroom-accessories` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/hardware` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/pipes-fittings` | PASS | PASS | PASS | PASS | NEEDS REVIEW | PASS | PASS | **NEEDS REVIEW** | NEEDS REVIEW: filter shows local subcategories under live labels; live "Plumbing Pipes/CPVC" vocabulary not in catalog; Pipe Clip uncategorised |
| `/traps` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |  |
| `/search/node` | PASS | PASS | PASS | PASS | PASS | PASS | PASS (noindex) | **NEEDS REVIEW** | Result ranking/snippets differ from Drupal; static pages not indexed; noindex by design |
| `/double-bowl-kitchen-sink-price` | PASS | PASS | PASS | PASS | PASS* | PASS | PASS | **PASS** | 390px: −6px / 5% px from text wrapping in article body; visually equivalent. |
| `/signs-your-pipes-need-replacement` | PASS | NEEDS REVIEW | PASS | NEEDS REVIEW | NEEDS REVIEW | PASS | PASS | **NEEDS REVIEW** | +77px at 1440: check article body spacing |

## Template pages

| Group | Count | Cloned | Verification | Status | Notes |
|---|---|---|---|---|---|
| Product detail pages (`/<product-slug>`) | 761 published | PASS (live `.pp` template) | 14 compared live-vs-local; 9 within a few px, the rest differ by catalog data only. All 761 crawled for links (0 broken) and audited for SEO. ~1,800 page-widths swept at 375/1440 | **NEEDS REVIEW** | Data gaps listed in qa-report.md (Applications, sample spec rows not shown, colour order on 33, categories live does not show) |
| Blog articles (`/<article-slug>`) | 148 | PASS | 2 compared live-vs-local; all crawled (0 broken links) and SEO-audited | **PASS** | Live-domain links in bodies rewritten to local paths; malformed source links kept as on live |
| Legacy URLs (redirects) | 31 | PASS | Each returns the same status code and target as live | **PASS** | |
