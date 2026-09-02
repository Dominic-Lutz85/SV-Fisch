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
      <div className="container-fisch grid gap-14 py-16 sm:py-20 lg:grid-cols-2 lg:gap-10">
        <section>
          <h2 className="mb-4 font-display text-xl font-bold text-fisch-black">
            Kommende Termine
          </h2>
          <Fixtures spiele={kommende} />
        </section>
        <section>
          <h2 className="mb-4 font-display text-xl font-bold text-fisch-black">
            Bisherige Spieltage
          </h2>
          <Fixtures spiele={vergangene} />
        </section>
      </div>
    </>
  );
}
