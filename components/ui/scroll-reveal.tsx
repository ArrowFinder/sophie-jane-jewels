"use client";

import { useEffect } from "react";

/**
 * Progressive enhancement: reveals any element with the `.reveal` class as it
 * scrolls into view. Elements are fully visible without JS (see globals.css
 * reduced-motion handling), so this never blocks content or SEO.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const observeAll = () =>
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => observer.observe(el));

    observeAll();

    // Catch content added after navigation.
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
