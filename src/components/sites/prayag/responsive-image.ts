import { getImageProps } from "next/image";
import { withBasePath } from "@/lib/base-path";

export function responsiveImg(src: string, width: number, sizes: string) {
  const { props } = getImageProps({ src: withBasePath(src), alt: "", width, height: width, sizes });
  return { src: props.src, srcSet: props.srcSet, sizes: props.sizes };
}
