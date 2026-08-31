import Link from "next/link";
import { Image } from "@/components/ui/image";
import { ArrowUpRight } from "@/components/ui/icons";

export type CategoryTile = {
  title: string;
  href: string;
  art: string;
  caption?: string;
};

export function CategoryTiles({ tiles }: { tiles: CategoryTile[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {tiles.map((tile, i) => (
        <Link
          key={tile.href}
          href={tile.href}
          className="reveal group relative block overflow-hidden bg-paper-deep"
          style={{ transitionDelay: `${(i % 4) * 70}ms` }}
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src={`/art/${tile.art}.svg`}
              alt={tile.title}
              fill
              sizes="(min-width:1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-[1100ms] [transition-timing-function:var(--ease-editorial)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-paper sm:p-5">
            <div>
              <h3 className="font-display text-lg leading-tight sm:text-xl">{tile.title}</h3>
              {tile.caption && (
                <p className="mt-0.5 text-[0.66rem] uppercase tracking-[0.2em] text-paper/75">
                  {tile.caption}
                </p>
              )}
            </div>
            <ArrowUpRight
              width={18}
              height={18}
              className="mb-0.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
