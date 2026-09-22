/*
 * Waechter: Zeigt jede Weiterleitung aus lib/alte-adressen.ts auf eine Seite,
 * die es wirklich gibt?
 *
 * WARUM DAS EINEN EIGENEN WAECHTER BRAUCHT:
 *
 * In lib/alte-adressen.ts stehen die 32 Adressen der bisherigen Vereinsseite
 * sv-fisch.de, damit sie nach dem geplanten Umzug nicht ins Leere laufen.
 * Angelegt wurden sie am 23.09.2026, gebraucht werden sie erst am Umzugstag.
 *
 * Dazwischen liegen Monate, in denen niemand sie ansieht. Wird in der Zeit
 * eine Seite umbenannt oder zusammengelegt, zeigt die Weiterleitung auf eine
 * Seite, die es nicht mehr gibt: aus einem 404 wird ein 404 mit Umweg, und
 * das ist schlechter als vorher, weil es wie eine Loesung aussieht.
 *
 * Genau das ist auf dieser Seite schon einmal passiert, in kleinerem Rahmen:
 * Die Bambini-Seiten fielen weg, und ihre Weiterleitungen haetten dasselbe
 * Problem bekommen, waere /fussball/jugend spaeter noch einmal umbenannt
 * worden.
 *
 * WARUM DIE DATEI ALS TEXT GELESEN WIRD und nicht importiert: Sie ist
 * TypeScript, dieses Skript ist ein einfaches .mjs und laeuft vor dem Bau.
 * Ein Ladeprogramm fuer TypeScript nur fuer diese eine Liste waere mehr
 * bewegliche Teile als Nutzen. Das Muster "neu: \"...\"" ist eindeutig genug.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const WURZEL = process.cwd();
const QUELLE = join(WURZEL, "lib", "alte-adressen.ts");

if (!existsSync(QUELLE)) {
  process.stderr.write(
    "\nlib/alte-adressen.ts fehlt. Entweder ist die Datei geloescht worden," +
      "\ndann gehoert auch der Aufruf dieses Waechters aus package.json raus," +
      "\noder sie ist verschoben worden.\n\n"
  );
  process.exitCode = 1;
  process.exit();
}

const text = readFileSync(QUELLE, "utf8");

/* Jedes Paar einzeln, damit die Fehlermeldung sagen kann, WELCHE alte
   Adresse ins Leere zeigt. Eine Liste nur der Ziele waere kuerzer und im
   Fehlerfall nutzlos. */
const paare = [...text.matchAll(/alt:\s*"([^"]+)"[\s\S]{0,400}?neu:\s*"([^"]+)"/g)].map(
  (m) => ({ alt: m[1], neu: m[2] })
);

if (paare.length === 0) {
  process.stderr.write(
    "\nIn lib/alte-adressen.ts steht kein einziges Adresspaar.\n" +
      "Entweder ist die Liste leer, oder die Schreibweise hat sich geaendert\n" +
      "und das Muster in diesem Waechter passt nicht mehr.\n\n"
  );
  process.exitCode = 1;
  process.exit();
}

/* Welche Seiten gibt es? Jede page.tsx unter app/ ist eine. */
function seitenSammeln(verzeichnis, gefunden = new Set(["/"])) {
  for (const name of readdirSync(verzeichnis)) {
    const pfad = join(verzeichnis, name);
    if (statSync(pfad).isDirectory()) {
      seitenSammeln(pfad, gefunden);
    } else if (name === "page.tsx") {
      const rel = relative(join(WURZEL, "app"), verzeichnis).split(sep).join("/");
      gefunden.add(rel === "" ? "/" : "/" + rel);
    }
  }
  return gefunden;
}

const seiten = seitenSammeln(join(WURZEL, "app"));

/*
 * Adressen mit einem Platzhalter im Pfad, also [slug], koennen so nicht
 * geprueft werden: /aktuelles/[slug] ist keine Adresse, sondern eine Form.
 * Ein Ziel, das auf eine solche Seite zeigt, wird hier als vorhanden
 * gewertet, wenn der Teil davor stimmt.
 */
const formen = [...seiten].filter((s) => s.includes("["));
function vorhanden(ziel) {
  if (seiten.has(ziel)) return true;
  return formen.some((form) => {
    const muster = new RegExp("^" + form.replace(/\[[^\]]+\]/g, "[^/]+") + "$");
    return muster.test(ziel);
  });
}

const tot = paare.filter((p) => !vorhanden(p.neu));

if (tot.length > 0) {
  process.stderr.write(
    `\nWeiterleitungen ins Leere: ${tot.length} von ${paare.length} geprueften.\n\n`
  );
  for (const { alt, neu } of tot) {
    process.stderr.write(`  /${alt}\n      zeigt auf ${neu}, diese Seite gibt es nicht\n`);
  }
  process.stderr.write(
    "\nEntweder das Ziel in lib/alte-adressen.ts auf die neue Adresse setzen,\n" +
      "oder den Eintrag entfernen, wenn es keine passende Seite mehr gibt.\n" +
      "Eine Weiterleitung auf eine fehlende Seite ist schlechter als keine:\n" +
      "Sie sieht aus wie eine Loesung und ergibt trotzdem einen 404.\n\n"
  );
  process.exitCode = 1;
} else {
  console.log(
    `Weiterleitungen geprueft: ${paare.length} alte Adressen, alle Ziele vorhanden.`
  );
}
