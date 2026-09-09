/*
 * Waechter fuer die FuPa-Schnittstelle.
 *
 * Seit dem 09.09.2026 holt die Seite Spielplan und Tabelle von
 * api.fupa.net (siehe lib/fupa.ts). Diese Adresse betreibt FuPa fuer sein
 * eigenes Einbettungs-Widget. Sie ist nicht als Schnittstelle dokumentiert,
 * also kann sie sich aendern, ohne dass jemand Bescheid sagt.
 *
 * WARUM DIESER WAECHTER NICHT ABBRICHT, und das ist der wichtigste Satz hier:
 *
 * Am 08.09.2026 hat ein eigener Waechter im prebuild acht Commits lang jeden
 * Build abgebrochen, und der Verdacht fiel tagelang auf das Vercel-Kontingent.
 * Ein Waechter, der wegen eines FREMDEN Servers abbricht, waere derselbe
 * Fehler in schlimmer: Dann legt ein Ausfall bei FuPa die Vereinsseite still,
 * obwohl sie dank des Rueckfalls in lib/fupa.ts voellig in Ordnung
 * weiterlaeuft. Deshalb: melden, nicht blockieren. Rueckgabewert immer 0.
 *
 * WAS ER PRUEFT, und warum das mehr ist als "antwortet der Server":
 *
 * Die Proben unten sind dieselben, die am 09.09.2026 von Hand gemacht wurden,
 * bevor die Zahlen ins Repo geschrieben wurden. Sie fangen den Fall ab, vor
 * dem eine blosse Erreichbarkeitspruefung blind ist: FuPa antwortet mit 200,
 * hat aber die Struktur geaendert, und die Seite zeigt Unsinn statt gar
 * nichts. Punkte, Tordifferenz und Torsumme muessen zusammenpassen, sonst
 * stimmt an der Antwort etwas nicht.
 *
 * Geprueft wird die ROHE Antwort, nicht die Uebersetzung aus lib/fupa.ts.
 * Das ist Absicht: Die Uebersetzung hier nachzubauen hiesse, dieselbe Regel
 * ein zweites Mal zu schreiben, und zwei Fassungen laufen auseinander.
 */

const TEAM = "sv-fisch-m1";
const BASIS = `https://api.fupa.net/v1/widget/teams/${TEAM}`;

/*
 * limit=100 ist nicht schmueckend. Ohne den Parameter liefert die
 * Schnittstelle 25 Eintraege und schneidet ab, siehe die lange Begruendung
 * in lib/fupa.ts. Steht er hier nicht, prueft der Waechter etwas anderes
 * als das, was die Seite anzeigt, und genau das waere wertlos.
 */
const ADRESSE = `${BASIS}/standings?limit=100`;
const ADRESSE_SPIELE = `${BASIS}/matches?limit=100`;
const ADRESSE_KADER = `${BASIS}/squad?limit=100`;

/* Kurz genug, dass ein Build nicht daran haengt. */
const ZEITLIMIT_MS = 8000;

/* Auf stderr, damit es zwischen den Build-Ausgaben auffaellt. */
const warne = (zeile) => console.error(zeile);

async function holeJson(adresse) {
  /*
   * Eigener Controller statt AbortSignal.timeout(): Dessen Timer bleibt
   * offen, und zusammen mit process.exit() brach Node beim Aufraeumen mit
   * einer libuv-Assertion und Rueckgabewert 127 ab. Ein Waechter, der
   * ausdruecklich nicht blockieren soll, haette so den Build gestoppt.
   * Am 09.09.2026 beim ersten Probelauf gefunden, nicht im Betrieb.
   */
  const abbruch = new AbortController();
  const uhr = setTimeout(() => abbruch.abort(), ZEITLIMIT_MS);
  try {
    const roh = await fetch(adresse, {
      signal: abbruch.signal,
      headers: { "User-Agent": "sv-fisch.com build check" },
    });
    if (!roh.ok) throw new Error(`HTTP ${roh.status}`);
    return await roh.json();
  } finally {
    clearTimeout(uhr);
  }
}

function meldeAusfall(fehler) {
  warne("");
  warne("  FuPa-Schnittstelle nicht erreichbar.");
  warne(`  ${BASIS}`);
  warne(`  Grund: ${fehler.message}`);
  warne("");
  warne("  Die Seite laeuft weiter: lib/fupa.ts faellt auf");
  warne("  content/spielplan.json und content/tabelle.json zurueck.");
  warne("  Die Zahlen sind dann so alt wie diese Dateien.");
  warne("");
  warne("  Wenn das mehrmals hintereinander passiert, im Quelltext des");
  warne("  Widgets nachsehen, ob die Adresse noch stimmt:");
  warne("  https://widget-api.fupa.net/vendor/team/standings/3ISBEIR2.js");
  warne("");
}

/** Alle Proben ueber die rohe Antwort. Gibt die durchgefallenen zurueck. */
function pruefeZeilen(zeilen) {
  const name = (z) => z.team?.name?.full ?? "?";
  const proben = [];

  proben.push({
    name: "Die Antwort enthaelt eine Tabelle",
    bestanden: zeilen.length > 0,
    hinweis: "standings ist leer",
  });

  if (zeilen.length > 0) {
    const punkteFalsch = zeilen.filter((z) => 3 * z.wins + z.draws !== z.points);
    proben.push({
      name: "Punkte gleich 3 mal Siege plus Unentschieden",
      bestanden: punkteFalsch.length === 0,
      hinweis: punkteFalsch.map(name).join(", "),
    });

    const diffFalsch = zeilen.filter(
      (z) => z.ownGoals - z.againstGoals !== z.goalDifference
    );
    proben.push({
      name: "Tordifferenz passt zu den Toren",
      bestanden: diffFalsch.length === 0,
      hinweis: diffFalsch.map(name).join(", "),
    });

    /*
     * In einer vollstaendigen Liga ist jedes Tor fuer den einen ein Tor gegen
     * den anderen. Weicht das ab, fehlt eine Mannschaft oder eine Zahl ist
     * verrutscht. Diese Probe hat am 09.09.2026 als einzige bestaetigt, dass
     * die abgeschriebene Tabelle vollstaendig war.
     */
    const fuer = zeilen.reduce((s, z) => s + z.ownGoals, 0);
    const gegen = zeilen.reduce((s, z) => s + z.againstGoals, 0);
    proben.push({
      name: "Tore gesamt gehen auf beiden Seiten auf",
      bestanden: fuer === gegen,
      hinweis: `${fuer} zu ${gegen}`,
    });

    proben.push({
      name: "SV Fisch steht in der Tabelle",
      bestanden: zeilen.some((z) => name(z).includes("Fisch")),
      hinweis: "nicht gefunden",
    });
  }

  return proben;
}

/**
 * Die Spielzahl gegen die Groesse der Liga.
 *
 * In einer Liga mit N Mannschaften spielt jede (N-1) mal hin und (N-1) mal
 * zurueck. Bei 14 Mannschaften sind das 26 Spiele. Diese Probe gibt es, weil
 * am 09.09.2026 genau hier etwas durchgerutscht ist: Die Schnittstelle
 * lieferte ohne limit=100 nur 21 Ligaspiele, die letzten vier Spieltage
 * fehlten auf der Seite, und der Build meldete trotzdem alles gruen. Eine
 * Pruefung, die nur die Tabelle ansieht, ist an dieser Stelle blind.
 */
function pruefeSpiele(spiele, mannschaften) {
  const liga = spiele.filter((m) => m.category === "league");
  const erwartet = (mannschaften - 1) * 2;
  return {
    name: `Ligaspiele vollstaendig (${erwartet} bei ${mannschaften} Mannschaften)`,
    bestanden: liga.length === erwartet,
    hinweis: `${liga.length} angekommen, letztes am ${
      liga.length ? liga[liga.length - 1].kickoff.slice(0, 10) : "-"
    }`,
  };
}

let antwort;
try {
  antwort = await holeJson(ADRESSE);
} catch (fehler) {
  meldeAusfall(fehler);
  /*
   * Kein process.exit: Das Skript endet von selbst mit 0, sobald nichts mehr
   * laeuft. Genau das soll es hier auch, ein Ausfall bei FuPa darf den Build
   * nicht stoppen.
   */
  antwort = null;
}

if (antwort) {
  const zeilen = antwort.standings ?? [];
  const proben = pruefeZeilen(zeilen);

  /*
   * Der Spielplan wird nur geprueft, wenn die Tabelle steht: Ohne die Zahl
   * der Mannschaften gibt es keine Erwartung, gegen die man zaehlen koennte.
   */
  if (zeilen.length > 0) {
    try {
      const spielDaten = await holeJson(ADRESSE_SPIELE);
      proben.push(pruefeSpiele(spielDaten?.matches ?? [], zeilen.length));
    } catch (fehler) {
      proben.push({
        name: "Spielplan abrufbar",
        bestanden: false,
        hinweis: fehler.message,
      });
    }
  }

  /*
   * Der Kader wird nur auf Vollstaendigkeit im Groben geprueft. Eine feste
   * Zahl waere falsch: Ein Verein meldet im Winter Spieler an und ab, und
   * ein Waechter, der bei 28 statt 29 Spielern anschlaegt, wird nach dem
   * zweiten Fehlalarm nicht mehr gelesen. Elf ist die Zahl, unter der eine
   * Mannschaft nicht mehr auflaufen koennte, und damit ein Wert, der nur
   * bei einem echten Fehler unterschritten wird.
   */
  try {
    const kaderDaten = await holeJson(ADRESSE_KADER);
    const spieler = (kaderDaten?.squad ?? []).reduce(
      (summe, gruppe) => summe + (gruppe.players?.length ?? 0),
      0
    );
    proben.push({
      name: "Kader mindestens elf Spieler",
      bestanden: spieler >= 11,
      hinweis: `${spieler} angekommen`,
    });
  } catch (fehler) {
    proben.push({
      name: "Kader abrufbar",
      bestanden: false,
      hinweis: fehler.message,
    });
  }

  const durchgefallen = proben.filter((p) => !p.bestanden);

  if (durchgefallen.length === 0) {
    const fisch = zeilen.find((z) =>
      (z.team?.name?.full ?? "").includes("Fisch")
    );
    console.log(
      `FuPa geprueft: ${zeilen.length} Mannschaften, ${proben.length} Proben bestanden` +
        (fisch
          ? `, SV Fisch auf Platz ${fisch.rank} nach ${fisch.matches} Spielen.`
          : ".")
    );
  } else {
    warne("");
    warne("  Die FuPa-Schnittstelle antwortet, aber die Zahlen sind nicht schluessig.");
    warne("");
    for (const p of durchgefallen) {
      warne(`    ${p.name}`);
      if (p.hinweis) warne(`      ${p.hinweis}`);
    }
    warne("");
    warne("  Das heisst meistens: FuPa hat die Struktur der Antwort geaendert.");
    warne("  lib/fupa.ts liest dann die falschen Felder, und die Seite zeigt");
    warne("  Unsinn statt gar nichts. Nachsehen, bevor das naechste Mal");
    warne("  jemand die Tabelle glaubt.");
    warne("");
  }
}
