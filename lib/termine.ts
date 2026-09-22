import type { Spiel, Termin } from "@/types/content";
import { getTermine } from "@/lib/content";
import { aktuellerSpielplan } from "@/lib/fupa";
import { gegnerVon, istFisch } from "@/lib/ergebnis";

/*
 * Termine aus zwei Quellen zusammenfuehren: Vereinstermine aus dem Repo und
 * Spiele aus der FuPa-Schnittstelle.
 *
 * WARUM DAS NOETIG WURDE, und der Anlass ist unangenehm: Am 22.09.2026 zeigte
 * die Startseite gar keinen Termin mehr, und der Kalender war leer. Alle
 * sechs Eintraege in content/termine.json lagen in der Vergangenheit, der
 * juengste vom 19.09.
 *
 * Beim Nachsehen kam Schlimmeres heraus als "veraltet". Zwei der sechs waren
 * ERFUNDEN:
 *
 *   "Kreispokal gegen FC Waldstadt" am 23.08.2026. Einen FC Waldstadt gibt es
 *   im gesamten FuPa-Spielplan nicht, und am 23.08. lief ein LIGASPIEL gegen
 *   SV Konz. Der Name stammt aus derselben Bauphase wie die acht erfundenen
 *   Sponsorenfirmen.
 *
 *   "Heimspiel gegen SV Konz II" am selben Tag. Der Gegner heisst SV Konz
 *   ohne Zusatz, und das Spiel steht bei FuPa ohnehin.
 *
 * DAS EIGENTLICHE PROBLEM IST ABER DIE DOPPELPFLEGE. Fussballspiele in einer
 * Datei zu pflegen, die auch FuPa kennt, ist genau der Fehler, den das
 * Projekt am 09.09.2026 schon einmal behoben hat: Damals stand die Startseite
 * drei Tage auf Spieltag 4, waehrend die Tabelle laengst Spieltag 5 zeigte.
 * Die Entscheidung von damals lautet "Spielplan und Tabelle kommen von FuPa".
 * Fuer den Kalender galt sie bisher nicht.
 *
 * Jetzt gilt sie auch dort: content/termine.json traegt nur noch das, was
 * FuPa NICHT kennt, also Versammlungen, Feste und Abteilungstermine. Die
 * Spiele kommen von selbst dazu und koennen nicht mehr veralten.
 */

/** Aus einem FuPa-Spiel wird ein Kalendereintrag. */
function spielAlsTermin(spiel: Spiel): Termin {
  const zuhause = istFisch(spiel.heim);
  const gegner = gegnerVon(spiel);

  return {
    /*
     * Die Kennung muss stabil sein, damit React beim Neuaufbau nicht jedes
     * Mal alles neu zeichnet. Datum plus Gegner reicht: Zwei Spiele gegen
     * denselben Gegner am selben Tag gibt es nicht.
     */
    id: `spiel-${spiel.datum}-${gegner.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    titel: zuhause ? `Heimspiel gegen ${gegner}` : `Auswärts bei ${gegner}`,
    datum: spiel.uhrzeit ? `${spiel.datum}T${spiel.uhrzeit}:00` : spiel.datum,
    ort: zuhause ? (spiel.spielstaette ?? "Sportplatz SV Fisch") : "Auswärts",
    kategorie: "Fußball",
    /*
     * Der Wettbewerb gehoert in die Beschreibung und nicht in den Titel: Im
     * Titel steht, WEN man spielt, und das ist die Angabe, nach der jemand
     * sucht. "Kreisliga B" davor macht alle Eintraege am Anfang gleich.
     */
    beschreibung: spiel.wettbewerb,
  };
}

/**
 * Alle Termine, nach Datum sortiert: Vereinstermine plus Spiele.
 *
 * Antwortet FuPa nicht, bleiben die Vereinstermine. Der Kalender ist dann
 * unvollstaendig, aber nicht leer, und die Lage meldet der Waechter beim Bau.
 */
export async function alleTermine(): Promise<Termin[]> {
  const [vereins, spielplan] = await Promise.all([
    Promise.resolve(getTermine()),
    aktuellerSpielplan(),
  ]);

  return [...vereins, ...spielplan.map(spielAlsTermin)].sort(
    (a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime()
  );
}

/**
 * Der naechste Termin, der noch bevorsteht.
 *
 * WAS HIER BEWUSST NICHT PASSIERT: Auf ein Spiel zurueckfallen, wenn kein
 * Vereinstermin da ist, waere naheliegend und falsch. Der Kopfbereich zeigt
 * das naechste Spiel bereits im Band zwei Zeilen darueber. Zweimal dieselbe
 * Angabe auf einem Bildschirm sieht nach Fuellmaterial aus.
 *
 * Deshalb fragt der Kopfbereich weiter nur die Vereinstermine, siehe
 * getNaechsterTermin in lib/content.ts. Diese Funktion hier ist fuer den
 * Kalender, wo beides zusammengehoert.
 */
export async function naechsterTerminGesamt(): Promise<Termin | undefined> {
  const jetzt = Date.now();
  return (await alleTermine()).find(
    (t) => new Date(t.datum).getTime() >= jetzt
  );
}
