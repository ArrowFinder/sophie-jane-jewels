import Link from "next/link";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

/**
 * Official logo system from Brand Guidelines.
 * Prefer SVG for crisp scaling; PNGs as raster fallbacks where needed.
 */

const ASSETS = {
  primary: { src: "/brand/logo-primary.svg", width: 406, height: 209 },
  primaryLight: { src: "/brand/logo-primary-light.svg", width: 406, height: 209 },
  horizontal: { src: "/brand/logo-horizontal.svg", width: 405, height: 140 },
  horizontalLight: { src: "/brand/logo-horizontal-light.svg", width: 405, height: 140 },
  compact: { src: "/brand/logo-compact-horizontal.svg", width: 527, height: 46 },
  stamp: { src: "/brand/logo-stamp.svg", width: 87, height: 88 },
  stampLight: { src: "/brand/logo-stamp-light.svg", width: 87, height: 88 },
} as const;

type Tone = "brand" | "light";

/**
 * Header / nav logo.
 * Uses the horizontal secondary mark (guideline: headers & limited height),
 * switching to compact on very small screens. Min clear space handled by padding.
 */
export function Logo({
  className,
  compact = false,
  priority = false,
  tone = "brand",
}: {
  className?: string;
  compact?: boolean;
  priority?: boolean;
  tone?: Tone;
}) {
  const horizontal = tone === "light" ? ASSETS.horizontalLight : ASSETS.horizontal;
  const compactAsset = ASSETS.compact;

  return (
    <Link
      href="/"
      aria-label="Sophie Jane Jewels, home"
      className={cn("inline-flex items-center justify-center", className)}
    >
      {/* Mobile / compact: simplified horizontal wordmark */}
      <Image
        src={compactAsset.src}
        alt="Sophie Jane Jewels"
        width={compactAsset.width}
        height={compactAsset.height}
        priority={priority}
        sizes="200px"
        className={cn(
          "h-auto w-[9.5rem] object-contain sm:hidden",
          compact && "block sm:block w-[10.5rem]",
        )}
      />
      {/* Default header: full horizontal alternate */}
      {!compact && (
        <Image
          src={horizontal.src}
          alt="Sophie Jane Jewels: Fine Antique & Estate Jewelry"
          width={horizontal.width}
          height={horizontal.height}
          priority={priority}
          sizes="(min-width:1024px) 240px, 200px"
          className="hidden h-[3.6rem] w-auto object-contain sm:block lg:h-[4.25rem]"
        />
      )}
    </Link>
  );
}

/** Full primary lockup, footer, about, marketing moments. */
export function LogoLockup({
  className,
  priority = false,
  tone = "brand",
}: {
  className?: string;
  priority?: boolean;
  tone?: Tone;
}) {
  const asset = tone === "light" ? ASSETS.primaryLight : ASSETS.primary;
  return (
    <Image
      src={asset.src}
      alt="Sophie Jane Jewels: Fine Antique & Estate Jewelry, Est. 2001"
      width={asset.width}
      height={asset.height}
      priority={priority}
      sizes="(min-width:1024px) 320px, 260px"
      className={cn("h-auto w-full max-w-[18rem] object-contain lg:max-w-[20rem]", className)}
    />
  );
}

/**
 * Oval stamp brand mark, favicon-scale punctuation.
 * Pass `home` to link to /. Prefer light tone on dark backgrounds.
 */
export function LogoMark({
  className,
  size = 48,
  home = false,
  priority = false,
  tone = "brand",
}: {
  className?: string;
  size?: number;
  home?: boolean;
  priority?: boolean;
  tone?: Tone;
}) {
  const asset = tone === "light" ? ASSETS.stampLight : ASSETS.stamp;
  const mark = (
    <Image
      src={asset.src}
      alt="Sophie Jane Jewels"
      width={asset.width}
      height={asset.height}
      priority={priority}
      sizes={`${size}px`}
      className={cn("object-contain", className)}
      style={{ width: size, height: size }}
    />
  );

  if (!home) return mark;

  return (
    <Link
      href="/"
      aria-label="Sophie Jane Jewels, home"
      className="inline-block transition-opacity hover:opacity-80"
    >
      {mark}
    </Link>
  );
}
