import type { Spiel } from "@/types/content";
import { heuteInDeutschland } from "@/lib/content";

/*
 * Alles, was mit einem Spielstand zu tun hat, an einer Stelle.
 *
 * Die Ableitung "wer hat gewonnen" stand vorher nur in Fixtures.tsx. Sobald
 * ein zweiter Ort ein Ergebnis zeigt, muss sie geteilt werden, sonst laufen
 * zwei Fassungen derselben Regel auseinander. Genau das ist die Stelle, an
 * der ein Verein irgendwann eine Niederlage als Sieg auf der Startseite
 * stehen hat.
 */

export type Ausgang = "sieg" | "unentschieden" | "niederlage" | null;

export function istFisch(team: string) {
  return team.toLowerCase().includes("fisch");
}

/** Aus "2:1" und der Frage, ob Fisch zu Hause war, den Ausgang ableiten. */
export function ausgangVon(spiel: Spiel): Ausgang {
  if (!spiel.ergebnis) return null;
  const [a, b] = spiel.ergebnis.split(":").map((n) => parseInt(n.trim(), 10));
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  const heim = istFisch(spiel.heim);
  const eigene = heim ? a : b;
  const fremde = heim ? b : a;
  if (eigene > fremde) return "sieg";
  if (eigene < fremde) return "niederlage";
  return "unentschieden";
}

/** Die Tore aus Vereinssicht, also immer "eigene:fremde". */
export function toreAusVereinssicht(spiel: Spiel): [number, number] | null {
  if (!spiel.ergebnis) return null;
  const [a, b] = spiel.ergebnis.split(":").map((n) => parseInt(n.trim(), 10));
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return istFisch(spiel.heim) ? [a, b] : [b, a];
}

/** Der Gegner, egal ob er links oder rechts in der Paarung steht. */
export function gegnerVon(spiel: Spiel): string {
  return istFisch(spiel.heim) ? spiel.auswaerts : spiel.heim;
}

/*
 * Was am Kopfbereich als "zuletzt" stehen soll.
 *
 * WARUM DAS NICHT EINFACH DAS JUENGSTE VERGANGENE SPIEL IST, und das ist der
 * Punkt, an dem eine Vereinsseite unglaubwuerdig wird:
 *
 * Am 08.09.2026 lag im Spielplan ein Spiel vom 06.09. gegen SV Tawern II ohne
 * eingetragenes Ergebnis. Das juengste Spiel MIT Ergebnis war das vom 30.08.
 * Wer stumpf das letzte Ergebnis zeigt, schreibt am Dienstag "4:2 in Trier"
 * gross in den Kopfbereich, obwohl am Sonntag davor gespielt wurde. Jeder im
 * Ort weiss das, und die Seite sieht aus, als pflege sie niemand.
 *
 * Deshalb gibt diese Funktion beides zurueck: das letzte belegte Ergebnis und
 * die Information, dass davor noch ein gespieltes Spiel ohne Eintrag liegt.
 * Was die Gestaltung daraus macht, entscheidet die Gestaltung. Verschweigen
 * darf sie es nicht.
 *
 * `nachtragFrist` ist der Puffer in Tagen, in dem ein fehlendes Ergebnis noch
 * normal ist. Zwei Tage: ein Sonntagsspiel darf bis Dienstag nachgetragen
 * werden, ohne dass die Seite Alarm schlaegt.
 */
export interface Spielstand {
  /** Das juengste vergangene Spiel mit eingetragenem Ergebnis. */
  letztes?: Spiel;
  /** Ein juengeres, bereits gespieltes Spiel, dessen Ergebnis noch fehlt. */
  offen?: Spiel;
  /** Fehlt das Ergebnis laenger als die Frist, ist es ein Pflegeproblem. */
  ueberfaellig: boolean;
}

export function letzterSpielstand(
  spiele: Spiel[],
  heute: string = heuteInDeutschland(),
  nachtragFrist = 2
): Spielstand {
  const vergangen = spiele
    .filter((s) => s.datum < heute)
    .sort((a, b) => (a.datum < b.datum ? 1 : -1));

  const letztes = vergangen.find((s) => ausgangVon(s) !== null);
  const offen = vergangen.find((s) => ausgangVon(s) === null);

  let ueberfaellig = false;
  if (offen) {
    const tage =
      (Date.parse(`${heute}T00:00:00Z`) - Date.parse(`${offen.datum}T00:00:00Z`)) /
      86_400_000;
    ueberfaellig = tage > nachtragFrist;
  }

  return { letztes, offen, ueberfaellig };
}

/**
 * Ein Satz, der das Ergebnis einordnet, statt es nur zu wiederholen.
 *
 * Bewusst ohne Ausrufezeichen und ohne Wertung des Gegners. Der Verein
 * schreibt ueber sich, nicht ueber andere.
 */
export function ergebnisSatz(spiel: Spiel): string {
  const ausgang = ausgangVon(spiel);
  const auswaerts = spiel.ort !== "Heim";
  const wo = auswaerts ? "Auswärts" : "Heim";
  if (ausgang === "sieg") return `${wo}sieg gegen ${gegnerVon(spiel)}`;
  if (ausgang === "niederlage") return `${wo}niederlage gegen ${gegnerVon(spiel)}`;
  if (ausgang === "unentschieden") return `Unentschieden gegen ${gegnerVon(spiel)}`;
  return `Gegen ${gegnerVon(spiel)}`;
}

/*
 * Das Band fuer den Kopfbereich: die letzten gespielten Partien und die
 * naechsten, in einer Reihe.
 *
 * Warum drei plus zwei und nicht vier plus eins: Auf 1920 Pixeln passen
 * fuenf Eintraege in eine Zeile, ohne dass sie umbricht (gemessen am
 * 08.09.2026: fuenf mal 176 Pixel plus vier mal 12 Pixel Abstand ergeben
 * 928, die Zeile hat 1216). Und drei Ergebnisse zeigen eine Form, ein
 * einzelnes nur ein Ereignis.
 */
export function saisonBand(
  spiele: Spiel[],
  heute: string = heuteInDeutschland(),
  zurueck = 3,
  voraus = 2
): Spiel[] {
  const vergangen = spiele.filter((s) => s.datum < heute).slice(-zurueck);
  const kommend = spiele.filter((s) => s.datum >= heute).slice(0, voraus);
  return [...vergangen, ...kommend];
}

/**
 * Die Spielzeit, zu der eine Reihe von Spielen gehoert, als "2026/27".
 *
 * WARUM ABGELEITET UND NICHT EINGETIPPT: Im Kopfbereich stand bis zum
 * 22.09.2026 "Die Saison bis hierher". Der Satz war schief, denn unter ihm
 * stehen drei gespielte Partien UND die naechsten zwei, also auch Zukunft.
 * Die neue Zeile nennt stattdessen die Spielzeit. Eine fest eingetippte
 * Jahreszahl waere aber genau die Sorte Angabe, die im naechsten Juli
 * unbemerkt falsch wird, und dieses Projekt hatte diesen Fehler schon
 * einmal: eine von Hand gepflegte Tabelle, die der Unterseite widersprach.
 *
 * Abgeleitet wird aus den Spielen selbst, nicht aus dem heutigen Datum. Damit
 * passt die Zeile immer zu dem, was unter ihr steht, auch im Rueckfall aus
 * dem Repo, wenn FuPa schweigt.
 *
 * Die Grenze liegt zwischen Juni und Juli: Ein Spiel ab Juli gehoert zur
 * Spielzeit Jahr/Jahr+1, eines bis Juni zur Spielzeit Jahr-1/Jahr. Das deckt
 * sich mit FuPa, deren teamSeason den Slug "sv-fisch-m1-2026-27" traegt,
 * waehrend das frueheste Spiel am 05.07.2026 liegt.
 *
 * Bei Spielen aus zwei Spielzeiten gewinnt die haeufigere. Das kommt im Band
 * nur in der Woche des Saisonwechsels vor, und dann soll die Ueberschrift der
 * Mehrheit der Eintraege folgen.
 */
export function saisonVon(spiele: Spiel[]): string | null {
  const zaehler = new Map<number, number>();

  for (const spiel of spiele) {
    const jahr = Number(spiel.datum.slice(0, 4));
    const monat = Number(spiel.datum.slice(5, 7));
    if (!jahr || !monat) continue;
    const start = monat >= 7 ? jahr : jahr - 1;
    zaehler.set(start, (zaehler.get(start) ?? 0) + 1);
  }

  if (zaehler.size === 0) return null;

  const [start] = [...zaehler.entries()].sort((a, b) => b[1] - a[1])[0];
  return `${start}/${String((start + 1) % 100).padStart(2, "0")}`;
}
