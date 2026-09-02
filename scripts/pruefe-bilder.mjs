/*
 * Waechter gegen tote Bildverweise.
 *
 * Anlass: Auf /gymnastik und /elfer-turnier stand je ein <Image> auf eine
 * Datei, die es nicht gibt. Im dunklen Layout faellt das nicht auf, denn hinter
 * dem Bild liegt eine schwarze Flaeche auf schwarzem Grund. Sichtbar wurde es
 * erst in der Netzwerkliste: der Bilddienst von Next antwortet mit 400.
 *
 * Der Waechter laeuft vor jedem Bau und bricht ab, wenn ein Verweis ins Leere
 * geht. Lieber ein roter Bau als eine Seite mit einem Loch.
 *
 * Bewusst nicht geprueft werden:
 *  - Adressen mit Protokoll, die liegen woanders,
 *  - alles unter app/, was Next selbst ausliefert (icon.svg, apple-icon,
 *    opengraph-image). Diese Adressen zeigen nicht nach public.
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const WURZEL = process.cwd();
const PUBLIC = join(WURZEL, "public");
const ORDNER = ["app", "components", "lib", "content"];
const ENDUNGEN = new Set([".tsx", ".ts", ".md", ".json"]);

/* Von Next selbst erzeugt, liegt nicht in public. */
const VON_NEXT = new Set([
  "/icon.svg",
  "/apple-icon.png",
  "/opengraph-image.png",
  "/favicon.ico",
]);

const MUSTER = /["'`](\/[\w\-./%]+\.(?:png|jpe?g|webp|avif|svg|gif))["'`]/g;

/*
 * Ausnahme fuer <Vereinsbild>. Dieser Baustein prueft selbst, ob die Datei da
 * ist, und zeigt sonst eine gestaltete Leerstelle. Ein Verweis darin ist also
 * kein Loch, sondern eine angekuendigte Luecke. Gesammelt wird pro Datei, damit
 * derselbe Pfad an einer anderen Stelle trotzdem auffaellt.
 */
const VEREINSBILD = /<Vereinsbild\b[^>]*?\bsrc=["'`](\/[^"'`]+)["'`]/gs;

function angekuendigt(inhalt) {
  return new Set([...inhalt.matchAll(VEREINSBILD)].map((m) => m[1]));
}

function* dateien(pfad) {
  for (const name of readdirSync(pfad)) {
    const voll = join(pfad, name);
    if (statSync(voll).isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      yield* dateien(voll);
    } else if (ENDUNGEN.has(extname(name))) {
      yield voll;
    }
  }
}

const fehlend = new Map();
let geprueft = 0;

for (const ordner of ORDNER) {
  const start = join(WURZEL, ordner);
  if (!existsSync(start)) continue;
  for (const datei of dateien(start)) {
    const inhalt = readFileSync(datei, "utf8");
    const geduldet = angekuendigt(inhalt);
    for (const treffer of inhalt.matchAll(MUSTER)) {
      const adresse = treffer[1];
      if (VON_NEXT.has(adresse) || geduldet.has(adresse)) continue;
      geprueft++;
      if (existsSync(join(PUBLIC, adresse.slice(1)))) continue;
      const ort = datei.slice(WURZEL.length + 1).replaceAll("\\", "/");
      if (!fehlend.has(adresse)) fehlend.set(adresse, new Set());
      fehlend.get(adresse).add(ort);
    }
  }
}

if (fehlend.size === 0) {
  console.log(`Bildverweise geprueft: ${geprueft}, alle vorhanden.`);
  process.exit(0);
}

console.error(`\nTote Bildverweise: ${fehlend.size} von ${geprueft} geprueften.\n`);
for (const [adresse, orte] of [...fehlend].sort()) {
  console.error(`  fehlt: public${adresse}`);
  for (const ort of [...orte].sort()) console.error(`         genannt in ${ort}`);
}
console.error(
  "\nEntweder die Datei nachlegen oder den Verweis entfernen. Fuer Fotos, die\n" +
    "der Verein noch liefern muss, gibt es components/Vereinsbild.tsx: das\n" +
    "zeigt eine ehrliche Leerstelle statt eines kaputten Bildes.\n"
);
process.exit(1);
