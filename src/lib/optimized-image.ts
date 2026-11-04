import { BASE_PATH, withBasePath } from "./base-path";

export const IMAGE_WIDTHS = [96, 128, 160, 200, 256, 320, 384, 448, 512, 576, 640, 750, 828, 960, 1080, 1200, 1440, 1920] as const;
const QUALITY = 75;

export function isOptimizable(src: string | undefined | null): src is string {
  if (!src) return false;
  const path = src.startsWith(BASE_PATH + "/") && BASE_PATH ? src.slice(BASE_PATH.length) : src;
  return path.startsWith("/sites/prayag/") && /\.(webp|png|jpe?g)$/i.test(path.split("?")[0]);
}

export function optimizedUrl(src: string, width: number): string {
  return `${BASE_PATH}/_next/image?url=${encodeURIComponent(withBasePath(src))}&w=${width}&q=${QUALITY}`;
}

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
