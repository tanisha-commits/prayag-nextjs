import { BASE_PATH, withBasePath } from "./base-path";

/**
 * Responsive candidates for plain <img> elements, served by Next's built-in image optimizer
 * (`/_next/image`, configured in next.config.ts). The original files are never modified; the
 * optimizer returns resized WebP copies (never upscaled) and caches them on disk.
 *
 * Must match `images.imageSizes` + `images.deviceSizes` in next.config.ts — any other width is
 * rejected by the optimizer with a 400.
 */
export const IMAGE_WIDTHS = [96, 128, 160, 200, 256, 320, 384, 448, 512, 576, 640, 750, 828, 960, 1080, 1200, 1440, 1920] as const;
const QUALITY = 75;

/** True for local raster images the optimizer can resize (SVG/GIF and external URLs are left alone). */
export function isOptimizable(src: string | undefined | null): src is string {
  if (!src) return false;
  const path = src.startsWith(BASE_PATH + "/") && BASE_PATH ? src.slice(BASE_PATH.length) : src;
  return path.startsWith("/sites/prayag/") && /\.(webp|png|jpe?g)$/i.test(path.split("?")[0]);
}

/** Optimizer URL for one width (the width must be one of IMAGE_WIDTHS). */
export function optimizedUrl(src: string, width: number): string {
  return `${BASE_PATH}/_next/image?url=${encodeURIComponent(withBasePath(src))}&w=${width}&q=${QUALITY}`;
}

/**
 * srcset for a local image whose natural width is `naturalWidth`: every ladder width below it, then
 * one candidate at the natural width itself (the optimizer does not upscale, so that file is the
 * full-size WebP). `minWidth` drops candidates too small to ever be useful for this slot.
 */
export function optimizedSrcSet(src: string, naturalWidth: number, minWidth = 0): string {
  const below = IMAGE_WIDTHS.filter((w) => w < naturalWidth && w >= minWidth);
  const cap = IMAGE_WIDTHS.find((w) => w >= naturalWidth) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
  const capWidth = Math.min(naturalWidth, cap);
  return [...below.map((w) => `${optimizedUrl(src, w)} ${w}w`), `${optimizedUrl(src, cap)} ${capWidth}w`].join(", ");
}

export type ResponsiveImgProps = {
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
};

/**
 * Props for an <img>: optimized `src`/`srcSet`, the `sizes` hint, and the natural `width`/`height`
 * (which reserve the aspect-ratio box and keep the rendered size the same as before, since CSS or the
 * width attribute — not the chosen candidate — decides the box). Non-optimizable sources pass through.
 *
 * `sizes` should describe the rendered slot. For lazy images "auto" lets the browser use the laid-out
 * width; the fallback after it is used by browsers without `sizes=auto` support.
 */
export function responsiveImg(src: string, dims: { width: number; height: number } | undefined, sizes: string, minWidth = 0): ResponsiveImgProps {
  if (!dims || !isOptimizable(src)) return { src: withBasePath(src), ...(dims ?? {}) };
  const fallbackWidth = IMAGE_WIDTHS.find((w) => w >= Math.min(dims.width, 1080)) ?? 1080;
  return {
    src: optimizedUrl(src, fallbackWidth),
    srcSet: optimizedSrcSet(src, dims.width, minWidth),
    sizes,
    width: dims.width,
    height: dims.height,
  };
}
