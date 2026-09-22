import type { NextConfig } from "next";

import { ALTE_ADRESSEN } from "./lib/alte-adressen";

const nextConfig: NextConfig = {
  /**
   * Die Seite ist unter zwei Adressen erreichbar (sv-fisch.com und
   * www.sv-fisch.com). Ohne Weiterleitung wertet Google das als zwei
   * getrennte Seiten mit dem gleichen Inhalt und sucht sich selbst eine
   * aus. Deshalb ist sv-fisch.com die eine gueltige Adresse, www wird
   * dauerhaft (308, von Google wie 301 behandelt) dorthin geschickt.
   *
   * Muss beim Umzug auf eine andere Domain hier UND in lib/config.ts
   * angepasst werden.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sv-fisch.com" }],
        destination: "https://sv-fisch.com/:path*",
        permanent: true,
      },
      /*
       * Dieselbe Regel fuer www.sv-fisch.de, vorbereitet fuer den geplanten
       * Umzug auf diese Domain. Sie greift erst, wenn die Domain auf diese
       * Seite zeigt, und stoert bis dahin nicht.
       */
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sv-fisch.de" }],
        destination: "https://sv-fisch.de/:path*",
        permanent: true,
      },
      /*
       * Die beiden Bambini-Seiten sind am 22.09.2026 weggefallen, ihre
       * Inhalte stehen jetzt als Ansprechpartner unter /fussball/jugend.
       * Begruendung in app/fussball/jugend/page.tsx.
       *
       * WARUM UMLEITEN UND NICHT EINFACH LOESCHEN: Beide Adressen standen
       * seit Monaten im Menue und im Sitemap, Google kennt sie also. Eine
       * geloeschte Seite ohne Weiterleitung ergibt einen 404, und der
       * taucht in der Search Console als Fehler auf, solange jemand den
       * alten Link noch irgendwo stehen hat.
       *
       * Die laengere Adresse steht ZUERST. Next nimmt die erste passende
       * Regel, und "/fussball/bambini" wuerde sonst auch
       * "/fussball/bambini/spielplan" schlucken, bevor die zweite Regel
       * ueberhaupt geprueft wird.
       */
      {
        source: "/fussball/bambini/spielplan",
        destination: "/fussball/jugend",
        permanent: true,
      },
      {
        source: "/fussball/bambini",
        destination: "/fussball/jugend",
        permanent: true,
      },
      /*
       * DIE 32 ADRESSEN DER BISHERIGEN SEITE sv-fisch.de.
       *
       * Vorbereitet am 23.09.2026, weil die neue Seite spaeter auf diese
       * Domain umziehen soll. Ohne diese Regeln ergaebe an dem Tag jeder
       * Link auf die alte Seite einen 404, und die stehen an Stellen, die
       * niemand mehr einsammeln kann: in Suchmaschinen, alten Mails,
       * Lesezeichen, auf FuPa und auf Sponsorenseiten.
       *
       * Welche Adresse wohin zeigt und warum, steht in lib/alte-adressen.ts.
       * Diese Schleife macht daraus nur Regeln.
       *
       * Sie stehen ZULETZT, damit keine von ihnen eine der Regeln oben
       * verdeckt. Alle enden auf .html und koennen mit den Pfaden dieser
       * Seite ohnehin nicht kollidieren.
       */
      ...ALTE_ADRESSEN.map(({ alt, neu }) => ({
        source: `/${alt}`,
        destination: neu,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
