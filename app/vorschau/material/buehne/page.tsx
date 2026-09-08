import Link from "next/link";
import { notFound } from "next/navigation";

import Erfolgstreppe from "@/components/Erfolgstreppe";
import NewsSlider from "@/components/NewsSlider";
import Eyebrow from "@/components/Eyebrow";
import Fixtures from "@/components/Fixtures";
import TeamTableMini from "@/components/TeamTableMini";
import { cn } from "@/lib/utils";
import {
  getAllNews,
  getKommendeSpiele,
  getSpielplan,
  getTabelle,
} from "@/lib/content";
import {
  MATERIALIEN,
  type MaterialId,
} from "@/components/vorschau/MaterialVarianten";

/*
 * ERKUNDUNG, KEIN PRODUKTIONSCODE.
 *
 * WARUM HIER MEHR STEHT ALS DER EINE ABSCHNITT, und das ist der wichtigste
 * Unterschied zur Erkundung von vorhin:
 *
 * Bei der Frage nach einem MOTIV reicht der Abschnitt allein, denn das Motiv
 * liegt darin. Bei der Frage nach dem MATERIAL geht das nicht. Ob eine
 * Flaeche trennt, entscheidet sich an ihren Kanten, also an dem, was darueber
 * und darunter liegt. Ein Abschnitt in Vereinsgelb sieht fuer sich prima aus
 * und ist trotzdem falsch, wenn zwei Bildschirmhoehen darueber schon ein
 * gelbes Band steht.
 *
 * Deshalb zeigt die Buehne die echte Nachbarschaft: Chronikband, Nachrichten,
 * dann der Abschnitt. Der Aufbau ist aus app/page.tsx uebernommen und
 * absichtlich doppelt. In einer Erkundung ist eine Kopie richtig, weil sie
 * nach der Entscheidung wieder verschwindet.
 */

export const dynamic = "force-dynamic";

export default async function MaterialBuehne({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { v } = await searchParams;

  const news = getAllNews().slice(0, 9);
  const kommendeSpiele = getKommendeSpiele(getSpielplan(), 3);
  const tabelle = getTabelle();
  const m = MATERIALIEN[(v ?? "ist") as MaterialId] ?? MATERIALIEN.ist;

  const inhalt = (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow on={m.hell ? "hell" : "dunkel"}>1. Mannschaft</Eyebrow>
          <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">
            Spiele und Tabelle
          </h2>
          <p
            className={cn(
              "mt-3 max-w-lg",
              m.hell ? "text-fisch-muted" : "text-text-leise"
            )}
          >
            Kreisliga B, Staffel 10 Trier-Saarburg. Der komplette Spielplan und
            die vollständige Tabelle liegen im Fußball-Bereich.
          </p>
        </div>
        {/*
          DIE KNOEPFE DREHEN MIT. Auf gelbem Grund ist ein gelber Knopf kein
          Knopf mehr, und auf Off-White verliert er seine Kante. Auf hellem
          Grund wird daraus deshalb ein schwarzer Knopf, der zweite bekommt
          eine schwarze Umrandung statt einer grauen.
        */}
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href="/fussball/spielplan"
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-bold",
              m.hell
                ? "bg-fisch-black text-fisch-white hover:bg-fisch-ink"
                : "bg-fisch-yellow text-fisch-black hover:bg-fisch-yellow-dark"
            )}
          >
            Kompletter Spielplan
          </Link>
          <Link
            href="/fussball/tabelle"
            className={cn(
              "rounded-full border px-5 py-2.5 text-sm font-bold",
              m.hell
                ? "border-fisch-black/35 text-fisch-black hover:border-fisch-black"
                : "border-linie text-text hover:border-fisch-yellow hover:text-fisch-yellow"
            )}
          >
            Tabelle ansehen
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">
        <div>
          <h3
            className={cn(
              "mb-3 font-display text-lg font-bold",
              m.hell ? "text-fisch-ink" : "text-text"
            )}
          >
            Nächste Spiele
          </h3>
          <Fixtures spiele={kommendeSpiele} compact />
        </div>
        {tabelle.length > 0 && <TeamTableMini zeilen={tabelle} />}
      </div>
    </>
  );

  return (
    <>
      <style>{`
        body > footer { display: none !important; }
        body > header { display: none !important; }
        [role="dialog"] { display: none !important; }
      `}</style>

      {/* Die Nachbarschaft oberhalb, wie auf der echten Startseite. */}
      <Erfolgstreppe />

      <section className="container-fisch pb-12 pt-8 sm:pb-16 sm:pt-10">
        {news.length > 0 && (
          <NewsSlider
            artikel={news}
            kopf={
              <div key="slider-kopf">
                <Eyebrow>Aktuelles</Eyebrow>
                <h2 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
                  Neues aus dem Verein
                </h2>
              </div>
            }
          />
        )}
      </section>

      {/* Der Abschnitt, um den es geht. */}
      {m.kasten ? (
        <section className={cn("py-16 sm:py-24", m.abschnitt)} style={m.stil}>
          <div className="container-fisch">
            {/*
              Der Kasten rueckt vom Seitenrand ab und traegt den Inhalt.
              Innenabstand grosszuegig, sonst sieht ein Kasten aus wie ein
              Rahmen um etwas, das nicht hineinpasst.
            */}
            <div className="px-6 py-10 sm:px-10 sm:py-14" style={m.kastenStil}>
              {inhalt}
            </div>
          </div>
        </section>
      ) : (
        /*
          KEIN text-text in der Grundklasse. cn() ist nur clsx und raeumt
          keine widersprechenden Tailwind-Klassen ab: text-text und
          text-fisch-ink haetten dieselbe Spezifitaet, und wer gewinnt,
          entscheidet dann die Reihenfolge im erzeugten CSS. Die Textfarbe
          gehoert deshalb ganz in die Richtung.
        */
        <section
          className={cn("py-16 sm:py-24", m.abschnitt)}
          style={m.stil}
        >
          <div className="container-fisch">{inhalt}</div>
        </section>
      )}

      {/* Etwas Schwarz danach, damit die Unterkante beurteilbar ist. */}
      <div className="h-40 bg-flaeche" />
    </>
  );
}
