/*
 * Waechter gegen einen Instagram-Schluessel, der unbemerkt ablaeuft.
 *
 * Meta gibt nur Schluessel mit 60 Tagen Laufzeit aus. Laeuft einer ab, hoert
 * der Instagram-Abschnitt auf der Seite einfach auf zu erscheinen. Das ist
 * Absicht (besser als ein leerer Kasten), macht den Ausfall aber unsichtbar:
 * Niemand vermisst etwas, das nicht da ist. Ohne diesen Waechter faellt es
 * fruehestens auf, wenn jemand zufaellig danach sucht.
 *
 * ER MELDET, ER BLOCKIERT NICHT. Rueckgabewert immer 0, dieselbe Regel wie bei
 * pruefe-fupa.mjs: Ein Waechter, der wegen eines fremden Dienstes den Bau
 * abbricht, legt die ganze Vereinsseite lahm, obwohl nur sechs Bilder fehlen.
 *
 * Er rechnet aus INSTAGRAM_TOKEN_ERNEUERT_AM und fragt Meta NICHT. Ein Abruf
 * bei jedem Bau kostet Kontingent und haengt an einem fremden Server, und das
 * Datum genuegt: Die Laufzeit ist mit 60 Tagen fest.
 */
const LAUFZEIT_TAGE = 60;
const WARNUNG_AB_TAGEN = 14;

const schluessel = process.env.INSTAGRAM_TOKEN;
const erneuertAm = process.env.INSTAGRAM_TOKEN_ERNEUERT_AM;

/*
 * Kein Schluessel hinterlegt ist KEIN Fehler. Solange der Verein die
 * Anbindung nicht eingerichtet hat, gibt es nichts zu bewachen, und eine
 * Warnung bei jedem Bau waere nur Rauschen, das man irgendwann ueberliest.
 */
if (!schluessel) {
  process.stdout.write(
    "Instagram: kein Schluessel hinterlegt, Abschnitt bleibt aus. " +
      "Das ist kein Fehler.\n"
  );
  process.exit(0);
}

if (!erneuertAm) {
  process.stdout.write(
    "\nInstagram: Schluessel da, aber INSTAGRAM_TOKEN_ERNEUERT_AM fehlt.\n" +
      "  Damit laesst sich nicht sagen, wann er ablaeuft, und der Ausfall\n" +
      "  kommt ohne Vorwarnung. Das Datum der letzten Erneuerung als\n" +
      "  JJJJ-MM-TT bei Vercel nachtragen.\n\n"
  );
  process.exit(0);
}

const erneuert = new Date(`${erneuertAm.slice(0, 10)}T00:00:00Z`);

if (Number.isNaN(erneuert.getTime())) {
  process.stdout.write(
    `\nInstagram: INSTAGRAM_TOKEN_ERNEUERT_AM ist kein Datum ("${erneuertAm}").\n` +
      "  Erwartet wird JJJJ-MM-TT, also zum Beispiel 2026-09-22.\n\n"
  );
  process.exit(0);
}

const ablauf = new Date(erneuert);
ablauf.setUTCDate(ablauf.getUTCDate() + LAUFZEIT_TAGE);
const tage = Math.floor((ablauf.getTime() - Date.now()) / 86_400_000);
const amTag = ablauf.toISOString().slice(0, 10);

if (tage < 0) {
  process.stdout.write(
    `\nInstagram: Schluessel ist seit ${-tage} Tagen abgelaufen (seit ${amTag}).\n` +
      "  Der Abschnitt auf der Startseite erscheint nicht mehr.\n" +
      "  Erneuern geht jetzt NICHT mehr, ein abgelaufener Schluessel laesst\n" +
      "  sich nicht verlaengern. Es braucht einen neuen aus dem Meta-\n" +
      "  Dashboard: App oeffnen, Instagram, API-Einrichtung mit\n" +
      "  Instagram-Login, Abschnitt 2, Token generieren.\n\n"
  );
} else if (tage <= WARNUNG_AB_TAGEN) {
  process.stdout.write(
    `\nInstagram: Schluessel laeuft in ${tage} Tagen ab, am ${amTag}.\n` +
      "  Jetzt erneuern, solange es noch geht:  node scripts/instagram-token.mjs\n\n"
  );
} else {
  process.stdout.write(
    `Instagram: Schluessel geprueft, noch ${tage} Tage gueltig (bis ${amTag}).\n`
  );
}

process.exit(0);
