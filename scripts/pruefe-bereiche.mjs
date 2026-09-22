/*
 * Waechter gegen einen Vorstandsbereich, der nirgends ankommt.
 *
 * Die Bereiche des Vorstands standen an drei Stellen: als Typ in
 * types/content.ts, als eigene Liste in app/verein/vorstand/page.tsx und als
 * Auswahlliste in public/admin/config.yml. Die Seite kannte "Darts" nicht.
 * Der Eintrag stand seit Monaten in content/vorstand.json, der Typ erlaubte
 * ihn, das Redaktionswerkzeug bot ihn an, und angezeigt wurde er nie: die
 * Seite filtert nach ihrer eigenen Liste, und was dort fehlt, faellt still
 * heraus. Kein Fehler, keine Warnung, nur eine Person, die nicht dasteht.
 *
 * Die Liste in der Seite ist weg, sie kommt jetzt aus BEREICHE in
 * types/content.ts. Bleiben zwei Stellen, denn config.yml ist YAML und kann
 * nichts importieren. Dieser Waechter haelt sie zusammen und prueft dazu die
 * Daten selbst.
 *
 * Drei Proben:
 *  1. Die Auswahlliste in config.yml nennt genau die Bereiche aus BEREICHE.
 *  2. Jeder Bereich in content/vorstand.json steht in BEREICHE.
 *  3. Jeder Bereich in BEREICHE hat mindestens einen Eintrag. Ein leerer
 *     Bereich ist kein Fehler im Code, aber eine Ueberschrift, die niemand
 *     je sieht: die Seite ueberspringt ihn. Deshalb nur ein Hinweis.
 *
 * Er bricht ab, denn anders als bei FuPa haengt hier nichts an einem fremden
 * Server. Was er prueft, liegt vollstaendig im Repo.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const WURZEL = process.cwd();

/**
 * BEREICHE aus types/content.ts lesen. Node kann die Datei nicht importieren,
 * also wird der Block herausgeschnitten. Passt das Muster nicht mehr, bricht
 * der Waechter ab, statt stillschweigend eine leere Liste anzunehmen: eine
 * leere Liste waere in jedem Vergleich unten unauffaellig gruen.
 */
function bereicheAusTypen() {
  const quelle = readFileSync(join(WURZEL, "types", "content.ts"), "utf8");
  const block = quelle.match(/export const BEREICHE = \[([\s\S]*?)\] as const;/);
  if (!block) {
    throw new Error(
      "BEREICHE nicht in types/content.ts gefunden. Wurde die Konstante " +
        "umbenannt oder anders geschrieben? Dann muss das Muster in " +
        "scripts/pruefe-bereiche.mjs mit."
    );
  }
  const namen = [...block[1].matchAll(/"([^"]+)"/g)].map((t) => t[1]);
  if (namen.length === 0) {
    throw new Error("BEREICHE in types/content.ts ist leer.");
  }
  return namen;
}

/**
 * Die Auswahlliste des Bereichsfeldes aus public/admin/config.yml. Gesucht
 * wird die options-Zeile, die unmittelbar auf "name: bereich" folgt, damit
 * eine gleichnamige Zeile in einer anderen Sammlung nicht danebengreift.
 */
function bereicheAusCms() {
  const quelle = readFileSync(
    join(WURZEL, "public", "admin", "config.yml"),
    "utf8"
  );
  const stelle = quelle.match(/name:\s*bereich[\s\S]{0,200}?options:\s*\[([^\]]*)\]/);
  if (!stelle) {
    throw new Error(
      "Auswahlliste fuer das Feld bereich nicht in public/admin/config.yml " +
        "gefunden. Wurde das Feld umbenannt oder auf mehrere Zeilen verteilt?"
    );
  }
  return [...stelle[1].matchAll(/'([^']+)'|"([^"]+)"/g)].map((t) => t[1] ?? t[2]);
}

const ausTypen = bereicheAusTypen();
const ausCms = bereicheAusCms();
const eintraege = JSON.parse(
  readFileSync(join(WURZEL, "content", "vorstand.json"), "utf8")
).eintraege;

const fehler = [];
const hinweise = [];

/* Probe 1: Auswahlliste gegen BEREICHE, als Menge. Die Reihenfolge in
 * config.yml bestimmt nur, wie die Liste im Werkzeug aufklappt, und die darf
 * anders sein als die Reihenfolge auf der Seite. */
for (const b of ausTypen) {
  if (!ausCms.includes(b)) {
    fehler.push(
      `"${b}" steht in BEREICHE, fehlt aber in der Auswahlliste von ` +
        `public/admin/config.yml. Wer den Vorstand ueber /admin pflegt, kann ` +
        `diesen Bereich nicht waehlen.`
    );
  }
}
for (const b of ausCms) {
  if (!ausTypen.includes(b)) {
    fehler.push(
      `"${b}" steht in der Auswahlliste von public/admin/config.yml, aber ` +
        `nicht in BEREICHE. Wer ihn dort waehlt, verschwindet von der Seite.`
    );
  }
}

/* Probe 2: die Daten selbst. */
for (const person of eintraege) {
  if (!ausTypen.includes(person.bereich)) {
    fehler.push(
      `${person.name} steht in content/vorstand.json unter dem Bereich ` +
        `"${person.bereich}", den es in BEREICHE nicht gibt. Die Person wird ` +
        `auf /verein/vorstand nicht angezeigt.`
    );
  }
}

/* Probe 3: leere Bereiche, nur als Hinweis. */
for (const b of ausTypen) {
  if (!eintraege.some((p) => p.bereich === b)) {
    hinweise.push(`Bereich "${b}" hat keinen einzigen Eintrag.`);
  }
}

if (fehler.length > 0) {
  process.stderr.write("\nVorstandsbereiche stimmen nicht ueberein:\n");
  for (const f of fehler) process.stderr.write(`  - ${f}\n`);
  process.stderr.write(
    "\nDie Bereiche stehen in types/content.ts (BEREICHE) und in " +
      "public/admin/config.yml. Beide angleichen.\n\n"
  );
  process.exitCode = 1;
} else {
  process.stdout.write(
    `Vorstandsbereiche geprueft: ${ausTypen.length} Bereiche, ` +
      `${eintraege.length} Eintraege, Seite und Redaktionswerkzeug einig.\n`
  );
  for (const h of hinweise) process.stdout.write(`  Hinweis: ${h}\n`);
}
