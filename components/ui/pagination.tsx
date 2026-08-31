import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => {
    return p === 1 || p === totalPages || Math.abs(p - page) <= 2;
  });

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1">
      {page > 1 && (
        <Link
          href={hrefFor(page - 1)}
          className="px-3 py-2 text-[0.68rem] uppercase tracking-[0.16em] text-ink-soft hover:text-ink"
        >
          Prev
        </Link>
      )}
      {pages.map((p, i) => {
        const prev = pages[i - 1];
        return (
          <span key={p} className="flex items-center">
            {prev && p - prev > 1 && <span className="px-1 text-ink-faint">…</span>}
            <Link
              href={hrefFor(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "min-w-9 px-3 py-2 text-center text-[0.68rem] uppercase tracking-[0.16em]",
                p === page ? "bg-ink text-paper" : "text-ink-soft hover:text-ink",
              )}
            >
              {p}
            </Link>
          </span>
        );
      })}
      {page < totalPages && (
        <Link
          href={hrefFor(page + 1)}
          className="px-3 py-2 text-[0.68rem] uppercase tracking-[0.16em] text-ink-soft hover:text-ink"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
