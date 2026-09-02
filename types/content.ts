export interface VorstandsMitglied {
  name: string;
  rolle: string;
  bereich: "Verein" | "Fußball" | "Gymnastik" | "Jugend" | "Darts";
  email?: string;
  telefon?: string;
  foto?: string;
}

export interface Sponsor {
  name: string;
  stufe: "Hauptsponsor" | "Co-Sponsor";
  logo: string;
  /*
   * Die echten Masse der Logodatei. Sie stehen hier, damit next/image das
   * Seitenverhaeltnis kennt und keinen Platz falsch reserviert. Wer ein Logo
   * austauscht, traegt die neuen Masse mit ein, sonst wird es verzerrt oder
   * die Seite springt beim Laden.
   */
  breite: number;
  hoehe: number;
  /* Nur setzen, wenn die Adresse bekannt ist. Kein Ziel heisst kein Link. */
  url?: string;
}

export interface Spieler {
  nummer: number | null;
  name: string;
  position: "Torwart" | "Abwehr" | "Mittelfeld" | "Sturm" | "Trainer";
  foto?: string;
}

export interface TabellenZeile {
  platz: number;
  team: string;
  spiele: number;
  siege: number;
  unentschieden: number;
  niederlagen: number;
  tore: string;
  differenz: number;
  punkte: number;
  hervorgehoben?: boolean;
}

export interface Spiel {
  datum: string; // ISO 8601
  uhrzeit: string;
  wettbewerb: string;
  heim: string;
  auswaerts: string;
  ort: "Heim" | "Auswärts";
  spielstaette?: string;
  ergebnis?: string;
  gespielt: boolean;
}

export type TerminKategorie = "Fußball" | "Gymnastik" | "Verein" | "Fest";

export interface Termin {
  id: string;
  titel: string;
  datum: string; // ISO 8601
  endDatum?: string;
  uhrzeit?: string;
  ort?: string;
  kategorie: TerminKategorie;
  beschreibung?: string;
}

export type NewsKategorie = "Fußball" | "Gymnastik" | "Verein";

export interface NewsFrontmatter {
  title: string;
  slug: string;
  date: string;
  kategorie: NewsKategorie;
  teaser: string;
  teaserbild?: string;
}

export interface NewsArtikel extends NewsFrontmatter {
  content: string;
}

export interface GalerieBild {
  src: string;
  alt: string;
}

export interface GalerieAlbum {
  slug: string;
  titel: string;
  datum: string;
  cover: string;
  bilder: GalerieBild[];
}
