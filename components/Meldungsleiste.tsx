"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { AlertTriangle, Megaphone, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Meldung } from "@/types/content";

/*
 * DER AUSHANG, seit 08.09.2026.
 *
 * Anlass: "Ich haette auch gerne eine Stelle, an der immer aktuelle wichtige
 * News direkt zu sehen sind, die wichtigsten fuer so einen kleinen Verein."
 *
 * Die Nachrichtenliste ist dafuer das falsche Werkzeug, und zwar nicht aus
 * Gestaltungsgruenden. Was bei einem Dorfverein wirklich zaehlt, ist
 * kurzlebig und dringend:
 *
 *   "Das Spiel am Sonntag faellt aus, Platz gesperrt"
 *   "Training heute im Jakobushaus statt draussen"
 *   "Anstoss auf 15 Uhr verlegt"
 *
 * Keine davon ist ein Artikel. Sie haben kein Bild, keine drei Absaetze und
 * niemanden, der sie schreiben will. Sie gehoeren an einen Aushang, so wie am
 * Sportplatz der Kasten neben der Tuer.
 *
 * DREI EIGENSCHAFTEN, die den Aushang von der Nachrichtenliste trennen:
 *
 * 1. Er steht ganz oben, ueber dem Kopfbereich, auf JEDER Seite. Eine
 *    Absage betrifft auch den, der gerade den Kader liest.
 * 2. Er verschwindet von selbst, siehe unten.
 * 3. Er dreht sich nicht. Kein Laufband, kein Wechsel alle fuenf Sekunden.
 *    Eine Meldung, die man nur zur Haelfte liest, weil sie weiterspringt,
 *    ist keine Meldung.
 *
 * WARUM DIESE DATEI EINE CLIENT-KOMPONENTE IST, und das ist der einzige
 * technisch heikle Punkt daran:
 *
 * Die Seiten sind fast alle statisch vorgebaut. Ein Aushang, der nur beim
 * Bauen gefiltert wird, haengt nach seinem Bis-Datum weiter, bis das
 * naechste Mal jemand deployt. Genau das darf nicht passieren, denn eine
 * abgelaufene Absage ist schlimmer als gar keine: Sie behauptet etwas
 * Falsches.
 *
 * Deshalb filtert der Server nach dem Stand beim Bauen, und der Browser
 * filtert nach dem Anzeigen noch einmal nach. Der Anfangszustand ist
 * deshalb genau das, was der Server geschickt hat, sonst gaebe es einen
 * Hydration-Fehler.
 *
 * Neue Meldungen erscheinen weiterhin erst beim naechsten Deploy. Das ist
 * in Ordnung: Sie kommen ohnehin nur durch eine Aenderung an
 * content/meldungen.json ins Repo, und die loest den Deploy aus.
 */

/** Heute als "JJJJ-MM-TT" in der Ortszeit des Vereins, im Browser. */
function heuteImBrowser(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/*
 * Kein useState mit useEffect, obwohl das der naheliegende Weg waere.
 *
 * Erstens verbietet die Regel react-hooks/set-state-in-effect genau das,
 * und sie hat recht: Es rendert zweimal und ist schwerer zu lesen.
 * Zweitens ist useSyncExternalStore fuer genau diesen Fall gemacht, einen
 * Wert, den nur der Browser kennt und der Server nicht kennen darf.
 *
 * Die subscribe-Funktion gibt es zwar, tut aber nichts: Das Datum aendert
 * sich waehrend eines Seitenaufrufs nicht, jedenfalls nicht so, dass es
 * jemanden stoert.
 */
const nieAendern = () => () => {};

function useHeuteImBrowser(): string | null {
  return useSyncExternalStore(nieAendern, heuteImBrowser, () => null);
}

export default function Meldungsleiste({
  meldungen,
}: {
  meldungen: Meldung[];
}) {
  const heute = useHeuteImBrowser();
  /* Vor der Hydration genau das, was der Server geschickt hat. */
  const sichtbar = heute
    ? meldungen.filter((m) => m.von <= heute && m.bis >= heute)
    : meldungen;

  if (sichtbar.length === 0) return null;

  return (
    <div className="divide-y divide-fisch-black/15">
      {sichtbar.map((m, i) => {
        const dringend = m.stufe === "dringend";
        const Symbol = dringend ? AlertTriangle : Megaphone;
        return (
          <div
            key={m.id}
            className={cn(
              dringend
                ? "bg-fisch-yellow text-fisch-black"
                : "border-l-4 border-fisch-yellow bg-flaeche-hoch text-text",
              /*
                AUF DEM HANDY NUR DIE ERSTE, und das ist nachgemessen:
                Eine Meldung ist dort 104 Pixel hoch, zwei sind 209. Bei
                844 Pixeln Bildschirmhoehe ist das ein Viertel des ersten
                Bildschirms, noch vor dem Vereinsnamen. Die Sortierung
                stellt Dringendes nach vorn, es faellt also nie das
                Wichtigere weg.
              */
              i > 0 && "hidden sm:block"
            )}
          >
            <div className="container-fisch flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
              <Symbol className="h-4 w-4 shrink-0" aria-hidden="true" />
              {/*
                Die Stufe steht als WORT da und nicht nur als Farbe. Wer die
                Seite mit einem Vorleseprogramm hoert oder Farben schlecht
                unterscheidet, bekommt sonst gar keinen Unterschied mit.
              */}
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em]">
                {dringend ? "Wichtig" : "Hinweis"}
              </span>
              <span className="text-sm font-bold">{m.text}</span>
              {m.link && (
                <Link
                  href={m.link.ziel}
                  className={cn(
                    "inline-flex items-center gap-1 text-sm font-bold underline underline-offset-4",
                    dringend ? "text-fisch-black" : "text-fisch-yellow"
                  )}
                >
                  {m.link.text}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
