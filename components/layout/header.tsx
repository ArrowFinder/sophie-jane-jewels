"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/site";
import { useCart } from "@/components/cart/cart-provider";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { SearchOverlay } from "./search-overlay";
import { BagIcon, MenuIcon, SearchIcon, ArrowUpRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Close any open menus when the route changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  const activeItem = mainNav.find((i) => i.label === activeMenu && i.columns?.length);

  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-40"
        onMouseLeave={() => setActiveMenu(null)}
      >
        {/* Announcement bar */}
        <div className="flex h-9 items-center justify-center bg-oxblood px-4 text-center text-[0.68rem] uppercase tracking-[0.22em] text-paper">
          <span className="truncate">
            Est. 2001 · Fine antique &amp; estate jewelry · Complimentary insured shipping
          </span>
        </div>

        <header
          className={cn(
            "relative border-b border-line bg-paper/97 text-ink backdrop-blur-md transition-shadow duration-500",
            scrolled && "shadow-[0_10px_28px_-18px_rgba(36,27,22,0.45)]",
          )}
        >
          <div className="mx-auto grid h-[4.5rem] max-w-[100rem] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:h-24 lg:px-12">
            {/* Left: desktop nav / mobile menu */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="-ml-1 p-1 lg:hidden"
              >
                <MenuIcon width={22} height={22} />
              </button>
              <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Primary">
                {mainNav.map((item) => (
                  <div
                    key={item.label}
                    onMouseEnter={() => setActiveMenu(item.columns?.length ? item.label : null)}
                    className={cn(
                      (item.label === "Journal" || item.label === "About") && "hidden xl:block",
                    )}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "relative py-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-70",
                        activeMenu === item.label && "opacity-70",
                      )}
                    >
                      {item.label}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>

            {/* Center: logo */}
            <div className="flex justify-center">
              <Logo priority />
            </div>

            {/* Right: actions */}
            <div className="flex items-center justify-end gap-1 sm:gap-3">
              <Link
                href="/find-your-piece"
                className="hidden py-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-70 xl:inline"
              >
                Book
              </Link>
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="p-2 transition-opacity hover:opacity-70"
              >
                <SearchIcon width={20} height={20} />
              </button>
              <button
                onClick={openCart}
                aria-label={`Open bag, ${count} items`}
                className="relative p-2 transition-opacity hover:opacity-70"
              >
                <BagIcon width={20} height={20} />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-oxblood px-1 text-[0.6rem] font-medium text-paper">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mega menu panel */}
          <div
            className={cn(
              "absolute inset-x-0 top-full hidden overflow-hidden border-t border-line bg-paper text-ink transition-[max-height,opacity] duration-500 [transition-timing-function:var(--ease-editorial)] lg:block",
              activeItem ? "max-h-[30rem] opacity-100 shadow-[0_24px_40px_-24px_rgba(36,27,22,0.35)]" : "max-h-0 opacity-0",
            )}
          >
            {activeItem && (
              <div className="mx-auto grid max-w-[100rem] grid-cols-[1fr_1fr_1fr_1.1fr] gap-10 px-12 py-10">
                {activeItem.columns!.map((col) => (
                  <div key={col.heading}>
                    <p className="eyebrow eyebrow-muted mb-4">{col.heading}</p>
                    <ul className="space-y-3">
                      {col.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="group block">
                            <span className="font-display text-lg leading-tight transition-colors group-hover:text-oxblood">
                              {link.label}
                            </span>
                            {link.description && (
                              <span className="block text-xs text-ink-faint">
                                {link.description}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {activeItem.feature && (
                  <Link href={activeItem.feature.href} className="group relative overflow-hidden">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-deep">
                      <Image
                        src={
                          activeItem.feature.image ??
                          `/art/${activeItem.feature.imageHandle}.svg`
                        }
                        alt={activeItem.feature.title}
                        fill
                        sizes="320px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5 text-paper">
                        <p className="text-[0.62rem] uppercase tracking-[0.24em] text-gold">
                          {activeItem.feature.eyebrow}
                        </p>
                        <p className="mt-1 flex items-center gap-1 font-display text-lg leading-tight">
                          {activeItem.feature.title}
                          <ArrowUpRight width={16} height={16} className="shrink-0" />
                        </p>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            )}
          </div>
        </header>
      </div>

      <div aria-hidden className="h-[108px] lg:h-[132px]" />

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
