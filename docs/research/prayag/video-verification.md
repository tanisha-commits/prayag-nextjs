# Video verification — /product-video, /video-tv-advertisement, /feedback-videos

Checked 2026-10-28 with YouTube oEmbed
(`GET https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json`).
All 24 ids returned HTTP 200 (public and embeddable). oEmbed titles end in " | Prayag" (channel name), dropped below.
"Match" compares the card heading in the source with the oEmbed title.

## /product-video (source node/1075) — inline click-to-play

| # | Id | Card title (source) | oEmbed title | Match | Available |
|---|---|---|---|---|---|
| 1 | oVYIYvnYzGQ | Prayag Duralife CPVC Pipe Put to the Test – Unbelievable Strength & Flexibility | same | yes | yes |
| 2 | _Zrq98xvV-A | Tested for Trust: Inside Prayag's Rigorous Product Testing Process | same | yes | yes |
| 3 | QaGMCSQUr6I | This Smart Toilet Redefines Luxury Hygiene X Prayag | same | yes | yes |
| 4 | rEkCzqugSzk | Prayag Water Tanks & Line Filters \| Pure Water, Powerful Protection | same | yes | yes |

## /feedback-videos (source node/1076) — inline click-to-play

| # | Id played (clone) | Card title (source) | oEmbed title | Match | Available |
|---|---|---|---|---|---|
| 1 | OkOliW9o9cg | Dealer Trust Speaks for Prayag \| Mr. Sanjay Manwani, Baba Sanitaryware & Hardware, Indore | "Title:Dealer Trust Speaks for Prayag \| Mr. Sanjay Manwani, …, Indore" | yes (YouTube title has a stray "Title:" prefix) | yes |
| 2 | **LZXPJD1JCsM** (source plays xaTiH0hlURs) | Prayag CEO Nitin Aggarwal Making European Luxury Affordable for India NDTV Business Conclave | LZXPJD1JCsM: "Prayag CEO Nitin Aggarwal: Making European Luxury Affordable for India \| NDTV Business Conclave"; xaTiH0hlURs: "Why Distributors Stay with Prayag for Decades \| Built on Trust & Quality" | source id: **no**; fixed id: yes | yes |
| 3 | ZkAr1ccoclk | 🤝 Meet Yusuf Master - The Voice of Prayag in Vidarbha, Nagpur. | same | yes | yes |
| 4 | xaTiH0hlURs | Why Distributors Stay with Prayag for Decades \| Built on Trust & Quality | same | yes | yes |
| 5 | y4qnh7v9j00 | Mr. V.K. Jain’s Journey with Prayag \| 38 Years of Partnership | same | yes | yes |
| 6 | HKuT_vBvLCE | Worked with dedication — and success followed instantly. | same | yes | yes |

**Deliberate fix (card 2):** the source card's thumbnail is `img.youtube.com/vi/LZXPJD1JCsM/hqdefault.jpg`, whose
oEmbed title is the card title, but its `data-video` plays `xaTiH0hlURs` — the same video as card 4. The correct id is
unambiguous from the source's own markup, so the clone plays LZXPJD1JCsM (verified: clicking card 2 loads
`embed/LZXPJD1JCsM`, YouTube document title "Prayag CEO Nitin Aggarwal: Making European Luxury Affordable for India | NDTV
Business Conclave"). Live-site defect to report to the owner.

## /video-tv-advertisement (source node/62) — modal player

| # | Id | Card title (source) | oEmbed title | Match | Available |
|---|---|---|---|---|---|
| 1 | RWDChd4E4OY | Saala Khadoos Associates - Prayag India | Saala Khadoos Associates - Prayag  India | yes | yes |
| 2 | HW7CECdYxgw | Prayag India Sponsors - Jolly LLB 2 \| Prayag India | Prayag India Sponsors -  Jolly LLB 2 \| Prayag India | yes | yes |
| 3 | XNfObH1tvJw | Prayag Chrome Plated Products Technical Video. | Prayag Chrome Plated Products Technical Video | yes | yes |
| 4 | R70VavGdDhg | Jersey x Prayag- Your Family’s real Hero! \| Prayag India | Jersey x Prayag-  Your Family’s real Hero! \| Prayag India | yes | yes |
| 5 | r08qriSTavE | Fateh Movie Trailer Starring Sonu Sood & Jacqueline Fernandez Releasing 10th January 2025 | Fateh Movie Trailer \| Starring Sonu Sood & Jacqueline Fernandez \| Releasing 10th January 2025 | yes | yes |
| 6 | qRZyfrnlFNU | Durga Puja | Happy  Durga Puja | yes | yes |
| 7 | btKXfQddvXE | Respect Freedom | Respect Freedom | yes | yes |
| 8 | Xk8uf2KLW-Y | Rishta Zindagi Bhar Ka | Prayag PTMT —Rishta zindagi bhar ka | yes | yes |
| 9 | BI_qZK8-OJs | New Zeland Having Sleepless | New Zealand Having Sleepless Nights | yes (source typo/truncation kept) | yes |
| 10 | -Dk4z_gRH4s | Pakistan Home Coming | Pakistan -  Home Coming \| Prayag Cheers For India | yes | yes |
| 11 | ao2YUTJ-bNs | India vs Pakistan | Prayag - Cheers For India \| India vs Pakistan | yes (see note) | yes |
| 12 | 7Zfj8xUx0sw | Prayag Cheers For India | Prayag - Cheers For India \| India Vs Pakistan | yes (see note) | yes |
| 13 | 4Nqsu2O_sj8 | This Eid Lets Gift A New Life To Someone | This Eid, Let's Gift A New Life To Someone. | yes | yes |
| 14 | ZgKuW9v_dYs | Prayag Hai Kings Ki Choice | Prayag Hai Kings Ki Choice \| Kings XI Punjab Official Team Partners | yes | yes |

Note 11/12: both videos have almost the same YouTube title ("Prayag - Cheers For India | India vs/Vs Pakistan"), so
the oEmbed title cannot tell the two cards apart. Ids kept as in the source; flagged, not changed.

## Embed URLs (what is loaded on click)

- **Product / feedback:** the page script sets `iframe.src = data-video + "?autoplay=1&rel=0"`. Several `data-video`
  values already contain a query (`?autoplay=1&mute=1`, card 1 of feedback `?autoplay=1`), so the live site loads
  malformed URLs such as `embed/ZkAr1ccoclk?autoplay=1&mute=1?autoplay=1&rel=0`. Tested in Chrome (2026-10-28):
  with that URL the YouTube `<video>` is **not** muted (`mute` parses as `1?autoplay=1`), while a clean
  `?autoplay=1&mute=1&rel=0` is muted. The clone therefore loads `https://www.youtube.com/embed/<id>?autoplay=1&rel=0`
  for every card — the behaviour the source actually produces (autoplay with sound, no related videos from other
  channels), without the malformed query. Only on user click; nothing autoplays on page load.
- **TV page:** theme `script.js` sets `#videoFrame` src to `https://www.youtube.com/embed/<id>?autoplay=1&feature=oembed`
  on click and to `""` on `hide.bs.modal`. Reproduced exactly (iframe removed on close, which stops playback).
- Domain: `www.youtube.com` (as the source; not youtube-nocookie).
