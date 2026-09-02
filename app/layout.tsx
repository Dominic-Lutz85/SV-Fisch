import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Fußball & Gymnastik`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Fußball & Gymnastik`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Fußball & Gymnastik`,
    description: siteConfig.description,
  },
  /*
   * Hier stand eine icons-Angabe mit festen Adressen. Sie war falsch und hat
   * dabei noch die richtige verdraengt.
   *
   * Next legt die Verweise selbst an, sobald app/icon.svg und app/apple-icon.tsx
   * existieren, und zwar auf /icon.svg und /apple-icon mit angehaengtem
   * Streuwert gegen alte Zwischenspeicher. Die Handangabe hat daraus
   * /apple-icon.png gemacht, und diese Adresse gibt es nicht: Apple-Geraete
   * bekamen beim Ablegen auf dem Startbildschirm eine 404 statt des Wappens.
   *
   * Gefunden ueber die 404 in der Netzwerkliste, nicht im Browser sichtbar.
   * Nachlesbar in node_modules/next/dist/docs/01-app/03-api-reference/
   * 03-file-conventions/01-metadata/app-icons.md.
   */
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: siteConfig.name,
  sport: ["Fußball", "Gymnastik", "Darts"],
  foundingDate: `${siteConfig.founded}`,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.svg`,
  email: siteConfig.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.contact.addressLines[1],
    addressLocality: siteConfig.contact.addressLines[2],
    addressCountry: "DE",
  },
  sameAs: [siteConfig.social.instagram, siteConfig.social.facebook].filter(
    Boolean
  ),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-flaeche text-text">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-fisch-yellow focus:text-fisch-black focus:px-4 focus:py-2 focus:font-semibold"
        >
          Zum Inhalt springen
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
