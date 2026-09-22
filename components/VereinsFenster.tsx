import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { InstagramBeitrag } from "@/lib/instagram";
import { formatDatum } from "@/lib/utils";

/*
 * Das Bildfenster im Kopfbereich.
 *
 * WAS ES LOEST: Der Kopfbereich hatte als einziges Motiv das angeschnittene
 * Vereinswappen. Ein Wappen ist eine Marke, kein Bild; es steht ausserdem in
 * der Kopfleiste auf jeder Seite noch einmal. Union Berlin und der BVB
 * fuehren auf dem Handy beide mit einem randlosen Foto ueber etwa die halbe
 * Hoehe (gemessen am 08.09.2026). Das war bis jetzt nicht nachbaubar, weil
 * im Repo genau ein Vereinsfoto lag.
 *
 * WARUM DER RUECKFALL KEIN NOTNAGEL IST: Das feste Bild ist der Normalfall,
 * nicht die Ausnahme. Solange kein Instagram-Zugang hinterlegt ist, zeigt
 * der Kopfbereich es immer, und die Seite sieht deshalb nicht anders aus als
 * mit Zugang. Faellt Meta spaeter aus, faellt niemandem etwas auf.
 *
 * WARUM DAS BILD NICHT VON META KOMMT, auch wenn ein Beitrag da ist: Metas
 * Bildserver saehen die IP jedes Besuchers. Die Adresse zeigt deshalb auf
 * die eigene Route /api/instagram/bild/[id], die das Bild holt und unter
 * unserem Namen ausliefert. Begruendung dort.
 */

export interface FensterBild {
  /** Adresse fuer das <Image>, immer eine eigene. */
  src: string;
  alt: string;
  /** Kleine Zeile ueber dem Text. */
  dachzeile: string;
  /** Ein Satz unter dem Bild. */
  text: string;
  /** Wohin der Verweis fuehrt, wenn es einen gibt. */
  href?: string;
  /** ISO-Datum, erscheint hinter dem Text. */
  datum?: string;
}

/** Aus einem Instagram-Beitrag wird ein Fensterinhalt. */
export function ausBeitrag(beitrag: InstagramBeitrag): FensterBild {
  return {
    src: `/api/instagram/bild/${beitrag.id}`,
    /*
     * Eine ehrliche Bildbeschreibung ist hier nicht zu haben: Was auf dem
     * Foto zu sehen ist, weiss nur, wer es aufgenommen hat. Der Bildtext des
     * Beitrags ist das Naechstbeste und meistens beschreibend genug.
     */
    alt: beitrag.text
      ? `Aus dem Vereinsleben: ${beitrag.text}`
      : "Neuestes Bild aus dem Vereinsleben",
    dachzeile: "Zuletzt bei uns",
    text: beitrag.text ?? "Neues vom SV Fisch",
    href: beitrag.permalink,
    datum: beitrag.datum,
  };
}

export default function VereinsFenster({ bild }: { bild: FensterBild }) {
  const inhalt = (
    <>
      {/*
        4:3 und nicht quadratisch: Instagram liefert beides, aber ein
        quadratisches Fenster steht im Kopfbereich neben einer Textspalte wie
        ein Kasten im Weg. object-cover schneidet zu, was nicht passt.
      */}
      {/*
        3:2 unter lg, 4:3 im Fenster. Auf einem Tablet mit 768 Pixeln Breite
        laeuft das Bild ueber die volle Breite, und bei 4:3 waere es dort 576
        Pixel hoch; der Kopfbereich kam damit auf 1303. Bei 3:2 sind es 512.
        Im Fenster rechts ist die Breite ohnehin auf 24rem begrenzt, dort
        darf es hoeher sein und das Motiv bekommt mehr Platz.
      */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-flaeche-hoch lg:aspect-[4/3]">
        <Image
          src={bild.src}
          alt={bild.alt}
          fill
          priority
          sizes="(min-width: 1024px) 24rem, 100vw"
          className="object-cover"
        />
        {/*
          Nur auf dem Handy: Dort laeuft das Bild randlos in den Text hinein,
          und ohne diesen Verlauf entsteht eine harte Kante quer ueber den
          Bildschirm. Im Fenster ab lg ist die Kante gewollt.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-fisch-black to-transparent lg:hidden"
        />
      </div>

      <figcaption className="flex items-start gap-2 px-5 pt-3 lg:px-4 lg:pb-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-fisch-yellow">
            {bild.dachzeile}
          </p>
          <p className="mt-1 text-sm leading-snug text-text">
            {bild.text}
            {bild.datum && (
              <span className="text-text-leise"> · {formatDatum(bild.datum)}</span>
            )}
          </p>
        </div>
        {bild.href && (
          <ArrowUpRight
            className="mt-3 h-4 w-4 shrink-0 text-fisch-yellow"
            aria-hidden="true"
          />
        )}
      </figcaption>
    </>
  );

  /*
   * Mit Verweis wird die ganze Karte anklickbar, ohne bleibt es ein <figure>.
   * Ein <a> ohne href ist kein Verweis, es sieht nur so aus, und das steht
   * schon als Regel in CLAUDE.md bei den Sponsoren.
   */
  return (
    <figure className="-mx-5 lg:mx-0 lg:border lg:border-linie lg:bg-flaeche-hoch">
      {bild.href ? (
        <a
          href={bild.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-colors hover:bg-flaeche-hoch-2"
        >
          {inhalt}
        </a>
      ) : (
        inhalt
      )}
    </figure>
  );
}
