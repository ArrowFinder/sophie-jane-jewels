"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const suggestions = [
  { label: "Antique rings", href: "/collections/rings" },
  { label: "Victorian", href: "/search?q=victorian" },
  { label: "Art Deco", href: "/search?q=art+deco" },
  { label: "Antique gold", href: "/collections/antique-gold" },
  { label: "Sapphire", href: "/search?q=sapphire" },
  { label: "The Archive", href: "/archive" },
];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose();
    setQuery("");
  }

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[60] transition-opacity duration-300",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className={cn(
          "relative mx-auto max-w-3xl bg-paper px-6 py-10 shadow-2xl transition-transform duration-400 [transition-timing-function:var(--ease-editorial)] sm:px-10 sm:py-14",
          open ? "translate-y-0" : "-translate-y-6",
        )}
      >
        <button
          onClick={onClose}
          aria-label="Close search"
          className="absolute right-5 top-5 text-ink-soft hover:text-ink"
        >
          <CloseIcon />
        </button>
        <p className="eyebrow eyebrow-muted">Search the Collection &amp; Archive</p>
        <form onSubmit={submit} className="mt-4 flex items-center gap-3 border-b border-ink pb-3">
          <SearchIcon className="text-ink-soft" width={22} height={22} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “Victorian sapphire 1850”, “antique gold”…"
            className="w-full bg-transparent font-display text-2xl outline-none placeholder:text-ink-faint sm:text-3xl"
            aria-label="Search products"
          />
        </form>
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">Popular</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                onClick={onClose}
                className="border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
