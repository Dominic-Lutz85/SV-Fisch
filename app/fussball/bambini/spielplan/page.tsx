import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Fixtures from "@/components/Fixtures";
import { getSpielplanBambini, getKommendeSpiele, getVergangeneSpiele } from "@/lib/content";

/*
 * Diese Seite zeigt, welche Spiele noch kommen. Das hängt vom heutigen Tag ab.
 * Ohne revalidate würde Next die Seite einmal beim Bauen erzeugen und dann
 * einfrieren, und weil hier von Hand deployt wird, stünde derselbe Spieltag
 * womöglich wochenlang da. Einmal pro Stunde neu bauen reicht für einen
 * Spielplan völlig.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Spielplan Bambini",
  description: "Spielplan der Bambini-Mannschaft des SV Fisch 1964 e.V.",
};

export default function BambiniSpielplanPage() {
  const spiele = getSpielplanBambini();
  const kommende = getKommendeSpiele(spiele, Number.MAX_SAFE_INTEGER);
  const vergangene = getVergangeneSpiele(spiele);

  return (
    <>
      <PageHeader eyebrow="Fußball · Bambini" title="Spielplan" />
      {/* Gleicher Aufbau wie beim Spielplan der ersten Mannschaft, siehe dort. */}
      <div className="container-fisch mx-auto max-w-3xl py-14 sm:py-20">
        <section>
          <h2 className="mb-2 font-display text-2xl font-extrabold text-text">
            Kommende Termine
          </h2>
          <Fixtures spiele={kommende} gruppiert erstesHervorheben />
        </section>

        {vergangene.length > 0 && (
          <section className="mt-16 border-t border-linie pt-12">
            <h2 className="mb-2 font-display text-2xl font-extrabold text-text">
              Bisherige Spieltage
            </h2>
            <Fixtures spiele={vergangene} gruppiert />
          </section>
        )}
      </div>
    </>
  );
}
