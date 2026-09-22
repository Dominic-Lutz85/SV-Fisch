import Link from "next/link";
import { cn } from "@/lib/utils";
import type { TabellenZeile } from "@/types/content";

/**
 * Kompakte Tabellen-Vorschau für die Startseite (dunkler Hintergrund).
 * Zeigt die Top-Plätze; steht der SV Fisch nicht darunter, wird die
 * eigene Zeile zusätzlich angehängt, damit man den Stand immer sieht.
 */
export default function TeamTableMini({ zeilen }: { zeilen: TabellenZeile[] }) {
  const topN = zeilen.slice(0, 5);
  const eigene = zeilen.find((z) => z.hervorgehoben);
  const zeigen =
    eigene && !topN.some((z) => z.platz === eigene.platz)
      ? [...topN, eigene]
      : topN;

  return (
    /*
      min-w-0 ist kein Schmuck, sondern behebt einen Querlauf.
      
      Nachgemessen am 08.09.2026 bei 390 Pixeln Bildschirmbreite: Dieser
      Kasten steht als Feld in einem Raster, das 350 Pixel breit ist. Er
      selbst war 405 breit und ragte bis x=425, die ganze Startseite liess
      sich dadurch 35 Pixel zur Seite schieben.
      
      Der Grund ist eine Eigenheit von Raster- und Flex-Feldern: Sie haben
      min-width: auto und schrumpfen deshalb NICHT unter die Breite ihres
      Inhalts. Der Inhalt hier ist eine Tabellenzeile mit vier festen
      Spalten (20, 24, 32, 28 Pixel), vier Abstaenden zu je 12 und dem
      Vereinsnamen. Bei "SG Wincheringen / Merzkirchen" verlangte sie 363
      Pixel, plus 2 mal 20 Innenabstand also 403.
      
      Der Name traegt bereits flex-1 und truncate, konnte aber nicht
      kuerzen: Solange der Kasten selbst waechst, entsteht gar kein Druck
      zu schrumpfen. Mit min-w-0 bleibt der Kasten bei 350 und truncate
      greift.
      
      DER FRUEHERE BEFUND WAR FALSCH: In der Projektnotiz stand seit dem
      07.09.2026, Ursache sei "das Nachrichten-Karussell mit fest 280 px
      breiten li". Das war eine Vermutung nach Augenschein. Gefunden wurde
      die echte Ursache, indem jedes Element der Reihe nach ausgeblendet
      und nachgemessen wurde.
    */
    <div className="min-w-0 border border-linie bg-flaeche-hoch p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-text">Tabelle</h3>
        <Link
          href="/fussball/tabelle"
          className="text-xs font-semibold text-fisch-yellow hover:underline"
        >
          Komplett ansehen
        </Link>
      </div>
      {/*
        Spiele und Tordifferenz stehen mit dabei, nicht nur die Punkte.
        Anlass: Am 02.09.2026 lagen FC Könen und SV Fisch beide bei 12 Punkten.
        Ohne Tordifferenz ist dann nicht zu erkennen, warum der eine vor dem
        anderen steht, und eine Tabelle, die ihre eigene Reihenfolge nicht
        erklärt, sieht falsch aus. Man City zeigt in seiner Tabelle dieselben
        Spalten.
      */}
      <div
        aria-hidden="true"
        className="mb-1.5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-text-leise"
      >
        <span className="w-5 shrink-0" aria-hidden="true" />
        <span className="flex-1">Team</span>
        <span className="w-6 shrink-0 text-right">Sp</span>
        <span className="w-8 shrink-0 text-right">Diff</span>
        <span className="w-7 shrink-0 text-right">Pkt</span>
      </div>
      {/*
        DIE EIGENE ZEILE WAR NICHT ZU ERKENNEN, und der Grund stand im Code,
        nicht im Auge: Die Zeile trug "font-bold text-fisch-yellow", darunter
        setzte aber JEDE Spalte ihre eigene Farbe (text-text-leise, bei den
        Punkten text-text). Die spezifischere Klasse am Kind gewinnt, also
        blieb von der Hervorhebung nichts uebrig ausser dem Fettdruck, und den
        trugen die Punkte ohnehin schon. Live nachgesehen am 22.09.2026: SV
        Fisch auf Platz 2 sah aus wie jede andere Zeile.

        VOLLE FLAECHE, KEIN DURCHSCHEINENDES GELB. Der erste Versuch nahm
        bg-fisch-yellow/20, und heraus kam derselbe Olivton, den das Projekt
        am 02.09.2026 schon einmal verworfen hat (siehe die Notiz bei
        --color-fisch-yellow-dark in globals.css): Gelb mit Deckkraft unter
        eins mischt sich mit dem dunklen Grund zu einer Farbe, die weder
        auffaellt noch nach dem Verein aussieht. Die Regel dort lautet:
        Vereinsgelb gehoert in die Flaeche oder in eine Linie, und die Schrift
        darauf ist schwarz. Genau das steht hier.

        Der Gegenvorschlag, eine neutral hellere Flaeche mit gelber Kante,
        ist gebaut und verglichen worden. Er ist ruhiger, aber in einer Liste
        aus fuenf ohnehin unterschiedlich hellen Zeilen zu leise fuer die
        Angabe, um die es geht.
      */}
      <ul className="flex flex-col divide-y divide-linie">
        {zeigen.map((zeile) => (
          <li
            key={zeile.platz}
            className={cn(
              "flex items-center gap-3 py-2.5 text-sm",
              zeile.hervorgehoben &&
                "-mx-5 bg-fisch-yellow px-5 py-2.5 font-bold sm:-mx-6 sm:px-6"
            )}
          >
            <span
              className={cn(
                "w-5 shrink-0",
                zeile.hervorgehoben ? "text-fisch-black" : "text-text-leise"
              )}
            >
              {zeile.platz}.
            </span>
            <span
              className={cn(
                "flex-1 truncate",
                zeile.hervorgehoben ? "text-fisch-black" : "text-text-leise"
              )}
            >
              {zeile.team}
            </span>
            {/*
              Die Spaltenköpfe stehen zwar darüber, sind aber nur optisch
              zugeordnet. Diese Liste ist keine echte Tabelle, also verbindet
              ein Vorleseprogramm die Zahlen mit nichts und liest "4, +10, 12".
              Deshalb trägt jede Zahl ihre eigene Beschriftung.
            */}
            <span
              className={cn(
                "w-6 shrink-0 text-right",
                zeile.hervorgehoben ? "text-fisch-black" : "text-text-leise"
              )}
              aria-label={`${zeile.spiele} Spiele`}
            >
              {zeile.spiele}
            </span>
            <span
              className={cn(
                "w-8 shrink-0 text-right",
                zeile.hervorgehoben ? "text-fisch-black" : "text-text-leise"
              )}
              aria-label={`Tordifferenz ${zeile.differenz}`}
            >
              {zeile.differenz > 0 ? `+${zeile.differenz}` : zeile.differenz}
            </span>
            <span
              className={cn(
                "w-7 shrink-0 text-right font-bold",
                zeile.hervorgehoben ? "text-fisch-black" : "text-text"
              )}
              aria-label={`${zeile.punkte} Punkte`}
            >
              {zeile.punkte}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
