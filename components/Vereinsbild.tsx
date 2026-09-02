import Image from "next/image";
import { ImageOff } from "lucide-react";

import { bildVorhanden } from "@/lib/content";
import { cn } from "@/lib/utils";

/*
 * Ein Bild, das sich weigert, kaputt zu sein.
 *
 * Anlass: Auf /gymnastik und /elfer-turnier stand je ein <Image> auf
 * /gallery/vereinsfeste/2.png und .../1.png. Diese Dateien gibt es nicht.
 * Sichtbar war davon fast nichts, denn hinter dem Bild liegt eine schwarze
 * Flaeche und die Seite ist selbst schwarz. Gefunden wurde es erst in der
 * Netzwerkliste: der Bilddienst von Next antwortet auf eine fehlende Datei
 * mit 400 und dem Satz, die angeforderte Quelle sei kein gueltiges Bild.
 * Lighthouse hat daraus "errors-in-console" gemacht und die Wertung fuer
 * beste Praktiken auf 96 gedrueckt.
 *
 * Warum kein Ersatzfoto aus einem anderen Album: Es gibt Bilder von der
 * Saison, aber ein Fussballfoto unter der Bildbeschreibung "Impression aus
 * der Gymnastikabteilung" waere schlicht gelogen. Lieber eine ehrliche
 * Leerstelle, die dem Verein sagt, welche Datei fehlt.
 *
 * Die Pruefung laeuft beim Bauen, nicht beim Abruf. Beide Seiten sind
 * statisch, der Ordner public liegt zu diesem Zeitpunkt vor. Dasselbe
 * Verfahren nutzt schon getGalerie in lib/content.ts.
 */

export default function Vereinsbild({
  src,
  alt,
  className,
  hinweis,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  /** Was hier stehen soll, sobald es ein Foto gibt. Steht in der Leerstelle. */
  hinweis: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (bildVorhanden(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-dashed border-linie bg-flaeche-hoch p-6 text-center">
      <ImageOff className="h-7 w-7 text-text-leise" aria-hidden="true" />
      <p className="text-xs font-bold uppercase tracking-wider text-fisch-yellow">
        Foto fehlt noch
      </p>
      <p className="max-w-[26ch] text-sm leading-relaxed text-text-leise">
        {hinweis}
      </p>
      <code className="text-[11px] text-text-leise/80">{src}</code>
    </div>
  );
}
