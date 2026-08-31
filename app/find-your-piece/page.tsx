import type { Metadata } from "next";
import { Image } from "@/components/ui/image";
import { Container } from "@/components/ui/container";
import { InquiryForm } from "@/components/find-your-piece/inquiry-form";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Find Your Piece — Personal Jewelry Concierge",
  description:
    "Tell Sophie what you're looking for and she'll personally hand-select antique and vintage pieces made for you. A complimentary, no-obligation jewelry concierge.",
  alternates: { canonical: "/find-your-piece" },
};

const steps = [
  { n: "01", title: "Tell Sophie", body: "Share what you love — an era, an occasion, a budget, a feeling. The more, the better." },
  { n: "02", title: "She curates", body: "Sophie hand-selects pieces from the collection and her network of dealers, chosen for you." },
  { n: "03", title: "You decide", body: "Review your edit at your pace. No pressure, no obligation — just her eye, at your service." },
];

export default function FindYourPiecePage() {
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Find Your Piece", href: "/find-your-piece" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <section className="relative overflow-hidden border-b border-line bg-oxblood text-paper">
        <Image
          src="/photos/salon-lounge.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-oxblood/50" />
        <Container className="relative z-10 py-16 lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow text-gold">The Concierge · Est. 2001</p>
            <h1 className="display-hero mt-5 text-balance">Find your piece.</h1>
            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-paper/85">
              The best pieces rarely come from scrolling. Tell Sophie what you&rsquo;re after and
              she&rsquo;ll do what she does best — find the one that&rsquo;s unmistakably yours. It&rsquo;s
              complimentary, personal, and the closest thing to shopping her collection in person.
            </p>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-14 lg:py-20">
        <Container>
          <div className="grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="reveal">
                <p className="font-display text-4xl text-rose">{step.n}</p>
                <h2 className="mt-3 font-display text-xl">{step.title}</h2>
                <p className="mt-2 leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Form */}
      <section className="border-t border-line bg-paper-deep/30 py-14 lg:py-20">
        <Container size="narrow">
          <div className="mb-10 text-center">
            <p className="eyebrow">Start the Conversation</p>
            <h2 className="display-lg mt-3">A few details is all it takes</h2>
          </div>
          <InquiryForm />
          <p className="mt-10 text-center text-sm text-ink-soft">
            Prefer email? Write to{" "}
            <a href={`mailto:${siteConfig.email}`} className="link-underline text-oxblood">
              {siteConfig.email}
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
