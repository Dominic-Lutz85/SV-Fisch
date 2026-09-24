import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import Meldungsleiste from "@/components/Meldungsleiste";
import { siteConfig } from "@/lib/config";
import { getMeldungen } from "@/lib/content";
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
    /*
       addressLines[2] ist eine Zeile Anschrift, "54439 Fisch". Sie stand
       geschlossen in addressLocality, und damit hiess der Ort fuer jede
       Suchmaschine "54439 Fisch". Hier aufgeteilt statt in lib/config.ts,
       weil die Zeile dort so auf der Seite gedruckt wird.
    */
    postalCode: siteConfig.contact.addressLines[2].split(" ")[0],
    addressLocality: siteConfig.contact.addressLines[2]
      .split(" ")
      .slice(1)
      .join(" "),
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
        {/*
          DER AUSHANG, seit 08.09.2026. Er steht ZWISCHEN Kopfleiste und
          Inhalt und damit auf jeder Seite: Eine Spielabsage betrifft auch
          den, der gerade den Kader liest.

          Die Begruendung zu Stufen, Sortierung und Selbstabbau steht in
          components/Meldungsleiste.tsx und bei Meldung in types/content.ts.
          Ist die Liste leer, rendert die Komponente nichts, und das ist der
          Normalfall: Ein Aushang, an dem immer etwas haengt, wird nicht mehr
          gelesen.
        */}
        <Meldungsleiste meldungen={getMeldungen()} />
        {/*
          overflow-x: clip gegen ein seitliches Verschieben der Seite um
          wenige Pixel.

          BEFUND, 22.09.2026: Bei 390 Pixeln liess sich die Startseite 3 Pixel
          zur Seite schieben, /fussball/spielplan 2 Pixel, /impressum und
          /galerie waren sauber. Beim Spielplan war die Ursache echt und ist
          behoben: "SV Wasserliesch/Oberbillig" ist ein Wort ohne
          Umbruchstelle, es brauchte overflow-wrap in Fixtures.tsx.

          Auf der Startseite bleiben 3 Pixel, und dafuer habe ich KEINE
          einzelne Ursache gefunden. Gesucht wurde mit drei Verfahren:
          Elemente, deren Inhalt breiter ist als sie selbst; die
          Ausblende-Methode ueber jedes Element; und der Vergleich von
          scrollWidth auf jeder Ebene. Alle Treffer sind gewollte randlose
          Elemente mit negativem Aussenabstand (Bildfenster, Mini-Tabelle,
          Nachrichten-Karussell), und keines ragt sichtbar heraus. Es bleibt
          die Summe von Nachkommastellen, also je unter einem Pixel pro
          Element.

          DESHALB EINE ABSICHERUNG UND KEINE URSACHENBEHEBUNG, und das steht
          hier, damit es niemand fuer Letzteres haelt.

          clip und nicht hidden: hidden macht aus dem Element einen
          Scroll-Container, und das bricht position: sticky in den Kindern
          sowie scrollIntoView. clip tut beides nicht. Nachgemessen: Der
          Kopfleiste klebt weiterhin bei y=0, und beide waagerechten Scroller
          (Spielband und Nachrichten-Karussell) lassen sich unveraendert
          wischen.

          An main und nicht an html oder body: So bleibt alles ausserhalb des
          Inhaltsbereichs unberuehrt.
        */}
        <main id="main-content" className="flex-1 seite-ohne-querlauf">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
