import { cn } from "@/lib/utils";

/** Four-pointed sparkle from the official brand mark. */
export function Sparkle({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 0.8 13.6 10.4 23.2 12 13.6 13.6 12 23.2 10.4 13.6 0.8 12 10.4 10.4Z" />
    </svg>
  );
}

/** Official palm + S monogram, drawn to match the brand deck. */
export function Monogram({
  className,
  size = 56,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 80 108"
      fill="none"
      aria-hidden
      className={className}
    >
      <path d="M40 22v70" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M40 28c-7-9-16-12-22-10M40 28c7-9 16-12 22-10M40 34c-8-6-16-7-22-4M40 34c8-6 16-7 22-4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M52 62c0-10-7-16-16-16-11 0-18 7-18 16 0 14 24 10 24 24 0 9-7 16-18 16-10 0-17-6-18-15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M40 8.5 41.3 15.8 48.5 17 41.3 18.2 40 25.5 38.7 18.2 31.5 17 38.7 15.8Z"
        fill="#E9C476"
      />
    </svg>
  );
}

export function SparkleRule({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-4 text-gold", className)} aria-hidden>
      <span className="h-px w-10 bg-line-strong sm:w-16" />
      <Sparkle size={12} />
      <span className="h-px w-10 bg-line-strong sm:w-16" />
    </div>
  );
}
