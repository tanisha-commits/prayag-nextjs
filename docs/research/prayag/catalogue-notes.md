# Download Cataglogue — migration notes

Source: https://prayagindia.com/download-cataglogue (slug misspelling kept). Clone: `/download-cataglogue`,
data `src/components/sites/prayag/catalogue/data.ts`. Assets: 13 files (banner, 6 covers, 6 PDFs) from the
Drupal backup — `catalogue-assets.json`; 0 missing.

## PDF verification (2026-10-28)
Local copy vs live file: size compared with `Content-Length` of a HEAD request; SHA-256 of a full GET
download (saved outside the project) for the three smallest.

| Catalogue | Local file | Bytes (local = live) | SHA-256 (local = live) |
|---|---|---|---|
| Geyser Catalgue | files/2025-11/Geyser-Catalgue---Oct-2024_0.pdf | 33,423,016 ✔ | — |
| Plumbing Catalogue | files/2025-03/CPVC-UPVC-SWR-AND-AGRI-RICE-LIST_Catalogue-25.pdf | 39,164,037 ✔ | — |
| CP Faucets, Sanitaryware, Kitchen Sink Catalogue | files/2026-04/PRAYAG-CP-CATALOGUE-2026_compressed.pdf | 11,428,355 ✔ | 4a868d6b…8d31 ✔ |
| PVC-O Pipes Catalogue | files/2025-01/Final-PVC---O-Catalogue.pdf | 7,195,617 ✔ | c90d80c3…374b ✔ |
| Water Tank | files/2025-03/WATER-TANK.pdf | 6,205,709 ✔ | 06e4a2e8…935b ✔ |
| PTMT Catalogue | files/2026-04/PTMT-CATALOGE-2026_compressed.pdf | 24,507,251 ✔ | — |

All six served locally as `200 application/pdf` with the same Content-Length.

## Decisions
- Source anchors carry the typo `taregt="blank"`, so PDFs open in the same tab. Clone (deliberate deviation):
  cover image + title open the PDF in a **new tab** (`rel="noopener noreferrer"`); the "Download" label is a
  separate link with the `download` attribute. Visual card unchanged (verified side by side).
- Titles verbatim, incl. "Geyser Catalgue" and the trailing space of "CP Faucets, Sanitaryware, Kitchen Sink Catalogue ".
- Repo size: the six PDFs add ~122 MB (largest 39 MB; under GitHub's 100 MB per-file limit).
