"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "@/components/ui/icons";
import type { SortKey } from "@/lib/shopify";
import { cn } from "@/lib/utils";

const options: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "title", label: "Alphabetical" },
];

export function CollectionToolbar({ count, sort }: { count: number; sort: SortKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function setSort(value: SortKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") params.delete("sort");
    else params.set("sort", value);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setOpen(false);
  }

  const current = options.find((o) => o.value === sort) ?? options[0];

  return (
    <div className="flex items-center justify-between border-b border-line py-4">
      <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
        {count} {count === 1 ? "piece" : "pieces"}
      </p>
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink transition-colors hover:text-oxblood"
        >
          <span className="text-ink-faint">Sort:</span> {current.label}
          <ChevronDown width={14} height={14} className={cn("transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <ul
            role="listbox"
            className="absolute right-0 top-full z-20 mt-2 w-56 border border-line bg-paper py-1 shadow-lg"
          >
            {options.map((o) => (
              <li key={o.value} role="option" aria-selected={o.value === sort}>
                <button
                  onClick={() => setSort(o.value)}
                  className={cn(
                    "block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-paper-deep",
                    o.value === sort ? "text-oxblood" : "text-ink-soft",
                  )}
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
