/*
 * Waechter gegen wachsende Platzhalter.
 *
 * ANLASS, und es ist mein eigener Fehler vom 09.09.2026:
 *
 * Nach dem Umstellen des Kaders auf FuPa standen auf /fussball/kader zum
 * ersten Mal echte Namen. Unter dem Raster blieb aber der Satz
 * "[BITTE PRÜFEN/ERGÄNZEN] – Kader in content/kader.json aktuell halten"
 * stehen, und der war nach der Umstellung gleich doppelt falsch. Gefunden
 * habe ich ihn nur, weil ich mir den Bildschirmfoto angesehen habe. Meine
 * eigene Messung hatte "0 Platzhalter" gemeldet, weil sie nach
 * "[Name eintragen]" suchte und nichts anderem.
 *
 * Laut CLAUDE.md sind sichtbare Platzhalter auf dieser Seite ein
 * Ausschlusskriterium und kein Schoenheitsfehler. Etwas, das darueber
 * entscheidet, ob ein Auftraggeber anruft, darf nicht davon abhaengen, ob
 * jemand zufaellig hinsieht.
 *
 * WARUM EINE OBERGRENZE UND KEINE NULL:
 *
 * Am 09.09.2026 stehen 89 Platzhalter im gebauten HTML, die meisten im
 * Impressum, im Datenschutz und im Mitgliedsantrag. Die kann nur der
 * Vorstand fuellen, nicht der Programmierer. Ein Waechter, der auf null
 * besteht, wuerde ab sofort jeden Build abbrechen und waere nach einem Tag
 * abgeschaltet.
 *
 * Diese Zahl darf deshalb sinken, aber nie steigen. Wer eine Stelle fuellt,
 * traegt die neue, kleinere Zahl hier ein. Wer einen Platzhalter ergaenzt,
 * merkt es sofort statt in drei Wochen.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const GEBAUT = join(process.cwd(), ".next", "server", "app");

/*
 * Stand vom 09.09.2026, gezaehlt im gebauten HTML. Nur nach unten aendern,
 * und dann mit einem Wort in der Commit-Nachricht, welche Stelle gefuellt
 * wurde.
 */
const OBERGRENZE = 89;

/*
 * Die Muster. Absichtlich mehr als eines: Genau daran ist die Pruefung am
 * 09.09. gescheitert, sie kannte nur "[Name eintragen]".
 */
const MUSTER = [
  /\[BITTE PR(?:Ü|&#x00dc;|&uuml;)FEN\/ERG(?:Ä|&#x00c4;|&auml;)NZEN\]/g,
  /*
   * Deckt "[Name eintragen]", "[Ort eintragen]",
   * "[Vereinsregisternummer eintragen]" und alles in der Form mit ab.
   *
   * Ein eigenes Muster fuer "[Name eintragen]" stand hier zuerst zusaetzlich
   * daneben. Ergebnis: 121 statt 89, weil jeder solche Platzhalter von beiden
   * Mustern gezaehlt wurde. Aufgefallen ist es nur, weil die Zahl nicht zu
   * der aus dem grep passte. Wer hier ein Muster ergaenzt, prueft, ob es sich
   * mit einem vorhandenen ueberschneidet.
   */
  /\[[A-Za-zÄÖÜäöüß/ ]{2,40} eintragen\]/g,
];

if (!existsSync(GEBAUT)) {
  console.error("\n.next/server/app fehlt. Erst bauen, dann pruefen.\n");
  process.exit(1);
}

function* htmlDateien(pfad) {
  for (const name of readdirSync(pfad)) {
    const voll = join(pfad, name);
    if (statSync(voll).isDirectory()) yield* htmlDateien(voll);
    else if (name.endsWith(".html")) yield voll;
  }
}

const proSeite = new Map();
let gesamt = 0;

for (const datei of htmlDateien(GEBAUT)) {
  const inhalt = readFileSync(datei, "utf8");
  let hier = 0;
  for (const muster of MUSTER) {
    hier += (inhalt.match(muster) ?? []).length;
  }
  if (hier > 0) {
    const adresse =
      "/" + datei.slice(GEBAUT.length + 1).replace(/\\/g, "/").replace(/\.html$/, "");
    proSeite.set(adresse === "/index" ? "/" : adresse, hier);
    gesamt += hier;
  }
}

const sortiert = [...proSeite.entries()].sort((a, b) => b[1] - a[1]);

if (gesamt > OBERGRENZE) {
  console.error(
    `\nPlatzhalter gestiegen: ${gesamt} statt hoechstens ${OBERGRENZE}.\n`
  );
  for (const [adresse, anzahl] of sortiert) {
    console.error(`  ${String(anzahl).padStart(3)}  ${adresse}`);
  }
  console.error(
    "\nEntweder die neue Stelle fuellen, oder, wenn sie bewusst dazukam,\n" +
      "OBERGRENZE in dieser Datei anheben und begruenden.\n"
  );
  process.exit(1);
}

if (gesamt < OBERGRENZE) {
  console.log(
    `Platzhalter geprueft: ${gesamt}, das sind ${OBERGRENZE - gesamt} weniger ` +
      `als die Obergrenze. OBERGRENZE in scripts/pruefe-platzhalter.mjs auf ` +
      `${gesamt} senken, damit der Fortschritt gehalten wird.`
  );
} else {
  console.log(
    `Platzhalter geprueft: ${gesamt}, unveraendert.` +
      (sortiert.length ? ` Die meisten auf ${sortiert[0][0]} (${sortiert[0][1]}).` : "")
  );
}
