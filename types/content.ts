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
  /*
   * Was die Firma macht, in EINEM Satz und in IHREN Worten.
   *
   * Diese Zeile ist der ganze Sinn der Sponsorenwand in dieser Fassung: Sie
   * macht aus einer Reihe Aufkleber ein Verzeichnis der Betriebe im Ort. Damit
   * hat ein Besucher zum ersten Mal einen Grund, die Seite zu lesen, und der
   * Sponsor bekommt eine Gegenleistung statt eines Logoplatzes.
   *
   * Deshalb gilt hier eine harte Regel: Der Satz wird von der Internetseite
   * der Firma uebernommen, nicht ausgedacht und nicht aus dem Logo abgelesen.
   * Eine falsche Angabe ueber ein fremdes Unternehmen auf der Vereinsseite ist
   * ein echtes Problem und kein Schoenheitsfehler. Wer einen Sponsor ergaenzt,
   * ruft dessen Seite auf und nimmt, was dort steht.
   */
  beschreibung: string;
  /* Ort oder Anschrift, falls bekannt. Steht klein unter der Beschreibung. */
  ort?: string;
  /* Nur setzen, wenn die Adresse bekannt ist. Kein Ziel heisst kein Link. */
  url?: string;
}

export interface Spieler {
  nummer: number | null;
  name: string;
  position: "Torwart" | "Abwehr" | "Mittelfeld" | "Sturm" | "Trainer";
  /*
   * Die genaue Rolle im Trainerteam, also "Torwart-Trainer", "Betreuer",
   * "Teammanager", "sportlicher Leiter".
   *
   * Sie steht hier, weil `position` nur fuenf Werte kennt und alles, was
   * kein Spieler ist, auf "Trainer" faellt. Ohne dieses Feld waeren die
   * sieben Leute im Betreuerstab des SV Fisch alle "Trainer", und der
   * Torwart-Trainer hiesse dasselbe wie der Teammanager. Das ist auf einer
   * Vereinsseite keine Kleinigkeit: Diese Leute stehen mit Namen da.
   */
  rolle?: string;
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
  /*
   * Optional, weil getAllNews() ihn sonst aus dem Dateinamen ableitet. Wer
   * in der Redaktionsoberflaeche einen Artikel anlegt, soll sich nicht mit
   * Adressteilen befassen muessen.
   */
  slug?: string;
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

/*
 * EINE MELDUNG FUER DEN AUSHANG ueber dem Kopfbereich.
 *
 * Gedacht fuer das, was im Verein wirklich dringend ist und wofuer niemand
 * einen Artikel schreibt: Absagen, Verlegungen, Aufrufe. Wer daraus einen
 * zweiten Nachrichtenkanal macht, hat den Sinn verfehlt.
 *
 * SO TRAEGT MAN EINE MELDUNG EIN, in content/meldungen.json:
 *
 *   [
 *     {
 *       "id": "absage-13-09",
 *       "stufe": "dringend",
 *       "text": "Das Spiel am Sonntag faellt aus, der Platz ist gesperrt.",
 *       "von": "2026-09-11",
 *       "bis": "2026-09-14",
 *       "link": { "text": "Zum Spielplan", "ziel": "/fussball/spielplan" }
 *     }
 *   ]
 *
 * Eine leere Liste ist der Normalfall. Dann erscheint gar nichts, und das
 * ist richtig so: Ein Aushang, an dem immer etwas haengt, wird nicht mehr
 * gelesen.
 */
export interface Meldung {
  /* Eindeutig und stabil, dient nur als Schluessel in der Liste. */
  id: string;
  /*
   * Zwei Stufen, und die Frage dahinter ist eindeutig zu beantworten:
   *
   *   dringend   Faehrt jemand umsonst zum Platz, wenn er das nicht liest?
   *              Absagen, Verlegungen, gesperrter Platz.
   *   hinweis    Alles andere. Einladungen, Helfersuche, Aufrufe.
   *
   * Eine dritte Stufe gibt es bewusst nicht. "Ist das mittelwichtig" kann
   * niemand entscheiden, und eine Stufe, die niemand richtig waehlt, ist
   * schlimmer als keine.
   */
  stufe: "dringend" | "hinweis";
  /* Ein Satz. Wer zwei braucht, schreibt einen Beitrag unter content/news. */
  text: string;
  /* Ab wann sie erscheint, als "JJJJ-MM-TT". */
  von: string;
  /*
   * Bis einschliesslich welchem Tag sie haengt.
   *
   * Das ist der wichtigste Teil des ganzen Aushangs: Er nimmt sich SELBST
   * wieder ab. Ein Aushang, den jemand von Hand abhaengen muss, haengt im
   * Maerz noch am Sportplatz. Dieselbe Lehre wie beim Spielplan in
   * lib/content.ts: Ein Datum veraltet nicht, ein Haken schon.
   */
  bis: string;
  link?: { text: string; ziel: string };
}
