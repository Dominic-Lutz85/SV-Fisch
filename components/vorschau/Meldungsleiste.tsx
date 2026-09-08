import Link from "next/link";
import { AlertTriangle, Megaphone, ArrowRight } from "lucide-react";

/*
 * ERKUNDUNG, KEIN PRODUKTIONSCODE.
 *
 * DER AUSHANG. Antwort auf die Frage "wo stehen immer die wichtigen
 * Neuigkeiten, die fuer so einen kleinen Verein zaehlen".
 *
 * Was zaehlt, ist bei einem Dorfverein etwas anderes als bei einem
 * Bundesligisten, und deshalb ist die Nachrichtenliste dafuer das falsche
 * Werkzeug. Die wichtigsten Meldungen im Verein sind kurzlebig und
 * dringend:
 *
 *   "Das Spiel am Sonntag faellt aus, Platz gesperrt"
 *   "Training heute im Jakobushaus statt draussen"
 *   "Anstoss auf 15 Uhr verlegt"
 *   "Fuers Sommerfest werden noch Helfer gesucht"
 *
 * Keine davon ist ein Artikel. Sie haben kein Bild, keinen Text von drei
 * Absaetzen und niemanden, der sie schreiben will. Sie gehoeren an einen
 * Aushang, so wie am Sportplatz der Kasten neben der Tuer.
 *
 * DREI EIGENSCHAFTEN, die diesen Aushang von der Nachrichtenliste trennen:
 *
 * 1. Er steht GANZ OBEN, ueber dem Kopfbereich. Wer die Seite oeffnet, um
 *    zu erfahren ob gespielt wird, soll nicht scrollen muessen.
 * 2. Er verschwindet VON SELBST. Jede Meldung hat ein "bis"-Datum. Nach
 *    dem Spieltag ist die Absage weg, ohne dass jemand etwas loeschen
 *    muss. Die Lehre dazu steht schon in lib/content.ts: Ein Datum
 *    veraltet nicht, ein Haken schon. Ein Aushang, den jemand von Hand
 *    abhaengen muss, haengt im Maerz noch am Sportplatz.
 * 3. Er dreht sich NICHT. Kein Laufband, kein Wechsel alle fuenf Sekunden.
 *    Eine Meldung, die man nur zur Haelfte liest, weil sie weiterspringt,
 *    ist keine Meldung. Sind es zwei, stehen sie untereinander. Sind es
 *    mehr als zwei, stimmt etwas mit der Auswahl nicht, dann zeigt der
 *    Aushang die zwei dringendsten und verlinkt auf die Nachrichten.
 *
 * Zwei Stufen, mehr nicht:
 *
 *   dringend   Vereinsgelb, volle Flaeche. Fuer Absagen und Verlegungen,
 *              also alles, was jemanden umsonst zum Platz fahren laesst.
 *   hinweis    Dunkel mit gelber Kante links. Fuer Einladungen und
 *              Aufrufe.
 *
 * Warum nur zwei: Eine dritte Stufe wird in der Praxis nie richtig
 * gewaehlt. Die Frage "faehrt jemand umsonst hin" ist eindeutig zu
 * beantworten, "ist das mittelwichtig" nicht.
 */

export interface Meldung {
  id: string;
  stufe: "dringend" | "hinweis";
  text: string;
  /* Ab wann sie erscheint und ab wann sie von selbst wieder weg ist. */
  von: string;
  bis: string;
  link?: { text: string; ziel: string };
}

export function aktiveMeldungen(alle: Meldung[], heute: string): Meldung[] {
  return alle
    .filter((m) => m.von <= heute && m.bis >= heute)
    /* Dringendes zuerst, danach das, was zuerst ablaeuft. */
    .sort((a, b) => {
      if (a.stufe !== b.stufe) return a.stufe === "dringend" ? -1 : 1;
      return a.bis < b.bis ? -1 : 1;
    })
    .slice(0, 2);
}

export default function Meldungsleiste({ meldungen }: { meldungen: Meldung[] }) {
  if (meldungen.length === 0) return null;

  return (
    <div className="divide-y divide-fisch-black/15">
      {meldungen.map((m) => {
        const dringend = m.stufe === "dringend";
        const Symbol = dringend ? AlertTriangle : Megaphone;
        return (
          <div
            key={m.id}
            className={
              dringend
                ? "bg-fisch-yellow text-fisch-black"
                : "border-l-4 border-fisch-yellow bg-flaeche-hoch text-text"
            }
          >
            <div className="container-fisch flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
              <Symbol className="h-4 w-4 shrink-0" aria-hidden="true" />
              {/*
                Die Stufe steht als Wort da und nicht nur als Farbe. Wer die
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
                  className={[
                    "inline-flex items-center gap-1 text-sm font-bold underline underline-offset-4",
                    dringend ? "text-fisch-black" : "text-fisch-yellow",
                  ].join(" ")}
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
