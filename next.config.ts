import type { NextConfig } from "next";

import { ALTE_ADRESSEN } from "./lib/alte-adressen";

const nextConfig: NextConfig = {
  /**
   * DIE EINE GUELTIGE ADRESSE DER SEITE.
   *
   * Sie steht hier als Konstante und nicht mehrfach in den Regeln darunter.
   * Der Grund ist ein Fehler, der beim Vorbereiten des Domainumzugs am
   * 23.09.2026 fast eingebaut worden waere: Die Datei trug zwei
   * www-Weiterleitungen, eine fuer die laufende Domain und eine fuer die
   * geplante. Ein Suchen-und-Ersetzen haette daraus zwei gleiche Regeln
   * gemacht.
   *
   * Beim Umzug wird nur diese eine Zeile angefasst, und das erledigt
   * scripts/domain-umstellen.mjs zusammen mit den vier anderen Stellen im
   * Projekt, die die Domain kennen.
   */
  async redirects() {
    const HAUPTDOMAIN = "sv-fisch.com";

    /*
     * DIE BISHERIGE ADRESSE, die auf die Hauptadresse zeigt. Leer, solange
     * es keine gibt.
     *
     * Beim Umzug auf sv-fisch.de bleibt sv-fisch.com bestehen und liefert
     * ohne diese Regel denselben Inhalt unter einer zweiten Adresse. Das
     * ist derselbe Fehler, den die www-Regel darunter verhindert, nur eine
     * Ebene hoeher: Google sieht zwei Seiten, sucht sich eine aus, und die
     * Bekanntheit verteilt sich auf beide.
     *
     * scripts/domain-umstellen.mjs traegt hier beim Umzug die bisherige
     * Hauptdomain ein.
     */
    const ZWEITDOMAIN = "";

    return [
      /*
       * Ohne diese Weiterleitung ist die Seite unter zwei Adressen
       * erreichbar (mit und ohne www). Google wertet das als zwei getrennte
       * Seiten mit gleichem Inhalt und sucht sich selbst eine aus. Deshalb
       * geht www dauerhaft auf die Adresse ohne www; 308 wird von Google
       * wie 301 behandelt.
       */
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${HAUPTDOMAIN}` }],
        destination: `https://${HAUPTDOMAIN}/:path*`,
        permanent: true,
      },
      /*
       * Die bisherige Adresse, mit und ohne www, auf die Hauptadresse. Der
       * Pfad bleibt erhalten, damit ein alter Link auf eine Unterseite dort
       * ankommt und nicht auf der Startseite.
       *
       * Die Liste ist leer, wenn ZWEITDOMAIN leer ist. Eine Regel mit
       * leerem Host wuerde auf nichts passen, aber sie stuende in der
       * Ausgabe von next build und liesse jeden glauben, sie tue etwas.
       */
      /*
       * "as const" ist hier noetig und in der Regel darueber nicht: In einem
       * Array-Literal, das unmittelbar gegen Redirect[] geprueft wird,
       * erkennt TypeScript "host" als Literal. Sobald die Regeln aus einem
       * Ternaer kommen, wird daraus string, und das passt nicht mehr auf
       * "host" | "header" | "cookie" | "query". Der Build bricht dann mit
       * TS2322 ab, nicht zur Laufzeit.
       */
      ...(ZWEITDOMAIN
        ? [
            {
              source: "/:path*",
              has: [{ type: "host" as const, value: ZWEITDOMAIN }],
              destination: `https://${HAUPTDOMAIN}/:path*`,
              permanent: true,
            },
            {
              source: "/:path*",
              has: [{ type: "host" as const, value: `www.${ZWEITDOMAIN}` }],
              destination: `https://${HAUPTDOMAIN}/:path*`,
              permanent: true,
            },
          ]
        : []),
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
