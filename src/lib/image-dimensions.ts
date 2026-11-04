import "server-only";
import dimensions from "./image-dimensions.generated.json";
import { BASE_PATH, withBasePath } from "./base-path";
import { IMAGE_WIDTHS, isOptimizable, optimizedUrl, responsiveImg, type ResponsiveImgProps } from "./optimized-image";

const table: Record<string, readonly number[] | undefined> = dimensions;

function entry(src: string | undefined | null): readonly number[] | undefined {
  if (!src) return undefined;
  let path = src.split("?")[0];
  if (BASE_PATH && path.startsWith(BASE_PATH + "/")) path = path.slice(BASE_PATH.length);
  let hit = table[path];
  if (!hit) {
    try {
      hit = table[decodeURIComponent(path)];
    } catch {
      return undefined;
    }
  }
  return hit;
}

export function imageDims(src: string | undefined | null): { width: number; height: number } | undefined {
  const hit = entry(src);
  return hit ? { width: hit[0], height: hit[1] } : undefined;
}

export function img(src: string, sizes: string, minWidth = 0): ResponsiveImgProps {
  return responsiveImg(src, imageDims(src), sizes, minWidth);
}

export function transcodedUrl(url: string): string {
  const dims = imageDims(url);
  const cap = IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
  if (!dims || !isOptimizable(url) || dims.width > cap) return withBasePath(url);
  return optimizedUrl(url, IMAGE_WIDTHS.find((w) => w >= dims.width) ?? cap);
}

export function transcodedSrcSet(srcSet: string): string {
  return srcSet
    .split(",")
    .map((part) => part.replace(/^(\s*)(\S+)/, (_, ws: string, url: string) => ws + transcodedUrl(url)))
    .join(",");
}

const IMG_TAG = /<img\b[^>]*>/gi;

function attr(tag: string, name: string): string | undefined {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return m ? m[2] : undefined;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

export function responsiveImagesHtml(html: string): string {
  if (!html || !html.includes("<img")) return html;
  return html.replace(IMG_TAG, (tag) => {
    const src = attr(tag, "src");
    if (!src || !isOptimizable(src)) return tag;
    const existing = attr(tag, "srcset");
    if (existing !== undefined) {
      return tag
        .replace(/\ssrcset\s*=\s*(["'])([\s\S]*?)\1/i, () => ` srcset="${escapeAttr(transcodedSrcSet(existing))}"`)
        .replace(/\ssrc\s*=\s*(["'])(.*?)\1/i, () => ` src="${escapeAttr(transcodedUrl(src))}"`);
    }
    const dims = imageDims(src);
    if (!dims) return tag;
    const lazy = /\sloading\s*=\s*["']?lazy/i.test(tag);
    const explicitWidth = Number(attr(tag, "width")) || 0;
    const fillsDims = !attr(tag, "width") && !attr(tag, "height");
    const numericDims = fillsDims || (/^\d+$/.test(attr(tag, "width") ?? "") && /^\d+$/.test(attr(tag, "height") ?? ""));
    const pct = /^(\d+(?:\.\d+)?)%$/.exec(attr(tag, "width") ?? "");
    const fallback = explicitWidth
      ? `(max-width: ${explicitWidth}px) 100vw, ${explicitWidth}px`
      : pct
        ? `(max-width: 991px) 100vw, ${Math.ceil(Number(pct[1]))}vw`
        : "100vw";
    const sizes = lazy && numericDims ? `auto, ${fallback}` : fallback;
    const p = responsiveImg(src, dims, sizes);
    let out = tag
      .replace(/\ssizes\s*=\s*(["'])[\s\S]*?\1/gi, "")
      .replace(/\ssrc\s*=\s*(["'])(.*?)\1/i, ` src="${escapeAttr(p.src)}" srcset="${escapeAttr(p.srcSet ?? "")}" sizes="${p.sizes}"`);
    if (fillsDims) out = out.replace(/^<img\b/i, `<img width="${dims.width}" height="${dims.height}"`);
    return out;
  });
}

export function fullImg(src: string): ResponsiveImgProps {
  return img(src, "100vw");
}

export function fullSource(src: string): { srcSet: string; sizes?: string } {
  const p = img(src, "100vw");
  return p.srcSet ? { srcSet: p.srcSet, sizes: p.sizes } : { srcSet: withBasePath(src) };
}
