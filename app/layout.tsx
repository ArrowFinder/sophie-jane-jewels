import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { assetPath } from "@/lib/assets";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";

/** Web-safe stand-in for ED Checa (brand display / logo font). */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/** Web-safe stand-in for Avenir (UI, body, CTAs). */
const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "antique jewelry",
    "vintage jewelry",
    "antique gold jewelry",
    "estate jewelry",
    "one of a kind jewelry",
    "Victorian jewelry",
    "Art Deco jewelry",
    "Georgian jewelry",
    "Edwardian jewelry",
    "previously sold antique jewelry",
    "vintage gold sapphire ring",
    "estate jewelry archive",
  ],
  authors: [{ name: siteConfig.founder }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: assetPath("/photos/hero-desert.png"),
        width: 1600,
        height: 900,
        alt: `${siteConfig.name} — Fine Antique & Estate Jewelry`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [assetPath("/photos/hero-desert.png")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: assetPath("/icon.png"), type: "image/png", sizes: "32x32" },
      { url: assetPath("/icon-192.png"), type: "image/png", sizes: "192x192" },
    ],
    apple: assetPath("/apple-icon.png"),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper">
        <CartProvider>
          <Header />
          <main id="main" className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <ScrollReveal />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </body>
    </html>
  );
}
