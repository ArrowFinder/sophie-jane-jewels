import Link from "next/link";
import { Image } from "@/components/ui/image";
import type { Product } from "@/lib/shopify/types";
import { formatMoney, cn } from "@/lib/utils";
import { isSold, pieceHref } from "@/lib/shopify/archive";

export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  className,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const secondary = product.images[1];
  const sold = isSold(product);
  const href = pieceHref(product);
  const isOneOfAKind = product.tags.includes("one-of-a-kind");

  return (
    <article className={cn("group", className)}>
      <Link href={href} className="block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-deep">
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText}
            fill
            sizes={sizes}
            priority={priority}
            className={cn(
              "object-cover transition-all duration-[900ms] [transition-timing-function:var(--ease-editorial)]",
              sold && "opacity-90",
              secondary && !sold ? "group-hover:opacity-0" : "group-hover:scale-[1.04]",
            )}
          />
          {secondary && !sold && (
            <Image
              src={secondary.url}
              alt={secondary.altText}
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-[900ms] [transition-timing-function:var(--ease-editorial)] group-hover:opacity-100"
            />
          )}

          <div className="absolute left-0 top-0 flex flex-col gap-1.5 p-3">
            {sold ? (
              <Badge className="bg-ink/85 text-paper">Sold</Badge>
            ) : (
              isOneOfAKind && <Badge className="bg-paper/90 text-ink">One of a Kind</Badge>
            )}
          </div>
        </div>
      </Link>

      <div className="pt-4">
        {product.details?.era && <p className="meta">{product.details.era}</p>}
        <h3 className="mt-1">
          <Link
            href={href}
            className="font-display text-[1.15rem] leading-snug transition-colors hover:text-oxblood"
          >
            {product.title}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm text-ink-soft">
          {sold ? (
            <>
              Sold
              {product.details?.circa ? ` · ${product.details.circa}` : ""}
            </>
          ) : (
            formatMoney(product.priceRange.minVariantPrice)
          )}
        </p>
      </div>
    </article>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.16em] backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}
