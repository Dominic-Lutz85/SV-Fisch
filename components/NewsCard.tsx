import Image from "next/image";
import Link from "next/link";
import { formatDatum } from "@/lib/utils";
import type { NewsFrontmatter } from "@/types/content";

const kategorieStyles: Record<string, string> = {
  Fußball: "bg-fisch-yellow text-fisch-black",
  Gymnastik: "bg-fisch-black text-fisch-yellow",
  Verein: "bg-fisch-white text-fisch-black",
};

/*
 * Die Ueberschriftebene ist eine Eigenschaft und keine feste Entscheidung.
 *
 * Auf der Startseite steht ueber den Karten ein h2 ("Neues aus dem Verein"),
 * dort ist h3 richtig. Auf /aktuelles gibt es diese Zwischenueberschrift nicht,
 * dort folgte auf das h1 der Seite direkt ein h3, und damit war eine Ebene
 * uebersprungen. Wer sich mit einer Vorlesehilfe durch die Ueberschriften
 * hangelt, faellt bei so einer Luecke aus dem Takt.
 *
 * Gefunden hat das nicht das Auge, sondern Lighthouse auf /aktuelles: 99 statt
 * 100. Ein einziger Punkt, aber er stand fuer eine echte Huerde.
 */
export default function NewsCard({
  artikel,
  ebene: Ueberschrift = "h3",
}: {
  artikel: NewsFrontmatter;
  /** h2 auf Seiten ohne eigene Zwischenueberschrift, sonst h3 */
  ebene?: "h2" | "h3";
}) {
  return (
    <Link
      href={`/aktuelles/${artikel.slug}`}
      className="group flex flex-col overflow-hidden border border-linie bg-flaeche-hoch transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-fisch-black">
        {artikel.teaserbild && (
          <Image
            src={artikel.teaserbild}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
            kategorieStyles[artikel.kategorie] ?? kategorieStyles.Verein
          }`}
        >
          {artikel.kategorie}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <time
          dateTime={artikel.date}
          className="text-xs font-semibold uppercase tracking-wide text-text-leise"
        >
          {formatDatum(artikel.date)}
        </time>
        <Ueberschrift className="font-display text-lg font-bold leading-snug text-text group-hover:underline decoration-fisch-yellow decoration-2 underline-offset-4">
          {artikel.title}
        </Ueberschrift>
        <p className="line-clamp-3 text-sm leading-relaxed text-text-leise">
          {artikel.teaser}
        </p>
      </div>
    </Link>
  );
}
