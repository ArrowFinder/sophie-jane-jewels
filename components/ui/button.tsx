import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  solid:
    "bg-oxblood text-paper hover:bg-oxblood-deep border border-oxblood hover:border-oxblood-deep",
  outline:
    "bg-transparent text-ink border border-ink/30 hover:border-ink hover:bg-ink hover:text-paper",
  ghost: "bg-transparent text-ink border border-transparent hover:bg-ink/5",
  link: "bg-transparent text-ink border-0 px-0 py-0 underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  sm: "text-[0.72rem] px-4 py-2.5 tracking-[0.16em]",
  md: "text-[0.78rem] px-7 py-3.5 tracking-[0.18em]",
  lg: "text-[0.82rem] px-9 py-4 tracking-[0.2em]",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

function classesFor(variant: Variant, size: Size, className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 font-sans font-medium uppercase transition-all duration-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
    variant !== "link" && sizes[size],
    variants[variant],
    className,
  );
}

export function Button({
  variant = "solid",
  size = "md",
  className,
  children,
  ...rest
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classesFor(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "solid",
  size = "md",
  className,
  children,
  href,
  ...rest
}: BaseProps & { href: string } & Omit<React.ComponentProps<typeof Link>, "href">) {
  return (
    <Link href={href} className={classesFor(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
