import type { Metadata } from "next";
import { Cormorant_Garamond, Mulish, Courier_Prime } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { assetPath } from "@/lib/assets";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const courier = Courier_Prime({
  subsets: ["latin"],
  variable: "--font-courier",
  display: "swap",
  weight: ["400", "700"],
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
    icon: [{ url: assetPath("/icon.svg"), type: "image/svg+xml" }],
    apple: assetPath("/icon.svg"),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${mulish.variable} ${courier.variable} h-full antialiased`}
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
