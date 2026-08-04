import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SquadGrid from "@/components/SquadGrid";
import { getKader } from "@/lib/content";

export const metadata: Metadata = {
  title: "Kader 1. Mannschaft",
  description: "Der Kader der 1. Mannschaft des SV Fisch 1964 e.V.",
};

export default function KaderPage() {
  const kader = getKader();

  return (
    <>
      <PageHeader eyebrow="Fußball · 1. Mannschaft" title="Kader" />
      <div className="container-fisch py-16 sm:py-20">
        <SquadGrid spieler={kader} />
        <p className="mt-10 text-sm text-fisch-muted">
          [BITTE PRÜFEN/ERGÄNZEN] – Kader in{" "}
          <code className="rounded bg-fisch-line px-1.5 py-0.5">
            content/kader.json
          </code>{" "}
          aktuell halten.
        </p>
      </div>
    </>
  );
}
