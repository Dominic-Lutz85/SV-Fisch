import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PraesentiertVon from "@/components/PraesentiertVon";
import Fixtures from "@/components/Fixtures";
import { getKommendeSpiele, getVergangeneSpiele } from "@/lib/content";
import { aktuellerSpielplan } from "@/lib/fupa";

/*
 * Diese Seite zeigt, welche Spiele noch kommen. Das hängt vom heutigen Tag ab,
 * ohne revalidate würde Next sie einmal beim Bauen erzeugen und einfrieren.
 *
 * 300 Sekunden, weil die Zahlen seit dem 09.09.2026 aus der FuPa-Schnittstelle
 * kommen und die selbst s-maxage=300 vorgibt. Vorher stand hier eine Stunde,
 * mit der Begründung "reicht für einen Spielplan". Das stimmte, solange ein
 * Mensch die Datei pflegte: Zwischen Eintragen und Anzeigen lagen ohnehin
 * Tage. Jetzt ist die Stunde der langsamste Teil der Kette.
 */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Spielplan 1. Mannschaft",
  description:
    "Spielplan und Ergebnisse der 1. Mannschaft des SV Fisch 1964 e.V.",
};

/*
 * Aufbau nach dem Vorbild von Manchester City und dem FC Bayern, beide am
 * 02.09.2026 angesehen.
 *
 * Vorher standen kommende Spiele und Ergebnisse in ZWEI SPALTEN nebeneinander.
 * Beide Vorbilder trennen das stattdessen in eigene Ansichten, und der Grund
 * leuchtet ein, sobald man es misst: In zwei Spalten hat eine Paarung wie
 * "SG Wincheringen / Merzkirchen" gegen "SV Fisch 1964" keine Breite mehr, und
 * genau die braucht sie, weil bei uns beide Namen ausgeschrieben stehen und
 * keine Wappen dafür einspringen.
 *
 * Deshalb hier untereinander über die volle Breite, jeweils nach Monat
 * gruppiert, das nächste Spiel markiert.
 */
export default async function SpielplanPage() {
  const spiele = await aktuellerSpielplan();
  const kommende = getKommendeSpiele(spiele, Number.MAX_SAFE_INTEGER);
  const vergangene = getVergangeneSpiele(spiele);

  return (
    <>
      <PageHeader
        eyebrow="Fußball · 1. Mannschaft"
        title="Spielplan"
        description="Alle Termine und Ergebnisse der Saison, Heimspiele am gelben Rand zu erkennen."
        beiwerk={<PraesentiertVon className="items-start lg:items-end" />}
      />

      <div className="container-fisch mx-auto max-w-3xl py-14 sm:py-20">
        <section>
          <h2 className="mb-2 font-display text-2xl font-extrabold text-text">
            Kommende Spiele
          </h2>
          <Fixtures spiele={kommende} gruppiert erstesHervorheben />
        </section>

        {vergangene.length > 0 && (
          <section className="mt-16 border-t border-linie pt-12">
            <h2 className="mb-2 font-display text-2xl font-extrabold text-text">
              Ergebnisse
            </h2>
            <Fixtures spiele={vergangene} gruppiert />
          </section>
        )}

        {/*
          Derselbe Quellenhinweis wie auf /fussball/tabelle und
          /fussball/kader. Er steht hier nicht aus Hoeflichkeit gegenueber
          FuPa, sondern weil ein Besucher wissen soll, warum diese Seite
          stimmt, ohne dass jemand sie pflegt.
        */}
        <p className="mt-12 border-t border-linie pt-6 text-sm text-text-leise">
          Termine und Ergebnisse werden von{" "}
          <a
            href="https://www.fupa.net/team/sv-fisch-m1-2026-27"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2 hover:decoration-fisch-yellow"
          >
            FuPa
          </a>{" "}
          gepflegt und aktualisieren sich selbst.
        </p>
      </div>
    </>
  );
}
