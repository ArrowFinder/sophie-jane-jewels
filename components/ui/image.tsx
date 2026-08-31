import NextImage, { type ImageProps } from "next/image";
import { assetPath } from "@/lib/assets";

/** next/image that prefixes local public files for GitHub Pages. */
export function Image({ src, ...props }: ImageProps) {
  const resolved = typeof src === "string" ? assetPath(src) : src;
  return <NextImage src={resolved} {...props} />;
}
