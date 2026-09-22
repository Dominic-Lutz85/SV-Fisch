/*
 * Die Adressen der bisherigen Vereinsseite sv-fisch.de und wohin sie zeigen,
 * wenn die neue Seite dort einzieht.
 *
 * WARUM DAS ANGELEGT WIRD, BEVOR DER UMZUG ANSTEHT:
 *
 * Die alte Seite liegt seit Jahren unter sv-fisch.de, und ihre Adressen sind
 * an Stellen verteilt, die niemand mehr einsammeln kann: in Suchmaschinen, in
 * alten Vereinsmails, in WhatsApp-Gruppen, auf FuPa, auf Sponsorenseiten,
 * in Lesezeichen. Zieht die neue Seite dort ein, ohne diese Liste, ergibt
 * jeder dieser Links einen 404.
 *
 * Gezaehlt am 23.09.2026 aus sitemap.xml der alten Seite: 32 Adressen.
 *
 * Die Liste steht in einer eigenen Datei und nicht in next.config.ts, weil
 * sie Inhalt ist und keine Konfiguration: Wer sie prueft, prueft
 * Seitenzuordnungen, nicht das Bauwerkzeug.
 *
 * SOLANGE DIE SEITE AUF sv-fisch.com LAEUFT, richten diese Regeln keinen
 * Schaden an: Die Pfade enden auf .html, und solche Adressen gibt es hier
 * nicht. Sie greifen erst, wenn jemand sie aufruft, und das tut nur, wer von
 * der alten Seite kommt.
 */

export type AlteAdresse = {
  /** Der Pfad auf der alten Seite, ohne fuehrenden Schraegstrich. */
  alt: string;
  /** Wohin er zeigt. */
  neu: string;
  /** Warum gerade dorthin, wenn es nicht offensichtlich ist. */
  grund?: string;
};

export const ALTE_ADRESSEN: AlteAdresse[] = [
  { alt: "index.html", neu: "/" },
  {
    alt: "home-weihn.html",
    neu: "/",
    grund: "Weihnachtsfassung der Startseite, inhaltlich dieselbe Seite",
  },

  { alt: "aktuelles.html", neu: "/aktuelles" },
  {
    alt: "jahreshauptversammlung.html",
    neu: "/aktuelles",
    grund:
      "Einzelmeldung von 2016. Die aktuelle Einladung steht als eigener " +
      "Beitrag unter /aktuelles, deshalb auf die Uebersicht und nicht auf " +
      "den Beitrag: Der wechselt jedes Jahr, die Uebersicht bleibt.",
  },

  { alt: "kalender.html", neu: "/kalender" },
  { alt: "kalender-1.html", neu: "/kalender", grund: "Doppelte Seite im Baukasten" },
  { alt: "termine.html", neu: "/kalender" },

  { alt: "galerie.html", neu: "/galerie" },
  /*
   * Die fuenf Kirmesseiten und die 60-Jahr-Feier waren eigene Seiten mit
   * Bildern. Auf der neuen Seite ist die Galerie der Ort dafuer. Sobald die
   * Bilder dieser Jahre als Alben vorliegen, kann man hier genauer werden;
   * bis dahin ist die Galerie die richtige Antwort und kein Notnagel.
   */
  { alt: "kirmes2016.html", neu: "/galerie" },
  { alt: "kirmes2017.html", neu: "/galerie" },
  { alt: "kirmes2022.html", neu: "/galerie" },
  { alt: "kirmes2023.html", neu: "/galerie" },
  { alt: "kirmes2024.html", neu: "/galerie" },
  { alt: "60-jahre.html", neu: "/galerie", grund: "Bilder der 60-Jahr-Feier 2024" },

  { alt: "elfer-turnier.html", neu: "/elfer-turnier" },
  {
    alt: "elfer-turnier---kopieren.html",
    neu: "/elfer-turnier",
    grund: "Arbeitskopie, die im Baukasten veroeffentlicht blieb",
  },

  { alt: "spielplan.html", neu: "/fussball/spielplan" },
  { alt: "tabelle.html", neu: "/fussball/tabelle" },
  { alt: "kader.html", neu: "/fussball/kader" },
  { alt: "1.-mannschaft.html", neu: "/fussball/kader" },
  /*
   * Bambini und AH gibt es nicht mehr als eigene Mannschaften. Beide Adressen
   * zeigen auf /fussball/jugend beziehungsweise auf die Startseite, statt ins
   * Leere zu laufen. Wer die AH-Seite aufruft, sucht den Verein und nicht
   * unbedingt die AH.
   */
  { alt: "bambini-mannschaft.html", neu: "/fussball/jugend" },
  { alt: "spielplan---bambini.html", neu: "/fussball/jugend" },
  { alt: "ah-mannschaft.html", neu: "/", grund: "Keine AH-Mannschaft mehr gemeldet" },

  { alt: "gymnastik.html", neu: "/gymnastik" },

  { alt: "vorstand.html", neu: "/verein/vorstand" },
  { alt: "sponsoren.html", neu: "/verein/sponsoren" },
  { alt: "mitglied-werden.html", neu: "/verein/mitglied-werden" },
  { alt: "satzung.html", neu: "/verein/satzung" },

  { alt: "kontakt.html", neu: "/kontakt" },
  { alt: "impressum.html", neu: "/impressum" },
  { alt: "datenschutz.html", neu: "/datenschutz" },

  {
    alt: "links.html",
    neu: "/verein/sponsoren",
    grund:
      "Die alte Linkseite fuehrte im Wesentlichen Sponsoren und befreundete " +
      "Vereine. Die Sponsoren stehen jetzt dort.",
  },
];
