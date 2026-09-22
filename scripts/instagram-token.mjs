/*
 * Den Instagram-Schluessel erneuern.
 *
 * Aufruf:  node scripts/instagram-token.mjs
 *
 * Liest INSTAGRAM_TOKEN aus der Umgebung oder aus .env.local, fordert bei Meta
 * einen neuen an und schreibt hin, was in Vercel einzutragen ist. Der neue
 * Schluessel wird NICHT irgendwo abgelegt: Er steht einmal auf dem Bildschirm,
 * und dort gehoert er auch hin. Ein Geheimnis, das ein Skript in eine Datei
 * schreibt, landet irgendwann im Repo.
 *
 * WARUM VON HAND UND NICHT AUTOMATISCH: Der neue Schluessel muesste dorthin,
 * wo die laufende Seite ihn liest, also in die Umgebungsvariablen bei Vercel.
 * Die kann eine laufende Seite nicht selbst aendern. Es gaebe einen Weg ueber
 * die Vercel-API, der braucht aber einen weiteren Schluessel mit Schreibrecht
 * auf das ganze Projekt, plus einen neuen Bau, damit der Wert greift. Das ist
 * mehr Angriffsflaeche und mehr bewegliche Teile als der Nutzen hergibt,
 * solange es um sechs Bilder auf einer Vereinsseite geht.
 *
 * Wer es doch regelmaessig laufen lassen will: Dieses Skript ist der richtige
 * Ort dafuer. Es braucht nur eine Stelle, die alle 30 Tage `node
 * scripts/instagram-token.mjs` startet und die Ausgabe an jemanden schickt.
 *
 * Der Schluessel gilt 60 Tage, erneuern laesst er sich ab dem zweiten Tag.
 * Wer alle 30 Tage laeuft, hat also nach jedem Fehlschlag noch einen ganzen
 * Monat Luft.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const WURZEL = process.cwd();

/** .env.local lesen, ohne eine Abhaengigkeit dafuer zu holen. */
function ausEnvDatei(name) {
  const pfad = join(WURZEL, ".env.local");
  if (!existsSync(pfad)) return null;
  for (const zeile of readFileSync(pfad, "utf8").split(/\r?\n/)) {
    const treffer = zeile.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (treffer && treffer[1] === name) {
      return treffer[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  return null;
}

const alter = process.env.INSTAGRAM_TOKEN || ausEnvDatei("INSTAGRAM_TOKEN");

if (!alter) {
  process.stderr.write(
    "\nKein INSTAGRAM_TOKEN gefunden, weder in der Umgebung noch in .env.local.\n" +
      "\nBeim allerersten Mal gibt es noch keinen zu erneuernden Schluessel.\n" +
      "Der erste kommt aus dem Meta-Dashboard:\n" +
      "  developers.facebook.com, App oeffnen, links Instagram,\n" +
      "  API-Einrichtung mit Instagram-Login, Abschnitt 2, Token generieren.\n\n"
  );
  process.exit(1);
}

const BASIS = "https://graph.instagram.com";
const adresse =
  `${BASIS}/refresh_access_token` +
  `?grant_type=ig_refresh_token&access_token=${encodeURIComponent(alter)}`;

/*
 * EIGENER AbortController STATT AbortSignal.timeout(), und kein process.exit
 * mehr nach dem Abruf. Der Grund steht schon in der Projektnotiz vom
 * 09.09.2026, und ich bin beim Bauen prompt wieder hineingelaufen:
 * AbortSignal.timeout() laesst seinen Timer offen. Trifft danach ein
 * process.exit() ein, bricht Node mit
 *   "Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)"
 * und Rueckgabewert 127 ab, mitten in der ordentlichen Fehlermeldung. Wer das
 * in einem Cron sieht, sucht den Fehler bei Meta statt hier.
 *
 * clearTimeout raeumt den Timer weg, process.exitCode setzt den Rueckgabewert,
 * ohne den Ablauf abzuschneiden.
 */
const abbruch = new AbortController();
const wecker = setTimeout(() => abbruch.abort(), 10_000);

let antwort;
try {
  antwort = await fetch(adresse, { signal: abbruch.signal });
} catch (fehler) {
  clearTimeout(wecker);
  process.stderr.write(`\nMeta war nicht erreichbar: ${fehler.message}\n\n`);
  process.exitCode = 1;
}
clearTimeout(wecker);
if (!antwort) process.exit(1);

const daten = await antwort.json().catch(() => ({}));

if (!antwort.ok || !daten.access_token) {
  const grund = daten?.error?.message ?? `HTTP ${antwort.status}`;
  process.stderr.write(
    `\nMeta hat die Erneuerung abgelehnt: ${grund}\n\n` +
      "Die haeufigsten Gruende:\n" +
      "  - Der Schluessel ist abgelaufen. Dann hilft kein Erneuern mehr,\n" +
      "    es braucht einen neuen aus dem Meta-Dashboard.\n" +
      "  - Der Schluessel ist noch keine 24 Stunden alt. Morgen nochmal.\n" +
      "  - Das Instagram-Konto ist kein Profikonto mehr.\n\n"
  );
  process.exitCode = 1;
} else {
  /*
   * Der Erfolgsfall gehoert in einen else-Zweig und nicht hinter den
   * Fehlerfall. process.exitCode bricht den Ablauf nicht ab, anders als
   * process.exit: Ohne das else haette das Skript nach der Fehlermeldung
   * froehlich weitergemacht und "Neuer Schluessel da" ueber ein undefined
   * geschrieben.
   */
  const sekunden = daten.expires_in ?? 60 * 86_400;
  const ablauf = new Date(Date.now() + sekunden * 1000);
  const heute = new Date().toISOString().slice(0, 10);

  process.stdout.write(
    "\nNeuer Schluessel da. Er gilt bis " +
      ablauf.toISOString().slice(0, 10) +
      `, das sind ${Math.floor(sekunden / 86_400)} Tage.\n\n` +
      "Bei Vercel eintragen, Projekt sv-fisch, Settings, Environment Variables.\n" +
      "ZWEI Werte, der zweite ist kein Beiwerk: Ohne ihn kann der Waechter beim\n" +
      "Bauen nicht sagen, wie lange der Schluessel noch gilt.\n\n" +
      "  INSTAGRAM_TOKEN\n" +
      `  ${daten.access_token}\n\n` +
      "  INSTAGRAM_TOKEN_ERNEUERT_AM\n" +
      `  ${heute}\n\n` +
      "Danach einmal neu bauen lassen, sonst liest die Seite den alten Wert.\n\n"
  );
}
