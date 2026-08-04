import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import TeamTable from "@/components/TeamTable";
import { getTabelle } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tabelle 1. Mannschaft",
  description: "Die aktuelle Tabelle der 1. Mannschaft des SV Fisch 1964 e.V.",
};

export default function TabellePage() {
  const tabelle = getTabelle();

  return (
    <>
      <PageHeader eyebrow="Fußball · 1. Mannschaft" title="Tabelle" />
      <div className="container-fisch py-16 sm:py-20">
        <TeamTable zeilen={tabelle} />
        <p className="mt-6 text-sm text-fisch-muted">
          [BITTE PRÜFEN/ERGÄNZEN] – Tabelle in{" "}
          <code className="rounded bg-fisch-line px-1.5 py-0.5">
            content/tabelle.json
          </code>{" "}
          aktualisieren oder künftig an eine Verbands-API anbinden.
        </p>
      </div>
    </>
  );
}
