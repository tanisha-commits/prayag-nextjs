import { getImageProps } from "next/image";
import { withBasePath } from "@/lib/base-path";

/**
 * Responsive sources for a plain <img> that must keep the source markup: only `src`, `srcSet` and
 * `sizes` come from the Next.js image optimizer (resized, WebP/AVIF), so phones stop downloading
 * desktop-size files. `width` is the file's intrinsic width; the rendered box is unchanged.
 */
export function responsiveImg(src: string, width: number, sizes: string) {
  const { props } = getImageProps({ src: withBasePath(src), alt: "", width, height: width, sizes });
  return { src: props.src, srcSet: props.srcSet, sizes: props.sizes };
}
