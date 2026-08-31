import Link from "next/link";
import Image from "next/image";

export type FeaturedEdit = {
  title: string;
  href: string;
  image: string;
  caption: string;
};

export function FeaturedEdits({ edits }: { edits: FeaturedEdit[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3 md:gap-4">
      {edits.map((edit, i) => (
        <Link
          key={edit.href}
          href={edit.href}
          className="reveal group block"
          style={{ transitionDelay: `${i * 80}ms` }}
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-paper-deep">
            <Image
              src={edit.image}
              alt={edit.title}
              fill
              sizes="(min-width:768px) 33vw, 100vw"
              className="object-cover transition-transform duration-[1100ms] [transition-timing-function:var(--ease-editorial)] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-paper">
              <p className="text-[0.62rem] uppercase tracking-[0.22em] text-gold">
                {edit.caption}
              </p>
              <h3 className="mt-1 font-display text-2xl leading-tight">{edit.title}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
