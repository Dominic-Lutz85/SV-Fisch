/**
 * Zentrale Vereins-Konfiguration.
 *
 * Diese Datei bündelt Werte, die an mehreren Stellen der Seite auftauchen
 * (Kontaktdaten, Social-Media-Links, Fanshop-URL, Social-Proof-Zahlen).
 * Änderungen hier wirken sich site-weit aus — kein Programmieraufwand nötig.
 *
 * [BITTE PRÜFEN/ERGÄNZEN] – Platzhalterwerte vor Go-Live durch echte
 * Vereinsdaten ersetzen.
 */

export const siteConfig = {
  name: "SV Fisch 1964 e.V.",
  shortName: "SV Fisch",
  claim: "Zuhause auf dem Platz, zuhause im Verein.",
  founded: 1964,
  url: "https://sv-fisch.com",
  description:
    "SV Fisch 1964 e.V. – Fußball, Gymnastik und Darts mitten im Ort. Erste Mannschaft, Bambini, Gymnastik- und Darts-Abteilung und ein starkes Vereinsleben seit 1964.",

  // [BITTE PRÜFEN/ERGÄNZEN] echte Kontaktdaten eintragen
  contact: {
    email: "info@sv-fisch.de",
    // Keine Nummer erfunden: das bisherige Vereinsimpressum nannte auch
    // keine. Sobald der Verein eine nennt, hier eintragen und die Zeile auf
    // /kontakt und /impressum wieder einbauen.
    phone: "",
    addressLines: ["Sportplatz SV Fisch", "Im Asbüsch 10", "54439 Fisch"],
    // Jakobushaus = Vereinsheim, siehe Kontaktseite
    venueName: "Sportplatz & Jakobushaus",
    // OpenStreetMap-Koordinaten [BITTE PRÜFEN/ERGÄNZEN]
    lat: 49.6198,
    lng: 6.4883,
  },

  register: {
    /*
     * Das Gericht steht in § 1 der Satzung vom 25.11.2022, siehe
     * content/satzung.ts.
     *
     * DIE NUMMER STAND BIS ZUM 22.09.2026 AUF PLATZHALTER, mit dem Vermerk,
     * sie werde nicht geraten. Sie ist jetzt belegt, aber nicht geraten,
     * sondern abgelesen: Das Impressum der bisherigen Vereinsseite
     * sv-fisch.de fuehrt "Eintrag im Vereinsregister: 41139". Das ist eine
     * Angabe des Vereins ueber sich selbst, und damit die beste Quelle, die
     * ohne Registerauszug zu haben ist.
     *
     * Der Auftraggeber hat die Uebernahme am 22.09.2026 ausdruecklich
     * bestaetigt. Wer einen Registerauszug in die Hand bekommt, gleicht
     * beides trotzdem einmal ab.
     */
    court: "Amtsgericht Wittlich",
    number: "VR 41139",
  },

  social: {
    instagram: "https://www.instagram.com/sv.fisch/",
    facebook: "https://facebook.com/svfisch1964",
    youtube: "",
    tiktok: "",
  },

  // Platzhalter-Link, per ENV leicht austauschbar sobald ein echter Shop existiert
  fanshopUrl: process.env.NEXT_PUBLIC_FANSHOP_URL || "https://sv-fisch.fan12.de/",

  /*
     Hier stand ein Block "numbers" mit Mitgliederzahl, Abteilungen und
     Mannschaften fuer das Zahlenband der Startseite. Er ist mit dem Band
     zusammen entfernt worden, weil die Werte nicht belegt waren.

     Bewusst NICHT als leerer Block stehen geblieben: Eine Einstellung, die
     nirgends mehr gelesen wird, ist eine Falle. Wer die echten Zahlen
     eintraegt, sieht sonst keine Wirkung und sucht den Fehler woanders.
  */
} as const;

export type SiteConfig = typeof siteConfig;
