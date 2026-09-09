import type { Spiel, TabellenZeile } from "@/types/content";

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
 * Fuenf Minuten, weil FuPa in seiner eigenen Cache-Control-Kopfzeile
 * s-maxage=300 setzt. Kuerzer waere unhoeflich und brauchte kein Mensch: ein
 * Kreisliga-Ergebnis wird sonntags einmal eingetragen.
 */
const REVALIDATE = 300;

/** Wie der Verein heisst, den FuPa hier meint. */
const EIGENER_VEREIN = "SV Fisch";

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
 * Holen mit knappem Zeitlimit.
 *
 * Das Zeitlimit ist der Grund, warum diese Funktion existiert: Ohne es
 * haengt der Seitenaufbau an FuPas Antwortzeit. Fuenf Sekunden sind
 * grosszuegig fuer eine Antwort, die sonst in unter 300 ms kommt, und immer
 * noch kurz genug, dass niemand vor einer weissen Seite sitzt.
 */
async function hole<T>(pfad: string): Promise<T | null> {
  try {
    const antwort = await fetch(`${BASIS}/${TEAM_SLUG}/${pfad}`, {
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
        wettbewerb: m.competition.name,
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
