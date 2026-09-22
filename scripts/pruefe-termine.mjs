/*
 * Waechter gegen einen Kalender, der unbemerkt in die Vergangenheit rutscht.
 *
 * ANLASS, 22.09.2026: Die Startseite zeigte keinen Termin mehr und der
 * Kalender war leer. Alle sechs Eintraege in content/termine.json lagen in
 * der Vergangenheit, der juengste vom 19.09. Aufgefallen ist es niemandem,
 * weil nichts kaputt war: Ein Block, der sich bei fehlenden Daten ausblendet,
 * sieht genauso aus wie einer, den es nie gab.
 *
 * Seitdem holt der Kalender die Spiele von FuPa, er kann also nicht mehr ganz
 * leer sein. Die VEREINSTERMINE koennen es sehr wohl, und genau die sind das,
 * was nur der Verein liefern kann.
 *
 * ER MELDET, ER BLOCKIERT NICHT. Rueckgabewert immer 0, dieselbe Regel wie
 * bei pruefe-fupa und pruefe-instagram: Ein abgelaufener Vereinstermin ist
 * kein Grund, die ganze Seite nicht zu bauen.
 *
 * ZWEITE PROBE, und die ist der eigentliche Grund fuer diese Datei: Kein
 * Fussballspiel in content/termine.json. Dort standen zwei, eines davon gegen
 * einen "FC Waldstadt", den es im gesamten FuPa-Spielplan nicht gibt. Spiele
 * gehoeren nicht in die Handarbeit, sie kommen aus der Schnittstelle.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const WURZEL = process.cwd();
const VORWARNUNG_TAGE = 21;

const eintraege = JSON.parse(
  readFileSync(join(WURZEL, "content", "termine.json"), "utf8")
).eintraege;

const heute = new Date();
heute.setHours(0, 0, 0, 0);

const kuenftig = eintraege.filter((t) => new Date(t.datum) >= heute);
const spiele = eintraege.filter((t) => t.kategorie === "Fußball");

let etwasGesagt = false;

/* Probe 1: Stehen ueberhaupt noch Vereinstermine bevor? */
if (kuenftig.length === 0) {
  const juengster = eintraege
    .map((t) => t.datum.slice(0, 10))
    .sort()
    .pop();
  process.stdout.write(
    `\nTermine: KEIN einziger Vereinstermin steht mehr bevor.\n` +
      `  Der juengste lag am ${juengster}.\n` +
      `  Die Zeile im Kopfbereich der Startseite verschwindet damit, und im\n` +
      `  Kalender stehen nur noch die Spiele aus der FuPa-Schnittstelle.\n` +
      `  Nur der Verein kann das fuellen: content/termine.json, oder ueber\n` +
      `  die Redaktionsoberflaeche unter /admin.\n\n`
  );
  etwasGesagt = true;
} else {
  const naechster = kuenftig[0];
  const tage = Math.ceil(
    (new Date(naechster.datum) - heute) / 86_400_000
  );
  if (kuenftig.length === 1 && tage <= VORWARNUNG_TAGE) {
    process.stdout.write(
      `\nTermine: Nur noch EIN Vereinstermin, und der ist in ${tage} Tagen.\n` +
        `  "${naechster.titel}" am ${naechster.datum.slice(0, 10)}.\n` +
        `  Danach steht nichts mehr an. Rechtzeitig nachtragen.\n\n`
    );
    etwasGesagt = true;
  }
}

/* Probe 2: Keine Spiele in der Handarbeit. */
if (spiele.length > 0) {
  process.stdout.write(
    `\nTermine: ${spiele.length} Fussballspiel(e) stehen in content/termine.json.\n` +
      spiele.map((s) => `    "${s.titel}" am ${s.datum.slice(0, 10)}\n`).join("") +
      `  Spiele kommen seit dem 22.09.2026 aus der FuPa-Schnittstelle, siehe\n` +
      `  lib/termine.ts. Von Hand gepflegt stehen sie doppelt im Kalender und\n` +
      `  laufen irgendwann auseinander. Genau so kam ein "Kreispokal gegen FC\n` +
      `  Waldstadt" in den Kalender, den es nie gegeben hat.\n\n`
  );
  etwasGesagt = true;
}

if (!etwasGesagt) {
  process.stdout.write(
    `Termine geprueft: ${kuenftig.length} von ${eintraege.length} Vereinsterminen ` +
      `stehen bevor, keine Spiele in der Handarbeit.\n`
  );
}

process.exit(0);
