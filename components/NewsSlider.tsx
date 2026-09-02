"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import NewsCard from "@/components/NewsCard";
import type { NewsFrontmatter } from "@/types/content";

/*
 * Nachrichten zum Schieben, mit zwei Pfeilen oben rechts.
 *
 * Bewusst OHNE Karussell-Bibliothek gebaut. Der Vorschlag dazu kam mit
 * embla-carousel-react plus zwei weiteren Paketen im Schlepptau, für eine
 * Aufgabe, die der Browser selbst beherrscht: eine Leiste mit
 * overflow-x-auto und scroll-snap. Das bringt auf dem Handy das native
 * Wischen samt Schwung mit, das eine Bibliothek erst nachbauen müsste, und
 * kostet kein zusätzliches JavaScript.
 *
 * JavaScript braucht nur die Zusatzfunktion: die beiden Pfeile und ihre
 * Abschaltung an den Enden. Fällt es aus, bleibt die Leiste trotzdem
 * scrollbar, nur ohne Knöpfe.
 *
 * Wer das später doch auf eine Bibliothek umstellt: vorher messen, was sie
 * wiegt, und prüfen, ob sie das native Wischen wirklich besser macht.
 */

export default function NewsSlider({
  artikel,
  kopf,
}: {
  artikel: NewsFrontmatter[];
  /** Überschrift und Link, stehen links neben den Pfeilen */
  kopf?: React.ReactNode;
}) {
  const leiste = useRef<HTMLUListElement>(null);
  const [kannZurueck, setKannZurueck] = useState(false);
  const [kannVor, setKannVor] = useState(false);

  const pruefen = useCallback(() => {
    const el = leiste.current;
    if (!el) return;
    // Ein Pixel Toleranz, weil Breiten in Bruchteilen von Pixeln liegen können
    // und der Vorwärtspfeil sonst am Ende nie ganz abschaltet.
    setKannZurueck(el.scrollLeft > 1);
    setKannVor(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = leiste.current;
    if (!el) return;
    pruefen();
    el.addEventListener("scroll", pruefen, { passive: true });
    const beobachter = new ResizeObserver(pruefen);
    beobachter.observe(el);
    return () => {
      el.removeEventListener("scroll", pruefen);
      beobachter.disconnect();
    };
  }, [pruefen]);

  function schieben(richtung: 1 | -1) {
    const el = leiste.current;
    if (!el) return;
    // Um eine Kartenbreite weiter, nicht um eine feste Pixelzahl: sonst
    // stimmt der Sprung auf keinem anderen Bildschirm.
    const karte = el.querySelector("li");
    const schritt = karte
      ? karte.getBoundingClientRect().width + 24
      : el.clientWidth * 0.8;
    el.scrollBy({ left: schritt * richtung, behavior: "smooth" });
  }

  if (artikel.length === 0) return null;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        {kopf}
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => schieben(-1)}
            disabled={!kannZurueck}
            aria-label="Vorherige Meldungen anzeigen"
            className="grid h-11 w-11 place-items-center rounded-full border border-fisch-black text-fisch-black transition-colors hover:bg-fisch-black hover:text-fisch-yellow disabled:cursor-not-allowed disabled:border-fisch-line disabled:text-fisch-line disabled:hover:bg-transparent"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => schieben(1)}
            disabled={!kannVor}
            aria-label="Weitere Meldungen anzeigen"
            className="grid h-11 w-11 place-items-center rounded-full border border-fisch-black text-fisch-black transition-colors hover:bg-fisch-black hover:text-fisch-yellow disabled:cursor-not-allowed disabled:border-fisch-line disabled:text-fisch-line disabled:hover:bg-transparent"
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul
        ref={leiste}
        /*
          scroll-pl-* sorgt dafür, dass eine eingerastete Karte nicht bündig am
          Rand klebt. Die negativen Ränder holen den Überlauf bis an den
          Bildschirmrand, damit die nächste Karte angeschnitten zu sehen ist und
          erkennbar wird, dass es weitergeht.
        */
        className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {artikel.map((a) => (
          <li
            key={a.slug}
            className="w-[280px] shrink-0 snap-start sm:w-[320px] lg:w-[360px]"
          >
            <NewsCard artikel={a} />
          </li>
        ))}
      </ul>
    </div>
  );
}
