import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { OfficialStamp } from "@/components/brand/official-mark";

export function Hero() {
  return (
    <section className="relative flex min-h-[70svh] items-end overflow-hidden bg-ink text-paper sm:min-h-[78svh] lg:min-h-[calc(100svh-132px)] lg:items-center">
      <Image
        src="/photos/hero-desert.png"
        alt="Sophie Jane Jewels — antique gold jewelry worn at golden hour in the California desert"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_30%] sm:object-[center_28%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/35" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-ink/55 via-ink/15 to-transparent lg:block" />

      <div className="relative z-10 mx-auto flex w-full max-w-[100rem] flex-col items-center px-6 py-12 text-center sm:px-8 sm:py-16 lg:items-start lg:px-12 lg:py-20 lg:text-left">
        <OfficialStamp size={44} className="drop-shadow-md" />
        <h1 className="mt-7 max-w-xl font-display text-[2.15rem] font-medium tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
          New Arrivals
        </h1>
        <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-paper/90 sm:text-base">
          One-of-a-kind antique, vintage and estate jewels — just in, and rarely here for long.
        </p>
        <ButtonLink
          href="/collections/new-arrivals"
          size="lg"
          variant="outline"
          className="mt-8 border-paper/85 text-paper hover:border-paper hover:bg-paper hover:text-ink"
        >
          Shop Now
        </ButtonLink>
      </div>
    </section>
  );
}
