import { cn } from "@/lib/utils";
import { Sparkle } from "@/components/brand/marks";

/** Official oval stamp — palm, S, gold sparkle. Vector so it never pixelates. */
export function OfficialStamp({
  className,
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  const height = Math.round(size * (185 / 126));
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 126 185"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="1.5" y="1.5" width="123" height="182" rx="61.5" fill="#C48B8C" />
      <rect x="8" y="8" width="110" height="169" rx="55" stroke="#F6EFE6" strokeWidth="1.4" />
      <g stroke="#F6EFE6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M63 48v98" strokeWidth="1.5" />
        <path
          d="M63 62c-8-12-18-16-26-14M63 62c8-12 18-16 26-14M63 70c-9-8-18-9-26-5M63 70c9-8 18-9 26-5"
          strokeWidth="1.45"
        />
        <path
          d="M82 108c0-13-9-21-21-21-14 0-23 9-23 21 0 18 32 13 32 31 0 12-9 21-23 21-13 0-22-8-23-20"
          strokeWidth="1.8"
        />
      </g>
      <path
        fill="#E9C476"
        d="M63 38.5 64.7 46.2 72.5 47.5 64.7 48.8 63 56.5 61.3 48.8 53.5 47.5 61.3 46.2Z"
      />
    </svg>
  );
}

/** Official lockup as live type — stays sharp at any size. */
export function OfficialLockup({
  className,
  tone = "brand",
  size = "md",
}: {
  className?: string;
  tone?: "brand" | "cream";
  size?: "sm" | "md" | "lg";
}) {
  const word = tone === "cream" ? "text-paper" : "text-[#C48B8C]";
  const gold = "text-gold";
  const sizes = {
    sm: {
      est: "text-[0.5rem] tracking-[0.4em]",
      name: "text-[0.98rem] tracking-[0.14em]",
      tag: "text-[0.48rem] tracking-[0.26em]",
      sparkle: 6,
    },
    md: {
      est: "text-[0.56rem] tracking-[0.42em] sm:text-[0.6rem]",
      name: "text-[1.18rem] tracking-[0.14em] sm:text-[1.38rem] sm:tracking-[0.16em]",
      tag: "text-[0.52rem] tracking-[0.28em] sm:text-[0.58rem] sm:tracking-[0.32em]",
      sparkle: 8,
    },
    lg: {
      est: "text-[0.62rem] tracking-[0.44em]",
      name: "text-[1.55rem] tracking-[0.16em]",
      tag: "text-[0.6rem] tracking-[0.32em]",
      sparkle: 9,
    },
  }[size];

  return (
    <span
      className={cn("flex flex-col items-center leading-none", className)}
      role="img"
      aria-label="Sophie Jane Jewels — Fine Antique & Estate Jewelry, Est. 2001"
    >
      <span className={cn("font-sans uppercase", gold, sizes.est)}>Est. 2001</span>
      <span className={cn("mt-1.5 font-display font-medium uppercase", word, sizes.name)}>
        S
        <span className="relative inline-block">
          O
          <Sparkle
            size={sizes.sparkle}
            className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", gold)}
          />
        </span>
        PHIE JANE JEWELS
      </span>
      <span className={cn("mt-2 text-center font-sans uppercase leading-tight", gold, sizes.tag)}>
        Fine Antique
        <br />
        &amp; Estate Jewelry
      </span>
    </span>
  );
}
