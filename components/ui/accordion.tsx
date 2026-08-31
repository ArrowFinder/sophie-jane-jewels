"use client";

import { useState } from "react";
import { PlusIcon, MinusIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  title: string;
  content: React.ReactNode;
};

export function Accordion({
  items,
  defaultOpen,
}: {
  items: AccordionItem[];
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen ?? null);

  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title} className="border-b border-line">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="text-xs font-medium uppercase tracking-[0.16em]">{item.title}</span>
              {isOpen ? (
                <MinusIcon width={16} height={16} className="text-ink-soft" />
              ) : (
                <PlusIcon width={16} height={16} className="text-ink-soft" />
              )}
            </button>
            <div
              className={cn(
                "grid overflow-hidden transition-all duration-400 [transition-timing-function:var(--ease-editorial)]",
                isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 text-sm leading-relaxed text-ink-soft">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
