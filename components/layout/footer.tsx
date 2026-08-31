import Link from "next/link";
import { footerNav, siteConfig } from "@/lib/site";
import { NewsletterForm } from "./newsletter-form";
import { InstagramIcon, PinterestIcon } from "@/components/ui/icons";
import { LogoMark } from "./logo";
import { OfficialLockup } from "@/components/brand/official-mark";

export function Footer() {
  return (
    <footer className="mt-auto bg-oxblood-deep text-paper">
      <div className="mx-auto max-w-[100rem] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-md">
            <OfficialLockup tone="cream" size="lg" />
            <h2 className="mt-8 font-display text-3xl leading-tight">
              Keep an eye on what&rsquo;s new.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-paper/70">
              First looks at new arrivals, stories behind the pieces, and the occasional
              note from Sophie. Most pieces are one of a kind and sell quickly.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
            <div className="mt-8 flex items-center gap-4">
              <a
                href={siteConfig.social.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper/70 transition-colors hover:text-gold"
              >
                <InstagramIcon />
              </a>
              <a
                href={siteConfig.social.pinterest}
                aria-label="Pinterest"
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper/70 transition-colors hover:text-gold"
              >
                <PinterestIcon />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {footerNav.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <h3 className="eyebrow text-gold">{col.heading}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-paper/75 transition-colors hover:text-paper"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center border-t border-paper/15 pt-10">
          <LogoMark size={56} />
        </div>

        <div className="mt-8 flex flex-col gap-4 text-xs text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. Est. {siteConfig.est} ·{" "}
            {siteConfig.addressLocality}, {siteConfig.addressRegion}.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/journal/shipping-and-care" className="hover:text-paper">
              Shipping &amp; Returns
            </Link>
            <Link href="/find-your-piece" className="hover:text-paper">
              Contact
            </Link>
            <Link href="/journal/how-we-authenticate" className="hover:text-paper">
              Authenticity
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
