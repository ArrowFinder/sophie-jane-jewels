import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Sparkle } from "@/components/brand/marks";

export function ConciergeCta() {
  return (
    <section className="relative overflow-hidden bg-oxblood text-paper">
      <Image
        src="/photos/hero-desert.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-oxblood/55" />
      <Container className="relative z-10 py-14 text-center lg:py-20">
        <Sparkle size={14} className="mx-auto text-gold" />
        <p className="eyebrow mt-5 text-gold">Find Your Piece</p>
        <h2 className="display-xl mx-auto mt-5 max-w-3xl text-balance">
          Not sure where to begin?
          <br />
          <span className="display-italic">Let&rsquo;s find it together.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg font-light leading-relaxed text-paper/85">
          Tell Sophie what you love — an era, an occasion, a feeling — and she&rsquo;ll
          hand-select pieces made for you. Complimentary, personal, and the closest
          thing to shopping the salon.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink
            href="/find-your-piece"
            size="lg"
            className="border-gold bg-gold text-ink hover:border-paper hover:bg-paper"
          >
            Book an Appointment
          </ButtonLink>
          <ButtonLink
            href="/about"
            size="lg"
            variant="outline"
            className="border-paper/50 text-paper hover:border-paper hover:bg-paper hover:text-oxblood"
          >
            Meet Sophie
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
