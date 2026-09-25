/*
 * Die Seite auf eine andere Domain umstellen.
 *
 *   node scripts/domain-umstellen.mjs sv-fisch.de          umstellen
 *   node scripts/domain-umstellen.mjs sv-fisch.de --probe  nur anzeigen
 *
 * WARUM DAS EIN SKRIPT IST UND KEINE ANLEITUNG:
 *
 * Die Domain steht an fuenf Stellen, die etwas bewirken, und an einem
 * Dutzend weiterer, die nur davon erzaehlen. Wer sie von Hand umstellt,
 * findet vier der fuenf und merkt die fuenfte erst, wenn etwas nicht geht.
 * Die unangenehmste ist die Anmeldung am Redaktionssystem: Stimmt dort die
 * Herkunft nicht, laeuft die Anmeldung bis zum letzten Schritt durch und
 * bricht dann ohne brauchbare Meldung ab.
 *
 * Kommentare und Dokumentation ruehrt das Skript NICHT an. Ein Kommentar,
 * der den Stand vom 22.09.2026 beschreibt, soll auch nach dem Umzug noch
 * sagen, was damals galt; automatisch umgeschrieben wuerde er zu einer
 * Behauptung ueber eine Vergangenheit, die es so nicht gab.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const WURZEL = process.cwd();
const ZIEL = process.argv[2];
const PROBE = process.argv.includes("--probe");

if (!ZIEL || ZIEL.startsWith("-")) {
  process.stderr.write(
    "\nAufruf:  node scripts/domain-umstellen.mjs <neue-domain> [--probe]\n" +
      "Beispiel: node scripts/domain-umstellen.mjs sv-fisch.de\n\n" +
      "Die Domain OHNE https:// und ohne www. angeben.\n\n"
  );
  process.exit(1);
}

if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(ZIEL) || ZIEL.startsWith("www.")) {
  process.stderr.write(
    `\n"${ZIEL}" sieht nicht aus wie eine Domain ohne www.\n` +
      "Erwartet wird etwas wie sv-fisch.de, nicht https://www.sv-fisch.de.\n\n"
  );
  process.exit(1);
}

/*
 * DIE BISHERIGE DOMAIN, gelesen bevor unten irgendetwas geschrieben wird.
 *
 * Die Stelle ZWEITDOMAIN braucht nicht das Ziel, sondern den Wert, der
 * vorher in HAUPTDOMAIN stand: Die alte Adresse soll nach dem Umzug auf die
 * neue zeigen. Wer die Reihenfolge der Stellen unten aendert, aendert daran
 * nichts, weil hier schon gelesen wurde.
 */
const BISHER = readFileSync(join(WURZEL, "next.config.ts"), "utf8").match(
  /const HAUPTDOMAIN = "([a-z0-9.-]+)";/
)?.[1];

if (!BISHER) {
  process.stderr.write(
    "\nHAUPTDOMAIN nicht in next.config.ts gefunden. Ohne den bisherigen " +
      "Wert kann die alte Adresse nicht weitergeleitet werden.\n\n"
  );
  process.exit(1);
}

if (BISHER === ZIEL) {
  process.stderr.write(
    `\nDie Domain steht bereits auf ${ZIEL}. Nichts zu tun.\n\n`
  );
  process.exit(1);
}

/*
 * Die sechs Stellen, die etwas bewirken. Jede mit dem Grund, warum sie
 * dazugehoert: Wer hier eine ergaenzt, soll denselben Satz schreiben
 * koennen, sonst gehoert sie vermutlich nicht dazu.
 */
const STELLEN = [
  {
    datei: "lib/config.ts",
    was: "Steuert Sitemap, Canonical-Tags und die Vorschaubilder fuer soziale Netze.",
    suche: /url: "https:\/\/[a-z0-9.-]+"/,
    ersatz: (d) => `url: "https://${d}"`,
  },
  {
    datei: "public/admin/config.yml",
    was: "Die Anmeldung am Redaktionssystem laeuft ueber diese Adresse zurueck.",
    suche: /base_url: https:\/\/[a-z0-9.-]+/,
    ersatz: (d) => `base_url: https://${d}`,
  },
  {
    datei: "app/api/cms-auth/callback/route.ts",
    was: "Nur diese Herkunft bekommt den Zugangsschluessel. Stimmt sie nicht, bricht die Anmeldung im letzten Zug ab.",
    suche: /const ERLAUBTE_HERKUNFT = \[\s*"[a-z0-9.-]+",\s*"www\.[a-z0-9.-]+",/,
    ersatz: (d) =>
      `const ERLAUBTE_HERKUNFT = [\n  "${d}",\n  "www.${d}",`,
  },
  {
    datei: "next.config.ts",
    was: "Leitet die bisherige Adresse auf die neue, sonst liefern beide denselben Inhalt.",
    suche: /const ZWEITDOMAIN = "[a-z0-9.-]*";/,
    ersatz: () => `const ZWEITDOMAIN = "${BISHER}";`,
  },
  {
    datei: "next.config.ts",
    was: "Schickt www auf die Adresse ohne www, damit Google nicht zwei Seiten sieht.",
    /*
     * Die Datei nennt die Domain seit dem 23.09.2026 nur noch einmal, als
     * Konstante HAUPTDOMAIN. Vorher standen dort zwei www-Regeln, eine fuer
     * die laufende und eine fuer die geplante Domain; ein Suchen-und-
     * Ersetzen haette daraus zwei gleiche gemacht. Die Begruendung steht im
     * Kopf von next.config.ts.
     */
    suche: /const HAUPTDOMAIN = "[a-z0-9.-]+";/,
    ersatz: (d) => `const HAUPTDOMAIN = "${d}";`,
  },
  {
    datei: "scripts/pruefe-fupa.mjs",
    was: "Meldet sich bei FuPa mit dem Seitennamen. Kosmetisch, aber falsch waere falsch.",
    suche: /"User-Agent": "[a-z0-9.-]+ build check"/,
    ersatz: (d) => `"User-Agent": "${d} build check"`,
  },
];

let geaendert = 0;
let fehlend = 0;

console.log(
  (PROBE ? "\nPROBELAUF, es wird nichts geschrieben.\n" : "") +
    `\nDomain auf ${ZIEL} stellen:\n`
);

for (const stelle of STELLEN) {
  const pfad = join(WURZEL, stelle.datei);
  if (!existsSync(pfad)) {
    console.log(`  FEHLT   ${stelle.datei} gibt es nicht`);
    fehlend++;
    continue;
  }
  const alt = readFileSync(pfad, "utf8");
  const treffer = alt.match(stelle.suche);
  if (!treffer) {
    console.log(`  FEHLT   ${stelle.datei}`);
    console.log(`          Die erwartete Stelle wurde nicht gefunden.`);
    console.log(`          ${stelle.was}`);
    fehlend++;
    continue;
  }
  const neu = alt.replace(stelle.suche, stelle.ersatz(ZIEL));
  if (neu === alt) {
    console.log(`  steht   ${stelle.datei} (schon auf ${ZIEL})`);
    continue;
  }
  if (!PROBE) writeFileSync(pfad, neu, "utf8");
  console.log(`  ${PROBE ? "wuerde " : "geaendert"} ${stelle.datei}`);
  console.log(`          ${treffer[0].split("\n")[0].trim()}`);
  console.log(`          wird zu: ${stelle.ersatz(ZIEL).split("\n")[0].trim()}`);
  geaendert++;
}

if (fehlend > 0) {
  process.stderr.write(
    `\n${fehlend} Stelle(n) nicht gefunden. Das Skript ist aelter als der Code:\n` +
      "Die genannten Dateien von Hand pruefen und die Muster hier oben\n" +
      "nachziehen, sonst bleibt beim naechsten Umzug wieder etwas stehen.\n\n"
  );
  process.exitCode = 1;
}

console.log(
  `\n${geaendert} von ${STELLEN.length} Stellen ${PROBE ? "waeren betroffen" : "umgestellt"}.\n`
);

if (!PROBE && geaendert > 0) {
  console.log(
    "Damit ist der Code fertig. Ausserhalb des Codes fehlt noch:\n" +
      "\n" +
      `  1. ${ZIEL} bei Vercel als Domain hinzufuegen\n` +
      "     (Projekt sv-fisch, Settings, Domains)\n" +
      `  2. DNS auf Vercel zeigen lassen, wie dort angegeben\n` +
      "  3. Diese Aenderung committen und pushen, dann baut Vercel neu\n" +
      "  4. ERST DANACH die alte Seite abschalten, nicht vorher:\n" +
      "     Solange beide laufen, sieht Google zweimal denselben Inhalt.\n" +
      "  5. Die bisherige Domain behalten und auf die neue weiterleiten,\n" +
      "     nicht kuendigen. Alte Links sollen ankommen.\n" +
      "  6. In der Google Search Console die Adressaenderung melden.\n" +
      "\n" +
      "Die 32 Adressen der alten Seite sind bereits vorbereitet, siehe\n" +
      "lib/alte-adressen.ts. Nach dem Umstellen einmal pruefen:\n" +
      "\n" +
      "  npm run pruefe:weiterleitungen\n" +
      "\n" +
      "Nicht vergessen: Das Vereinsdokument (SV-Fisch-Website-Uebersicht.pdf)\n" +
      "nennt die alte Adresse im Kopf und im Schlusssatz.\n"
  );
}
