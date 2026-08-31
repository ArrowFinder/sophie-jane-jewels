import Link from "next/link";
import { OfficialLockup, OfficialStamp } from "@/components/brand/official-mark";
import { cn } from "@/lib/utils";

/**
 * Official lockup as a crisp vector — the supplied brand file is a compressed
 * JPEG, which pixelates when scaled. This matches the same arrangement.
 */
export function Logo({
  className,
  compact = false,
  tone = "brand",
}: {
  className?: string;
  compact?: boolean;
  priority?: boolean;
  tone?: "brand" | "cream";
}) {
  return (
    <Link href="/" aria-label="Sophie Jane Jewels — home" className={cn("inline-block", className)}>
      <OfficialLockup tone={tone} size={compact ? "sm" : "md"} />
    </Link>
  );
}

/** Official oval stamp — favicon and the recognizable brand mark. */
export function LogoMark({
  className,
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return <OfficialStamp className={className} size={size} />;
}
