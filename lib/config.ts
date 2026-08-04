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
  url: "https://www.sv-fisch.de",
  description:
    "SV Fisch 1964 e.V. – Fußball und Gymnastik mitten im Ort. Erste Mannschaft, Bambini, Gymnastikabteilung und ein starkes Vereinsleben seit 1964.",

  // [BITTE PRÜFEN/ERGÄNZEN] echte Kontaktdaten eintragen
  contact: {
    email: "info@sv-fisch.de",
    phone: "+49 0000 000000",
    addressLines: ["Sportplatz SV Fisch", "Musterstraße 1", "12345 Musterort"],
    // Jakobushaus = Vereinsheim, siehe Kontaktseite
    venueName: "Sportplatz & Jakobushaus",
    // OpenStreetMap-Koordinaten [BITTE PRÜFEN/ERGÄNZEN]
    lat: 50.943,
    lng: 6.9601,
  },

  register: {
    court: "[Registergericht eintragen]",
    number: "[Vereinsregisternummer eintragen]",
  },

  social: {
    instagram: "https://instagram.com/svfisch1964",
    facebook: "https://facebook.com/svfisch1964",
    youtube: "",
    tiktok: "",
  },

  // Platzhalter-Link, per ENV leicht austauschbar sobald ein echter Shop existiert
  fanshopUrl: process.env.NEXT_PUBLIC_FANSHOP_URL || "https://www.spreadshirt.de/",

  numbers: {
    founded: 1964,
    members: 420,
    departments: 2,
    teams: 4,
  },
} as const;

export type SiteConfig = typeof siteConfig;
