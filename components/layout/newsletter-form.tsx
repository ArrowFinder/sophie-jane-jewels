"use client";

import { useState } from "react";
import { ArrowRight } from "@/components/ui/icons";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    // Wire to Shopify Customer / Klaviyo when connected.
    setDone(true);
    setEmail("");
  }

  if (done) {
    return (
      <p className="text-sm text-paper/80">
        Thank you — you&rsquo;re on the list. Watch your inbox for first looks at new arrivals.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-3 border-b border-paper/30 pb-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address"
        className="w-full bg-transparent py-1 text-paper outline-none placeholder:text-paper/50"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="shrink-0 text-paper/80 transition-colors hover:text-paper"
      >
        <ArrowRight />
      </button>
    </form>
  );
}
