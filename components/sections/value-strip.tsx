import { Sparkle } from "@/components/brand/marks";

const values = [
  "Heritage",
  "Rarity",
  "Storytelling",
  "Luxury",
  "Sustainability",
  "Discovery",
  "Trust",
];

export function ValueStrip() {
  return (
    <div className="border-y border-line bg-paper">
      <div className="mx-auto flex max-w-[100rem] flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 py-3.5 sm:gap-x-8 sm:px-8 lg:px-12">
        {values.map((value, i) => (
          <div key={value} className="flex items-center gap-5 sm:gap-8">
            {i > 0 && <Sparkle size={8} className="hidden text-gold sm:block" />}
            <span className="text-[0.68rem] uppercase tracking-[0.22em] text-ink-soft">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
