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
    // Nachgeschlagen bei OpenStreetMap fuer "Im Asbüsch 10, 54439 Fisch".
    // Vorher standen hier 49.6198 / 6.4883, rund 300 m daneben.
    lat: 49.6173,
    lng: 6.4901,
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

  /*
   * Verantwortlich fuer die Nachrichten nach § 18 Abs. 2 MStV. Die
   * Vorschrift verlangt eine natuerliche Person mit Namen und Anschrift,
   * ein Vereinsname genuegt nicht.
   *
   * Als Anschrift steht die des Vereins dort, nicht die der Person. So
   * macht es der Fussballverband Rheinland, der eigene Dachverband, in
   * seinem Impressum, und so muss niemand seine Wohnadresse
   * veroeffentlichen.
   *
   * HIER STEHT BEWUSST KEIN PERSONENNAME. Der Auftraggeber hat am
   * 24.09.2026 entschieden, "Vorstandschaft" einzutragen, weil noch
   * niemand benannt ist. Damit ist § 18 Abs. 2 MStV formal nicht erfuellt:
   * die Vorschrift verlangt eine natuerliche Person. Die bisherige
   * Vereinsseite fuehrte an derselben Stelle "Sportverein Fisch 1964 e.V."
   * und war damit genauso unvollstaendig.
   *
   * Der Unterschied zum Platzhalter vorher ist die Sichtbarkeit, nicht die
   * Rechtslage. Wer einen Namen bekommt, traegt ihn hier ein, mehr ist
   * nicht zu tun.
   *
   * Warum das vertretbar ist: § 18 Abs. 2 MStV gilt ueberwiegend als nicht
   * abmahnfaehig, weil er dem Medienrecht und nicht dem Verbraucherschutz
   * dient; er ist eine Ordnungswidrigkeit nach § 115 MStV. Das eigentliche
   * Abmahnrisiko liegt bei § 5 DDG, und die Angaben dort sind seit dem
   * 24.09.2026 vollstaendig.
   */
  mstvVerantwortlich: "Vorstandschaft",

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
