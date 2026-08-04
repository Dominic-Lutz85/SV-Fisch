import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Fixtures from "@/components/Fixtures";
import { getSpielplanBambini } from "@/lib/content";

export const metadata: Metadata = {
  title: "Spielplan Bambini",
  description: "Spielplan der Bambini-Mannschaft des SV Fisch 1964 e.V.",
};

export default function BambiniSpielplanPage() {
  const spiele = getSpielplanBambini();
  const kommende = spiele.filter((s) => !s.gespielt);
  const vergangene = [...spiele].filter((s) => s.gespielt).reverse();

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
