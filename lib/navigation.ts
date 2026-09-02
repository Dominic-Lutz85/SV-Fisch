export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavLink[];
}

export const mainNav: NavItem[] = [
  /*
   * Ein Eintrag darf eine Adresse UND Unterpunkte haben. "Home" ist beides:
   * die Ueberschrift fuehrt auf die Startseite, darunter steht der Liveticker.
   * Der steht bewusst hier oben und nicht unter Fussball, weil er waehrend
   * eines Spiels der meistgesuchte Punkt der ganzen Seite ist und niemand ihn
   * dann in einer Liste von fuenf Mannschaftsseiten suchen soll.
   */
  {
    label: "Home",
    href: "/",
    children: [{ label: "Liveticker", href: "/fussball/liveticker" }],
  },
  {
    label: "Der Verein",
    children: [
      { label: "Vorstand", href: "/verein/vorstand" },
      { label: "Sponsoren", href: "/verein/sponsoren" },
      { label: "Mitglied werden", href: "/verein/mitglied-werden" },
      { label: "Satzung", href: "/verein/satzung" },
    ],
  },
  {
    label: "Fußball",
    children: [
      { label: "1. Mannschaft: Kader", href: "/fussball/kader" },
      { label: "1. Mannschaft: Tabelle", href: "/fussball/tabelle" },
      { label: "1. Mannschaft: Spielplan", href: "/fussball/spielplan" },
      { label: "Bambini: Mannschaft", href: "/fussball/bambini" },
      { label: "Bambini: Spielplan", href: "/fussball/bambini/spielplan" },
    ],
  },
  {
    label: "Abteilungen",
    children: [
      { label: "Darts", href: "/darts" },
      { label: "Gymnastik", href: "/gymnastik" },
    ],
  },
  {
    label: "Aktuelles",
    children: [
      { label: "Neuigkeiten", href: "/aktuelles" },
      { label: "Kalender", href: "/kalender" },
      { label: "Elfer-Turnier", href: "/elfer-turnier" },
    ],
  },
  { label: "Galerie", href: "/galerie" },
  { label: "Kontakt", href: "/kontakt" },
];

export const footerLinks: NavLink[] = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Satzung", href: "/verein/satzung" },
  { label: "Kontakt", href: "/kontakt" },
];
