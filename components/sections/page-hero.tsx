import Link from "next/link";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  align = "center",
  size = "default",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  breadcrumbs?: { name: string; href: string }[];
  align?: "center" | "left";
  size?: "default" | "compact";
}) {
  return (
    <section
      className={cn(
        "border-b border-line bg-paper-deep/30",
        size === "compact" ? "py-8 lg:py-10" : "py-12 lg:py-16",
      )}
    >
      <Container className={cn(align === "center" ? "text-center" : "text-left")}>
        {breadcrumbs && (
          <nav
            aria-label="Breadcrumb"
            className={cn(
              "mb-5 flex flex-wrap items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.16em] text-ink-faint",
              align === "center" && "justify-center",
            )}
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} className="transition-colors hover:text-oxblood">
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-ink-soft">{crumb.name}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className={cn(size === "compact" ? "display-lg" : "display-xl", eyebrow && "mt-3")}>{title}</h1>
        {intro && (
          <p className={cn("lede mt-4 max-w-2xl", align === "center" && "mx-auto")}>{intro}</p>
        )}
      </Container>
    </section>
  );
}
