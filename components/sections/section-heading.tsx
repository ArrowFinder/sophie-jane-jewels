import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  link,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  link?: { label: string; href: string };
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className={cn("display-lg", eyebrow && "mt-3")}>{title}</h2>
        {intro && <p className="lede mt-4">{intro}</p>}
      </div>
      {link && (
        <Link
          href={link.href}
          className="group inline-flex shrink-0 items-center gap-2 text-[0.74rem] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-oxblood"
        >
          {link.label}
          <ArrowRight
            width={16}
            height={16}
            className="transition-transform duration-500 group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}
