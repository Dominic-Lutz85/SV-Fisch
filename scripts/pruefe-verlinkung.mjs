/*
 * Waechter gegen verwaiste Seiten.
 *
 * Anlass: Das Hauptmenue haengt per Portal am body und entsteht erst im
 * Browser. Im ausgelieferten HTML steht es nicht. Seiten, die NUR dort
 * verlinkt sind, waren dadurch von nirgendwo erreichbar: Suchmaschinen kannten
 * sie hoechstens aus der Sitemap, und ohne JavaScript kam man gar nicht hin.
 * Betroffen waren /kontakt und /elfer-turnier, also ausgerechnet die
 * Kontaktseite. Gesehen hat das niemand, weil das Menue im Browser ja da ist.
 *
 * Geprueft wird am FERTIGEN HTML unter .next/server/app, nicht am Quelltext.
 * Der erste Versuch las die Quelldateien und liess die aus, die nur das Menue
 * fuettern. Das war zu grob: der Fussbereich holt sich seine Links ebenfalls
 * aus lib/navigation.ts und rendert sie serverseitig, also voellig in Ordnung.
 * Der Waechter meldete daraufhin sechs Seiten als verwaist, von denen vier
 * sauber verlinkt waren. Am gebauten HTML gibt es diese Frage nicht mehr: was
 * drinsteht, steht drin.
 *
 * Laeuft deshalb NACH dem Bau, als postbuild.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const WURZEL = process.cwd();
const GEBAUT = join(WURZEL, ".next", "server", "app");

/* Adressen, die niemand verlinken muss. */
const BRAUCHT_KEINEN_VERWEIS = new Set([
  "", // Startseite, das Wappen in der Kopfleiste fuehrt dorthin
]);

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

function seitenAdressen(pfad, praefix = "") {
  const gefunden = [];
  for (const name of readdirSync(pfad)) {
    const voll = join(pfad, name);
    if (statSync(voll).isDirectory()) {
      if (name.startsWith("_") || name.startsWith("@")) continue;
      const teil = name.startsWith("(") && name.endsWith(")") ? "" : `/${name}`;
      gefunden.push(...seitenAdressen(voll, praefix + teil));
    } else if (/^page\.(tsx|ts|jsx)$/.test(name)) {
      gefunden.push(praefix);
    }
  }
  return gefunden;
}

const seiten = seitenAdressen(join(WURZEL, "app"))
  .filter((a) => !a.includes("["))
  .filter((a) => !BRAUCHT_KEINEN_VERWEIS.has(a));

const verweise = new Set();
let gelesen = 0;
for (const datei of htmlDateien(GEBAUT)) {
  gelesen++;
  const inhalt = readFileSync(datei, "utf8");
  for (const m of inhalt.matchAll(/href="(\/[\w\-/]*)"/g)) {
    verweise.add(m[1].replace(/\/$/, ""));
  }
}

const verwaist = seiten.filter((a) => !verweise.has(a)).sort();

if (verwaist.length === 0) {
  console.log(
    `Verlinkung geprueft: ${seiten.length} Seiten in ${gelesen} gebauten Dokumenten, keine verwaist.`
  );
  process.exit(0);
}

console.error("\nDiese Seiten stehen in keinem ausgelieferten HTML:\n");
for (const a of verwaist) console.error(`  ${a}`);
console.error(
  "\nDas Hauptmenue entsteht erst im Browser und zaehlt deshalb nicht. Wer\n" +
    "eine Seite nur dort verlinkt, versteckt sie vor Suchmaschinen und vor\n" +
    "jedem ohne JavaScript. Einen festen Verweis ergaenzen, etwa im\n" +
    "Fussbereich.\n"
);
process.exit(1);
