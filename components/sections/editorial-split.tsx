import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EditorialSplit({
  eyebrow,
  title,
  body,
  art,
  image,
  imageAlt,
  cta,
  reverse = false,
  arch = false,
}: {
  eyebrow?: string;
  title: string;
  body: React.ReactNode;
  art?: string;
  image?: string;
  imageAlt: string;
  cta?: { label: string; href: string };
  reverse?: boolean;
  arch?: boolean;
}) {
  const src = image ?? (art ? `/art/${art}.svg` : "");
  return (
    <div
      className={cn(
        "grid items-center gap-10 lg:grid-cols-2 lg:gap-20",
        reverse && "lg:[&>*:first-child]:order-2",
      )}
    >
      <div
        className={cn(
          "reveal relative aspect-[4/5] w-full overflow-hidden bg-paper-deep sm:aspect-[5/4] lg:aspect-[4/5]",
          arch && "frame-arch",
        )}
      >
        <Image
          src={src}
          alt={imageAlt}
          fill
          sizes="(min-width:1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className={cn("reveal max-w-xl", reverse ? "lg:pr-6" : "lg:pl-6")}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="display-lg mt-4">{title}</h2>
        <div className="lede mt-5 space-y-4">{body}</div>
        {cta && (
          <ButtonLink href={cta.href} variant="outline" size="md" className="mt-8">
            {cta.label}
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
