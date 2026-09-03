import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

import { getSponsoren } from "@/lib/content";

/*
 * "Präsentiert von" mit dem Hauptsponsor, für Seitenköpfe.
 *
 * Warum hier die weiße Fassung des Logos steht und nicht die farbige von der
 * Sponsorenwand: Auf der Sponsorenwand liegt jedes Logo auf einer hellen
 * Platte, weil die Hälfte der Logos schwarze Schrift ohne Hintergrund ist.
 * Hier gibt es keine Platte, das Logo steht direkt auf dem dunklen Seitenkopf.
 * Eine helle Kachel neben einer Überschrift wäre ein Fremdkörper und würde den
 * Blick vom Seitentitel wegziehen. Tobias Weber liefert seine Marke in einer
 * weißen Fassung ohne Hintergrund, genau für diesen Fall.
 *
 * Der Sponsor wird nicht fest eingetragen, sondern aus den Daten geholt. Wer
 * den Hauptsponsor wechselt, ändert content/sponsoren.json und sonst nichts.
 * Gibt es keinen Hauptsponsor oder keine weiße Fassung, steht hier nichts,
 * statt eines kaputten Bildes.
 */

/* Die weiße Fassung heißt wie die farbige, mit "-weiss" vor der Endung. */
function weisseFassung(logo: string): string | null {
  const pfad = logo.replace(/\.(svg|png)$/, "-weiss.$1");
  return fs.existsSync(path.join(process.cwd(), "public", pfad.slice(1)))
    ? pfad
    : null;
}

/*
 * Die Maße kommen aus der weißen Datei selbst und nicht aus den Daten des
 * Sponsors. Die beiden Fassungen sind unterschiedlich beschnitten: die farbige
 * hat 9643 zu 4904, die weiße 8192 zu 3877. Das sind 1,97 gegen 2,11, und mit
 * dem falschen Verhältnis zieht der Browser das Logo in die Länge.
 */
function masse(pfad: string): { breite: number; hoehe: number } | null {
  const datei = path.join(process.cwd(), "public", pfad.slice(1));
  if (pfad.endsWith(".svg")) {
    const kopf = fs.readFileSync(datei, "utf8").slice(0, 2000);
    const vb = kopf.match(/viewBox="[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)"/);
    if (!vb) return null;
    return { breite: Math.round(+vb[1]), hoehe: Math.round(+vb[2]) };
  }
  return null;
}

export default function PraesentiertVon({
  className,
  groesse = "h-14 w-auto sm:h-20 lg:h-24",
}: {
  className?: string;
  /*
   * Die Hoehe als Klasse, weil dieselbe Marke an zwei sehr verschiedenen
   * Stellen steht: gross neben einer Seitenueberschrift, kleiner in der
   * Fussleiste des Menues. Beides sind bewusste Groessen und keine Zufaelle,
   * deshalb steht der Wert beim Aufruf und nicht hier drin.
   */
  groesse?: string;
}) {
  const haupt = getSponsoren().find((s) => s.stufe === "Hauptsponsor");
  if (!haupt) return null;

  const weiss = weisseFassung(haupt.logo);
  if (!weiss) return null;

  const bildmasse = masse(weiss) ?? { breite: haupt.breite, hoehe: haupt.hoehe };

  const inhalt = (
    <>
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-leise">
        Präsentiert von
      </span>
      <Image
        src={weiss}
        alt={`Logo ${haupt.name}`}
        width={bildmasse.breite}
        height={bildmasse.hoehe}
        /*
          Groesse an der Referenz ausgerichtet statt geschaetzt: Bei BVB stehen
          die Logos der obersten Stufe mit 215 Pixel Breite, die Stufe darunter
          mit 114. Bei 2,11 zu 1 ergeben 96 Pixel Hoehe rund 203 Pixel Breite,
          also dieselbe Groessenordnung. Der erste Versuch mit 56 Pixel Hoehe
          kam auf 118 Breite und sah neben einer Ueberschrift in 48 Pixel aus
          wie eine Fussnote.
        */
        className={groesse}
      />
      <span className="sr-only">{haupt.name}, Hauptsponsor des SV Fisch</span>
    </>
  );

  /*
   * Die Ausrichtung steht NICHT hier drin, sondern kommt von aussen. Vorher
   * war sm:items-end fest eingebaut und die Aufrufer setzten zusaetzlich ihre
   * eigene Ausrichtung. Zwei Klassen derselben Eigenschaft in einer Liste
   * entscheidet nicht die Reihenfolge im Attribut, sondern die im Stylesheet,
   * und das ist geraten statt bestimmt. Jetzt gibt es genau eine Quelle.
   */
  const klassen = `flex flex-col gap-2.5 ${className ?? "items-start"}`;

  /*
    Ohne hinterlegte Adresse ein div und kein a. Begruendung steht ausfuehrlich
    in SponsorWall.tsx: ein Anker ohne href ist kein Link, er sieht nur so aus.
  */
  if (!haupt.url || haupt.url === "#") {
    return <div className={klassen}>{inhalt}</div>;
  }

  return (
    <a
      href={haupt.url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className={`${klassen} transition-opacity hover:opacity-80`}
    >
      {inhalt}
    </a>
  );
}
