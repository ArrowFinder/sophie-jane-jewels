"use client";

import { useState } from "react";
import Link from "next/link";
import { mainNav } from "@/lib/site";
import { CloseIcon, ChevronDown } from "@/components/ui/icons";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>("Shop");

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[70] lg:hidden",
        open ? "" : "pointer-events-none",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-ink/40 transition-opacity duration-400",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute left-0 top-0 flex h-dvh w-[86%] max-w-sm flex-col bg-paper transition-transform duration-500 [transition-timing-function:var(--ease-editorial)]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Logo compact />
          <button onClick={onClose} aria-label="Close menu" className="text-ink-soft hover:text-ink">
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4">
          {mainNav.map((item) => {
            const hasChildren = Boolean(item.columns?.length);
            const isOpen = expanded === item.label;
            return (
              <div key={item.label} className="border-b border-line/70">
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => setExpanded(isOpen ? null : item.label)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between py-4 font-display text-2xl"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn("transition-transform duration-300", isOpen && "rotate-180")}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid overflow-hidden transition-all duration-400",
                        isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="min-h-0">
                        {item.columns!.map((col) => (
                          <div key={col.heading} className="mb-4">
                            <p className="eyebrow eyebrow-muted mb-2">{col.heading}</p>
                            <ul className="space-y-2.5">
                              {col.links.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className="text-ink-soft hover:text-oxblood"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block py-4 font-display text-2xl hover:text-oxblood"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-line px-5 py-5 text-sm text-ink-soft">
          <Link href="/find-your-piece" onClick={onClose} className="link-underline">
            Book a personal appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
