import type { NextConfig } from "next";

const LIVE_REDIRECTS: { source: string; destination: string; statusCode: 301 | 302 }[] = [
  { source: "/cpvc-0", destination: "/cpvc-plumbing-solution", statusCode: 301 },
  { source: "/cpvc", destination: "/", statusCode: 301 },
  { source: "/plumber-bablu", destination: "/prayag-ka-bablu-plumbers-loyalty-program", statusCode: 301 },
  { source: "/latest-faqs", destination: "/", statusCode: 301 },
  { source: "/node/947", destination: "/", statusCode: 301 },
  { source: "/storage-tanks", destination: "/", statusCode: 301 },
  { source: "/best-faucet-for-a-countertop-wash-basin-spout-height-reach-and-mounting-guide", destination: "/", statusCode: 301 },
  { source: "/search/node/help", destination: "/", statusCode: 301 },
  { source: "/PVC-O%20Pipes", destination: "/pvc-o-pipes", statusCode: 301 },
  { source: "/ba-45-soap-dish-0", destination: "/ba-45-soap-dish", statusCode: 301 },
  { source: "/bos-41ss-over-head-shower-0", destination: "/bos-41ss-over-head-shower", statusCode: 301 },
  ...["123-q-bib-cock", "129-q-bib-cock", "130-q-pillar-cock", "132-q-sink-cock", "133-q-sink-cock", "134-q-sink-mixer", "135-q-wall-mixer", "1375-q-wall-mixer", "144-q-angle-cock", "145-q-angle-cock"].map(
    (slug) => ({ source: `/${slug}`, destination: `/${slug.replace("-q-", "-qp-")}`, statusCode: 301 as const }),
  ),
  { source: "/taxonomy/term/:id", destination: "/", statusCode: 302 },
];

const basePath = (process.env.BASE_PATH ?? "").trim().replace(/\/+$/, "").replace(/^(?=[^/])/, "/");

const nextConfig: NextConfig = {
  output: "standalone",
  ...(basePath ? { basePath } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  experimental: { inlineCss: true },
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module": { browser: "./src/lib/polyfills/next-polyfill-module.js" },
    },
  },
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
  async headers() {
    return [{ source: "/sites/prayag/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }] }];
  },
};

export default nextConfig;

