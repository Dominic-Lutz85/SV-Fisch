import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SquadGrid from "@/components/SquadGrid";
import { getKaderBambini } from "@/lib/content";

export const metadata: Metadata = {
  title: "Bambini",
  description: "Die Bambini-Mannschaft des SV Fisch 1964 e.V. – der Einstieg in den Vereinsfußball.",
};

export default function BambiniPage() {
  const kader = getKaderBambini();

  return (
    <>
      <PageHeader
        eyebrow="Fußball · Bambini"
        title="Bambini-Mannschaft"
        description="Für unsere Jüngsten steht der Spaß am Ball im Mittelpunkt – spielerisch, ohne Ergebnisdruck, mit viel Bewegung."
      />
      <div className="container-fisch py-16 sm:py-20">
        <SquadGrid spieler={kader} />
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/fussball/bambini/spielplan"
            className="rounded-full bg-fisch-yellow px-5 py-2.5 text-sm font-bold text-fisch-black hover:bg-fisch-yellow-dark"
          >
            Spielplan ansehen
          </Link>
          <Link
            href="/verein/mitglied-werden"
            className="rounded-full border border-text px-5 py-2.5 text-sm font-bold text-text hover:bg-fisch-black hover:text-text"
          >
            Jetzt anmelden
          </Link>
        </div>
      </div>
    </>
  );
}
