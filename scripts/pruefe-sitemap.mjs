/*
 * Waechter gegen eine Sitemap, die aus dem Tritt geraet.
 *
 * app/sitemap.ts pflegt eine Liste von Hand. Wer eine Seite anlegt und die
 * Liste vergisst, merkt davon nichts: die Seite ist erreichbar, sie steht nur
 * nirgends, und Google erfaehrt sie hoechstens ueber einen Link. Andersherum
 * genauso: eine geloeschte Seite bleibt als tote Adresse in der Sitemap stehen,
 * und das kostet in der Search Console eine Fehlermeldung.
 *
 * Dieser Waechter vergleicht die Liste mit dem, was unter app/ wirklich liegt.
 *
 * Nicht geprueft werden:
 *  - Seiten mit dynamischem Abschnitt wie [slug]. Die kommen im Sitemap ueber
 *    ihre Daten dazu, nicht ueber diese Liste.
 *  - Rechtstexte und Sonderseiten, die absichtlich draussen bleiben sollen.
 *    Wer eine Seite bewusst nicht im Sitemap haben will, traegt sie unten in
 *    ABSICHTLICH_DRAUSSEN ein, mit Begruendung.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const WURZEL = process.cwd();
const APP = join(WURZEL, "app");

/* Adressen, die es gibt, die aber bewusst nicht im Sitemap stehen. */
const ABSICHTLICH_DRAUSSEN = new Set([
  // Noch keine. Eintraege hier bitte immer mit einem Satz Begruendung.
]);

/** Alle Seitenadressen unter app/, ohne dynamische Abschnitte. */
function seitenAdressen(pfad = APP, praefix = "") {
  const gefunden = [];
  for (const name of readdirSync(pfad)) {
    const voll = join(pfad, name);
    if (statSync(voll).isDirectory()) {
      // (gruppen) zaehlen nicht zur Adresse, @slots und _private gar nicht
      if (name.startsWith("_") || name.startsWith("@")) continue;
      const teil = name.startsWith("(") && name.endsWith(")") ? "" : `/${name}`;
      gefunden.push(...seitenAdressen(voll, praefix + teil));
    } else if (name === "page.tsx" || name === "page.ts" || name === "page.jsx") {
      gefunden.push(praefix === "" ? "" : praefix);
    }
  }
  return gefunden;
}

const vorhanden = seitenAdressen()
  .filter((a) => !a.includes("["))
  .filter((a) => !ABSICHTLICH_DRAUSSEN.has(a));

const quelle = readFileSync(join(APP, "sitemap.ts"), "utf8");
const block = quelle.match(/const staticRoutes = \[([\s\S]*?)\];/);
if (!block) {
  console.error("\nIn app/sitemap.ts wurde keine Liste staticRoutes gefunden.");
  console.error("Entweder heisst sie jetzt anders, dann diesen Waechter anpassen.\n");
  process.exit(1);
}
const eingetragen = [...block[1].matchAll(/"([^"]*)"/g)].map((m) => m[1]);

const fehlen = vorhanden.filter((a) => !eingetragen.includes(a)).sort();
const zuviel = eingetragen.filter((a) => !vorhanden.includes(a)).sort();

if (fehlen.length === 0 && zuviel.length === 0) {
  console.log(`Sitemap geprueft: ${vorhanden.length} Seiten, Liste stimmt.`);
  process.exit(0);
}

console.error("\nDie Sitemap passt nicht zu den vorhandenen Seiten.\n");
for (const a of fehlen) {
  console.error(`  fehlt in app/sitemap.ts:  "${a || "/"}"`);
}
for (const a of zuviel) {
  console.error(`  Seite gibt es nicht:      "${a || "/"}"`);
}
console.error(
  "\nEintragen oder entfernen. Soll eine Seite bewusst draussen bleiben,\n" +
    "gehoert sie in ABSICHTLICH_DRAUSSEN in dieser Datei, mit Begruendung.\n"
);
process.exit(1);
