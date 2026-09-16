import { Image } from "@/components/ui/image";

/** Brand keywords from guidelines p.6 */
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
            {i > 0 && (
              <Image
                src="/icons/garnet/star.png"
                alt=""
                width={14}
                height={14}
                className="hidden h-2.5 w-2.5 object-contain sm:block"
              />
            )}
            <span className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-ink-soft">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
