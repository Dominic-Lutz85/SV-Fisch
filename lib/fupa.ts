import type { Spiel, TabellenZeile } from "@/types/content";
import { getSpielplan, getTabelle } from "@/lib/content";
import { siteConfig } from "@/lib/config";

/*
 * Spieldaten direkt von FuPa, serverseitig geholt.
 *
 * WARUM ES DIESE DATEI GIBT:
 *
 * Spielplan und Tabelle lagen bis zum 09.09.2026 als handgepflegte JSON im
 * Repo. Am 09.09. stand die Startseite auf Spieltag 4, waehrend das
 * FuPa-Widget auf /fussball/tabelle Spieltag 5 zeigte. Die Seite hat sich
 * also selbst widersprochen, drei Tage lang, und das auf einer Seite, die
 * als Arbeitsprobe dient.
 *
 * WOHER DIE ADRESSEN STAMMEN, und das ist kein Ausprobieren gewesen:
 *
 * Das offizielle FuPa-Widget (widget-api.fupa.net/vendor/widget.js) laedt
 * seinen Tabellenteil aus vendor/team/standings/3ISBEIR2.js. Dort steht
 * woertlich "/v1/widget/teams/".concat(slug, "/standings"). Das sind also
 * genau die Adressen, die FuPa selbst fuer die Einbindung auf fremden
 * Vereinsseiten vorsieht.
 *
 * Zwei Kopfzeilen der Antwort belegen, dass das so gemeint ist:
 *   Access-Control-Allow-Origin: *
 *   Cache-Control: max-age=30, public, s-maxage=300, stale-if-error=1
 *
 * Das erste gibt die Daten ausdruecklich fuer fremde Herkunft frei. Das
 * zweite ist FuPas eigene Vorgabe an Zwischenspeicher: fuenf Minuten. Genau
 * die uebernimmt REVALIDATE weiter unten, statt sich eine eigene Zahl
 * auszudenken.
 *
 * WARUM SERVERSEITIG UND NICHT IM BROWSER:
 *
 * Holt der Server die Daten, spricht der Besucher nie mit FuPa. Es geht
 * keine IP-Adresse dorthin, es faellt kein Cookie an, und der Abschnitt
 * braucht keine Einwilligung. Das eingebettete Widget dagegen laedt aus vier
 * fremden Hosts (widget-api, static, api und image.fupa.net, am 09.09.2026
 * per Netzwerkmitschnitt gezaehlt) und liegt deshalb hinter dem
 * Zustimmungsdialog.
 */

/** Die Mannschaft bei FuPa. Steht ohne Saison, FuPa nimmt die laufende. */
const TEAM_SLUG = "sv-fisch-m1";

const BASIS = "https://api.fupa.net/v1/widget/teams";

/*
 * WARUM AN JEDER ADRESSE limit=100 HAENGT, und das ist teuer gelernt:
 *
 * Ohne den Parameter liefert die Schnittstelle 25 Eintraege und schneidet
 * den Rest ab. Bei 14 Mannschaften hat die Saison aber 26 Spieltage, und
 * weil FuPa die Testspiele mitzaehlt, kamen am 09.09.2026 nur 21 Ligaspiele
 * an. Die letzten vier Spieltage fehlten auf /fussball/spielplan, bis zum
 * 18.04.2027 statt bis zum 23.05.2027.
 *
 * Gefunden ist das erst NACH dem Ausliefern, beim Suchen nach einem Merkmal,
 * an dem sich die neue Fassung live erkennen laesst. Der Vergleich mit der
 * Datei im Repo hat den Fehler aufgedeckt, nicht eine Pruefung. Deshalb
 * zaehlt scripts/pruefe-fupa.mjs die Spiele jetzt gegen die Zahl, die sich
 * aus der Tabelle ergibt.
 *
 * Nebenbefund: Die Datei im Repo hatte selbst nur 25 der 26 Spiele.
 */

/*
 * Fuenf Minuten, weil FuPa in seiner eigenen Cache-Control-Kopfzeile
 * s-maxage=300 setzt. Kuerzer waere unhoeflich und brauchte kein Mensch: ein
 * Kreisliga-Ergebnis wird sonntags einmal eingetragen.
 */
const REVALIDATE = 300;

/** Wie der Verein heisst, den FuPa hier meint. */
const EIGENER_VEREIN = "SV Fisch";

/* FuPa nennt keine Spielstaette, die steht in der Vereins-Konfiguration. */
const HEIMSPIELSTAETTE = siteConfig.contact.addressLines[0];

interface FupaTeam {
  name: { full: string; middle: string; short: string };
  /* 1 ist die erste Mannschaft, 2 die zweite. FuPa haengt kein "II" an. */
  level: number;
}

interface FupaStandingsZeile {
  rank: number;
  matches: number;
  wins: number;
  draws: number;
  defeats: number;
  ownGoals: number;
  againstGoals: number;
  goalDifference: number;
  points: number;
  team: FupaTeam;
}

interface FupaMatch {
  homeTeam: FupaTeam;
  awayTeam: FupaTeam;
  /* Mit Zeitzonen-Versatz, z. B. "2026-09-06T14:00:00+02:00". */
  kickoff: string;
  homeGoal: number | null;
  awayGoal: number | null;
  /* "PRE" vor dem Anpfiff, "POST" nach dem Abpfiff. */
  section: string;
  /* "league" oder "testmatch". Testspiele gehoeren nicht in den Spielplan. */
  category: string;
  competition: { name: string };
}

/**
 * Der Name, wie ihn ein Mensch im Ort schreibt.
 *
 * FuPa fuehrt die zweite Mannschaft unter demselben Namen wie die erste und
 * unterscheidet sie nur ueber `level`. Ohne diese Zeile stuende im Spielplan
 * "SV Tawern" statt "SV Tawern II", und das ist ein anderer Gegner.
 */
function vollerName(team: FupaTeam): string {
  const roh = team.name.full.trim();
  return team.level > 1 ? `${roh} ${"I".repeat(team.level)}` : roh;
}

/**
 * FuPas Schreibweise des Wettbewerbs auf die des Vereins bringen.
 *
 * FuPa liefert "Kreisliga B Staffel 10 Trier Saarburg", ohne Bindestrich.
 * Der Landkreis heisst Trier-Saarburg, und an drei festen Stellen der Seite
 * steht es auch so (Startseite, Tabellenseite, Erfolgstreppe). Ohne diese
 * Zeile stuenden nach der Umstellung beide Schreibweisen im selben
 * Bildschirm: oben im Kopfbereich ohne Strich, zwei Abschnitte tiefer mit.
 *
 * Am 09.09.2026 beim Ansehen der umgestellten Startseite gefunden, nicht
 * beim Bauen. Bewusst eine einzelne, benannte Ersetzung und keine Liste:
 * Wer hier weitere Namen einpflegt, baut sich eine Pflegestelle, die genau
 * das Problem zurueckbringt, das der Umbau beseitigen sollte.
 */
function vereinsSchreibweise(wettbewerb: string): string {
  return wettbewerb.replace("Trier Saarburg", "Trier-Saarburg");
}

/**
 * Holen mit knappem Zeitlimit.
 *
 * Das Zeitlimit ist der Grund, warum diese Funktion existiert: Ohne es
 * haengt der Seitenaufbau an FuPas Antwortzeit. Fuenf Sekunden sind
 * grosszuegig fuer eine Antwort, die sonst in unter 300 ms kommt, und immer
 * noch kurz genug, dass niemand vor einer weissen Seite sitzt.
 */
async function hole<T>(pfad: string): Promise<T | null> {
  try {
    const antwort = await fetch(`${BASIS}/${TEAM_SLUG}/${pfad}?limit=100`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(5000),
    });
    if (!antwort.ok) return null;
    return (await antwort.json()) as T;
  } catch {
    /*
     * Bewusst stumm. Wer diese Funktion aufruft, bekommt null und weicht auf
     * die Datei im Repo aus. Ein Fehler hier darf die Seite nicht aufhalten.
     */
    return null;
  }
}

/** Die Tabelle der Liga, in der die erste Mannschaft spielt. */
export async function holeTabelle(): Promise<TabellenZeile[] | null> {
  const daten = await hole<{ standings: FupaStandingsZeile[] }>("standings");
  if (!daten?.standings?.length) return null;

  return daten.standings.map((z) => {
    const team = vollerName(z.team);
    const zeile: TabellenZeile = {
      platz: z.rank,
      team,
      spiele: z.matches,
      siege: z.wins,
      unentschieden: z.draws,
      niederlagen: z.defeats,
      tore: `${z.ownGoals}:${z.againstGoals}`,
      differenz: z.goalDifference,
      punkte: z.points,
    };
    if (team === EIGENER_VEREIN) zeile.hervorgehoben = true;
    return zeile;
  });
}

/** Der Ligaspielplan, Testspiele bleiben draussen. */
export async function holeSpielplan(
  spielstaette?: string
): Promise<Spiel[] | null> {
  const daten = await hole<{ matches: FupaMatch[] }>("matches");
  if (!daten?.matches?.length) return null;

  const spiele = daten.matches
    .filter((m) => m.category === "league")
    .map((m): Spiel => {
      const heim = vollerName(m.homeTeam);
      const auswaerts = vollerName(m.awayTeam);
      const zuhause = heim === EIGENER_VEREIN;
      /*
       * Aus dem kickoff wird geschnitten, nicht gerechnet. Der Wert traegt
       * bereits den Versatz der Ortszeit ("+02:00" im Sommer, "+01:00" im
       * Winter), also stehen Datum und Uhrzeit dort schon so, wie sie am
       * Sportplatz gelten. Ein Umweg ueber Date() wuerde daraus UTC machen
       * und ein Spiel um 00:30 auf den Vortag schieben.
       */
      const gespielt = m.section === "POST" && m.homeGoal !== null;
      const spiel: Spiel = {
        datum: m.kickoff.slice(0, 10),
        uhrzeit: m.kickoff.slice(11, 16),
        wettbewerb: vereinsSchreibweise(m.competition.name),
        heim,
        auswaerts,
        ort: zuhause ? "Heim" : "Auswärts",
        gespielt,
      };
      if (zuhause && spielstaette) spiel.spielstaette = spielstaette;
      if (gespielt) spiel.ergebnis = `${m.homeGoal}:${m.awayGoal}`;
      return spiel;
    })
    .sort((a, b) => (a.datum < b.datum ? -1 : 1));

  return spiele.length ? spiele : null;
}

/*
 * Ab hier: was die Seiten wirklich aufrufen.
 *
 * WARUM DER RUECKFALL HIER STEHT UND NICHT IN DEN SEITEN:
 *
 * Zwei Seiten zeigen dieselben Zahlen, die Startseite und
 * /fussball/spielplan. Stuende das "wenn null, dann die Datei" in beiden,
 * gaebe es zwei Fassungen derselben Regel, und sie laufen irgendwann
 * auseinander. Genau davor warnt der Kommentar oben in lib/ergebnis.ts, und
 * genau dieser Fehler war am 09.09.2026 der Anlass fuer den ganzen Umbau:
 * zwei Quellen fuer dieselbe Tabelle, eine davon veraltet.
 */

/**
 * Der Spielplan, so aktuell wie zu bekommen.
 *
 * Antwortet FuPa nicht, kommt die Datei aus dem Repo. Sie ist dann alt, aber
 * vollstaendig, und weil sie auch die kommenden Spiele enthaelt, schlaegt
 * letzterSpielstand() in lib/ergebnis.ts nach zwei Tagen von selbst Alarm:
 * Ein gespieltes Spiel ohne Ergebnis faellt auf der Seite auf. Der Rueckfall
 * ist also nicht stumm, er meldet sich nur ueber den Umweg des Ergebnisses.
 */
export async function aktuellerSpielplan(): Promise<Spiel[]> {
  const gemeldet = await holeSpielplan(HEIMSPIELSTAETTE);
  return gemeldet ?? getSpielplan();
}

/** Die Tabelle, so aktuell wie zu bekommen. Sonst die Datei aus dem Repo. */
export async function aktuelleTabelle(): Promise<TabellenZeile[]> {
  const gemeldet = await holeTabelle();
  return gemeldet ?? getTabelle();
}
