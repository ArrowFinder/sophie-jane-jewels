"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DiamondMark } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const categories = ["Ring", "Necklace", "Earrings", "Bracelet", "Not sure yet"];
const eras = ["Georgian", "Victorian", "Art Nouveau", "Edwardian", "Art Deco", "Retro", "Mid-Century", "No preference"];
const budgets = [
  "Under $2,000",
  "$2,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000 – $15,000",
  "Open / not sure",
];

const fieldClass =
  "w-full border-b border-line bg-transparent py-3 text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink";

export function InquiryForm() {
  const [category, setCategory] = useState<string>("");
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  function toggleEra(era: string) {
    setSelectedEras((prev) =>
      prev.includes(era) ? prev.filter((e) => e !== era) : [...prev, era],
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Wire to email / Shopify customer / CRM when connected.
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-5 border border-line bg-paper-deep/30 px-8 py-16 text-center">
        <DiamondMark width={34} height={34} className="text-terracotta" />
        <h2 className="display-md">Thank you — your note is on its way to Sophie.</h2>
        <p className="max-w-md text-ink-soft">
          She personally reads every inquiry and will be in touch within one to two business days,
          often with a few pieces already in mind. In the meantime, feel free to keep exploring the
          collection.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-10">
      {/* Contact */}
      <fieldset className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs uppercase tracking-[0.16em] text-ink-soft">
            Your name
          </label>
          <input id="name" name="name" required autoComplete="name" className={fieldClass} placeholder="First and last" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-xs uppercase tracking-[0.16em] text-ink-soft">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={fieldClass} placeholder="you@email.com" />
        </div>
      </fieldset>

      {/* Category */}
      <fieldset>
        <legend className="mb-3 text-xs uppercase tracking-[0.16em] text-ink-soft">
          What are you looking for?
        </legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "border px-5 py-2.5 text-sm transition-colors",
                category === c ? "border-ink bg-ink text-paper" : "border-line text-ink-soft hover:border-ink hover:text-ink",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <input type="hidden" name="category" value={category} />
      </fieldset>

      {/* Eras */}
      <fieldset>
        <legend className="mb-3 text-xs uppercase tracking-[0.16em] text-ink-soft">
          Any eras you love? <span className="text-ink-faint normal-case tracking-normal">(optional, choose any)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {eras.map((era) => (
            <button
              key={era}
              type="button"
              onClick={() => toggleEra(era)}
              className={cn(
                "border px-4 py-2 text-sm transition-colors",
                selectedEras.includes(era) ? "border-oxblood bg-oxblood text-paper" : "border-line text-ink-soft hover:border-ink hover:text-ink",
              )}
            >
              {era}
            </button>
          ))}
        </div>
        <input type="hidden" name="eras" value={selectedEras.join(", ")} />
      </fieldset>

      {/* Budget */}
      <fieldset>
        <legend className="mb-3 text-xs uppercase tracking-[0.16em] text-ink-soft">
          Comfortable budget
        </legend>
        <div className="flex flex-wrap gap-2">
          {budgets.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBudget(b)}
              className={cn(
                "border px-5 py-2.5 text-sm transition-colors",
                budget === b ? "border-ink bg-ink text-paper" : "border-line text-ink-soft hover:border-ink hover:text-ink",
              )}
            >
              {b}
            </button>
          ))}
        </div>
        <input type="hidden" name="budget" value={budget} />
      </fieldset>

      {/* Message */}
      <div>
        <label htmlFor="message" className="mb-1 block text-xs uppercase tracking-[0.16em] text-ink-soft">
          Tell Sophie a little more
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={cn(fieldClass, "resize-none")}
          placeholder="An occasion, a person, a feeling, a piece you once saw and never forgot…"
        />
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg">
          Send to Sophie
        </Button>
        <p className="text-xs text-ink-faint">
          No obligation. Just the start of a conversation.
        </p>
      </div>
    </form>
  );
}
