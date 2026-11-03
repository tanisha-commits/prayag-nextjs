# Lighthouse 12.8.2 — before / after, 30 Oct 2026

Production build (`next build && next start`) on localhost:3100, Lighthouse default throttling (mobile = simulated slow 4G + 4x CPU; desktop preset). Localhost has no CDN/HTTP2/Brotli, so absolute numbers differ from PageSpeed Insights on the deployed site; the before/after delta is what these show.

| Page | Form | Perf before → after | LCP before → after | TBT before → after | FCP before → after | CLS after | A11y | Best pr. | SEO |
|---|---|---|---|---|---|---|---|---|---|
| `/` | desktop | 80 → **87** | 3.4 s → 2.0 s | 90 ms → 90 ms | 0.3 s → 0.5 s | 0.1 | 95 | 100 | 100 |
| `/` | mobile | 50 → **54** | 16.7 s → 11.6 s | 1,010 ms → 730 ms | 1.0 s → 2.2 s | 0.001 | 95 | 100 | 100 |
| `/products` | desktop | 81 → **96** | 3.5 s → 1.4 s | 80 ms → 40 ms | 0.3 s → 0.5 s | 0.001 | 98 | 100 | 100 |
| `/products` | mobile | 61 → **64** | 22.0 s → 6.2 s | 560 ms → 400 ms | 0.9 s → 2.3 s | 0 | 98 | 100 | 100 |
| `/faucets` | desktop | 96 → **96** | 1.3 s → 1.4 s | 100 ms → 50 ms | 0.3 s → 0.6 s | 0.001 | 95 | 100 | 100 |
| `/faucets` | mobile | 65 → **60** | 4.9 s → 7.0 s | 690 ms → 500 ms | 1.1 s → 2.3 s | 0 | 95 | 100 | 100 |
| `/6102-rg-pillar-cock` | desktop | 92 → **96** | 1.6 s → 0.9 s | 130 ms → 130 ms | 0.4 s → 0.6 s | 0.001 | 97 | 100 | 100 |
| `/6102-rg-pillar-cock` | mobile | 53 → **68** | 6.2 s → 5.7 s | 1,190 ms → 310 ms | 1.3 s → 2.5 s | 0.001 | 97 | 100 | 100 |
| `/blog` | desktop | 93 → **100** | 1.7 s → 0.8 s | 50 ms → 50 ms | 0.3 s → 0.5 s | 0 | 96 | 100 | 100 |
| `/blog` | mobile | 50 → **65** | 10.0 s → 6.3 s | 980 ms → 410 ms | 1.8 s → 2.1 s | 0.001 | 96 | 100 | 100 |
| `/double-bowl-kitchen-sink-price` | desktop | 97 → **98** | 1.3 s → 1.1 s | 50 ms → 20 ms | 0.3 s → 0.5 s | 0.001 | 96 | 100 | 100 |
| `/double-bowl-kitchen-sink-price` | mobile | 62 → **73** | 12.4 s → 5.3 s | 440 ms → 230 ms | 1.3 s → 2.4 s | 0.002 | 96 | 100 | 100 |
| `/about-prayag` | desktop | 81 → **99** | 1.2 s → 0.9 s | 340 ms → 50 ms | 0.3 s → 0.5 s | 0.051 | 98 | 100 | 100 |
| `/about-prayag` | mobile | 46 → **63** | 13.4 s → 5.5 s | 1,380 ms → 550 ms | 1.2 s → 2.1 s | 0.002 | 98 | 100 | 100 |
| `/contact-us` | desktop | 98 → **99** | 1.1 s → 1.0 s | 20 ms → 30 ms | 0.3 s → 0.5 s | 0 | 98 | 100 | 100 |
| `/contact-us` | mobile | 62 → **66** | 13.8 s → 6.4 s | 430 ms → 350 ms | 1.1 s → 2.3 s | 0 | 98 | 100 | 100 |
| `/hdpe` | desktop | 90 → **98** | 1.5 s → 1.1 s | 180 ms → 30 ms | 0.3 s → 0.6 s | 0 | 97 | 100 | 92 |
| `/hdpe` | mobile | 66 → **56** | 18.0 s → 8.9 s | 200 ms → 320 ms | 1.9 s → 3.4 s | 0 | 97 | 100 | 92 |
| `/search/node` | desktop | 98 → **99** | 1.1 s → 0.9 s | 10 ms → 20 ms | 0.3 s → 0.5 s | 0.001 | 98 | 100 | 61 |
| `/search/node` | mobile | 65 → **75** | 11.7 s → 2.4 s | 360 ms → 1,100 ms | 0.9 s → 1.5 s | 0 | 98 | 100 | 61 |
