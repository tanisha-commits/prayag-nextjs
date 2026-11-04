import type { NextConfig } from "next";

// Redirects the live site (prayagindia.com) answers for URLs listed in its sitemap or linked from its
// pages, with the same targets and status codes (checked 2026-10-30).
const LIVE_REDIRECTS: { source: string; destination: string; statusCode: 301 | 302 }[] = [
  { source: "/cpvc-0", destination: "/cpvc-plumbing-solution", statusCode: 301 },
  { source: "/cpvc", destination: "/", statusCode: 301 },
  { source: "/plumber-bablu", destination: "/prayag-ka-bablu-plumbers-loyalty-program", statusCode: 301 },
  { source: "/latest-faqs", destination: "/", statusCode: 301 },
  { source: "/node/947", destination: "/", statusCode: 301 },
  // Linked from blog articles; retired on the source.
  { source: "/storage-tanks", destination: "/", statusCode: 301 },
  { source: "/best-faucet-for-a-countertop-wash-basin-spout-height-reach-and-mounting-guide", destination: "/", statusCode: 301 },
  { source: "/search/node/help", destination: "/", statusCode: 301 },
  { source: "/PVC-O%20Pipes", destination: "/pvc-o-pipes", statusCode: 301 },
  { source: "/ba-45-soap-dish-0", destination: "/ba-45-soap-dish", statusCode: 301 },
  { source: "/bos-41ss-over-head-shower-0", destination: "/bos-41ss-over-head-shower", statusCode: 301 },
  // Renamed Quantum ("-q-") products now live under "-qp-".
  ...["123-q-bib-cock", "129-q-bib-cock", "130-q-pillar-cock", "132-q-sink-cock", "133-q-sink-cock", "134-q-sink-mixer", "135-q-wall-mixer", "1375-q-wall-mixer", "144-q-angle-cock", "145-q-angle-cock"].map(
    (slug) => ({ source: `/${slug}`, destination: `/${slug.replace("-q-", "-qp-")}`, statusCode: 301 as const }),
  ),
  // Drupal taxonomy term pages are not public on the live site.
  { source: "/taxonomy/term/:id", destination: "/", statusCode: 302 },
];

// Sub-path to serve the site under, fixed at build time: `BASE_PATH=/prayagindia npm run build`.
// Leave unset to serve from a domain root. The domain itself is never baked in.
const basePath = (process.env.BASE_PATH ?? "").trim().replace(/\/+$/, "").replace(/^(?=[^/])/, "/");

const nextConfig: NextConfig = {
  output: "standalone",
  ...(basePath ? { basePath } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Inline each page's CSS in a <style> tag instead of a render-blocking <link> (Tailwind CSS is small;
  // ~14 KB gzip on the homepage). Measured on the homepage, mobile Lighthouse: FCP 2.1 s → 1.0 s,
  // performance 77–80 → 87–89; desktop unchanged or better.
  experimental: { inlineCss: true },
  // Next always bundles a polyfill module for ES2019–2022 methods its supported browsers already
  // have (PageSpeed: "Legacy JavaScript"). Swap it for a stub that keeps only URL.canParse.
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module": { browser: "./src/lib/polyfills/next-polyfill-module.js" },
    },
  },
  // Built-in optimizer behind src/lib/optimized-image.ts: plain <img srcset> candidates are resized
  // WebP copies of the original files under /sites/prayag (originals stay untouched). The width lists
  // are a dense ladder (~15% steps) so the chosen candidate stays close to the rendered size; keep
  // them in sync with IMAGE_WIDTHS there.
  images: {
    imageSizes: [96, 128, 160, 200, 256, 320, 384, 448, 512, 576],
    deviceSizes: [640, 750, 828, 960, 1080, 1200, 1440, 1920],
    qualities: [75],
    formats: ["image/webp"],
    minimumCacheTTL: 2592000,
    localPatterns: [{ pathname: `${basePath}/sites/prayag/**`, search: "" }],
  },
  async redirects() {
    return LIVE_REDIRECTS;
  },
  // Source images, videos, fonts and PDFs copied from the live site. Their names carry no content
  // hash, so they are cached for 30 days (not "immutable"); a replaced file reaches visitors within that.
  async headers() {
    return [{ source: "/sites/prayag/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }] }];
  },
};

export default nextConfig;

