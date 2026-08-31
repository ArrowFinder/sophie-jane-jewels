import Link from "next/link";
import Image from "next/image";

const shops = [
  { title: "Rings", href: "/collections/rings", image: "/photos/shop-rings.png" },
  { title: "Necklaces", href: "/collections/necklaces", image: "/photos/shop-necklaces.png" },
  { title: "Earrings", href: "/collections/earrings", image: "/photos/shop-earrings.png" },
  { title: "Bracelets", href: "/collections/bracelets", image: "/photos/shop-bracelets.png" },
  { title: "Engagement", href: "/collections/engagement", image: "/photos/shop-engagement.png" },
  { title: "New Arrivals", href: "/collections/new-arrivals", image: "/photos/lifestyle-marble.png" },
];

export function ShopStrip() {
  return (
    <nav aria-label="Shop by type" className="bg-ink">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {shops.map((shop) => (
          <Link
            key={shop.href}
            href={shop.href}
            className="group relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]"
          >
            <Image
              src={shop.image}
              alt={shop.title}
              fill
              sizes="(min-width:1024px) 16vw, (min-width:640px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/30 transition-colors duration-500 group-hover:bg-ink/15" />
            <span className="absolute inset-x-0 bottom-0 p-3 text-center font-sans text-[0.68rem] font-medium uppercase tracking-[0.18em] text-paper sm:p-4 sm:text-[0.72rem]">
              {shop.title}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
