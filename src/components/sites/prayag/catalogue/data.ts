/**
 * Catalogue cards from https://prayagindia.com/download-cataglogue, in source order. Titles and image
 * alt text are verbatim (incl. "Geyser Catalgue" and the trailing space in the CP title's alt).
 * PDFs and covers are local copies from the Drupal backup — byte-identical to the live files
 * (size + SHA-256 checks: docs/research/prayag/catalogue-notes.md).
 */
export interface Catalogue {
  title: string;
  alt: string;
  image: string;
  pdf: string;
  /** Size of the PDF, shown to assistive tech only (download links). */
  size: string;
}

export const catalogueBanner = "/sites/prayag/files/2024-08/download-cataglogue.webp";

export const catalogues: Catalogue[] = [
  {
    title: "Geyser Catalgue",
    alt: "Geyser Catalgue",
    image: "/sites/prayag/files/2025-11/water-heater.webp",
    pdf: "/sites/prayag/files/2025-11/Geyser-Catalgue---Oct-2024_0.pdf",
    size: "33.4 MB",
  },
  {
    title: "Plumbing Catalogue",
    alt: "Plumbing Catalogue",
    image: "/sites/prayag/files/2025-03/pvc-pipes.webp",
    pdf: "/sites/prayag/files/2025-03/CPVC-UPVC-SWR-AND-AGRI-RICE-LIST_Catalogue-25.pdf",
    size: "39.2 MB",
  },
  {
    title: "CP Faucets, Sanitaryware, Kitchen Sink Catalogue ",
    alt: "CP Faucets, Sanitaryware, Kitchen Sink Catalogue ",
    image: "/sites/prayag/files/2026-04/Ajay-Devgan.webp",
    pdf: "/sites/prayag/files/2026-04/PRAYAG-CP-CATALOGUE-2026_compressed.pdf",
    size: "11.4 MB",
  },
  {
    title: "PVC-O Pipes Catalogue",
    alt: "PVC-O Pipes Catalogue",
    image: "/sites/prayag/files/2025-03/pvc-0-pipes-1-.webp",
    pdf: "/sites/prayag/files/2025-01/Final-PVC---O-Catalogue.pdf",
    size: "7.2 MB",
  },
  {
    title: "Water Tank",
    alt: "Water Tank",
    image: "/sites/prayag/files/2025-03/WATER-TANK-CATALOGUE-COVER.webp",
    pdf: "/sites/prayag/files/2025-03/WATER-TANK.pdf",
    size: "6.2 MB",
  },
  {
    title: "PTMT Catalogue",
    alt: "PTMT Catalogue",
    image: "/sites/prayag/files/2026-04/Ajay-Devgan-2.webp",
    pdf: "/sites/prayag/files/2026-04/PTMT-CATALOGE-2026_compressed.pdf",
    size: "24.5 MB",
  },
];
