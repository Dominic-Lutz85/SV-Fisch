import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import FupaWidget from "@/components/FupaWidget";

export const metadata: Metadata = {
  title: "Tabelle 1. Mannschaft",
  description: "Die aktuelle Tabelle der 1. Mannschaft des SV Fisch 1964 e.V.",
};

/*
 * Die Tabelle kommt seit dem 02.09.2026 von FuPa und nicht mehr aus
 * content/tabelle.json.
 *
 * Der Grund war nicht Bequemlichkeit, sondern ein belegter Ausfall: Die von
 * Hand gepflegte Tabelle stand seit dem 9. August auf Spieltag 1, alle
 * Mannschaften mit einem Spiel und drei Punkten. Tatsächlich waren vier
 * Spieltage gespielt und der SV Fisch stand auf Platz 2 mit 12 Punkten. Eine
 * Angabe, die von menschlicher Erinnerung abhängt, ist ab dem ersten
 * vergessenen Termin falsch, und niemand sieht es.
 *
 * FuPa wurde fussball.de vorgezogen, weil deren Widget an der Mannschaft hängt
 * und nicht an Jahr und Staffel. Bei fussball.de müsste nach jedem
 * Saisonwechsel und nach jedem Auf- oder Abstieg ein neues Widget erzeugt und
 * der Code hier ausgetauscht werden.
 *
 * WEG ZURÜCK, falls FuPa ausfällt oder das Angebot einstellt:
 * components/TeamTable.tsx und content/tabelle.json liegen weiterhin im
 * Projekt. Es genügt, hier wieder
 *     import TeamTable from "@/components/TeamTable";
 *     import { getTabelle } from "@/lib/content";
 * zu importieren und <TeamTable zeilen={getTabelle()} /> einzusetzen. Dann ist
 * aber auch die Handpflege wieder da, siehe oben.
 */

export default function TabellePage() {
  return (
    <>
      <PageHeader eyebrow="Fußball · 1. Mannschaft" title="Tabelle" />
      <div className="container-fisch py-16 sm:py-20">
        <FupaWidget
          containerId="fp-widget_root-3ImOg9e9ZE7oYqJGP3IxRrUlYCt"
          beschreibung="Aktuelle Tabelle der Kreisliga B, Staffel 10 Trier-Saarburg"
          className="min-h-96"
        />
        <p className="mt-6 text-sm text-fisch-muted">
          Die Tabelle wird von{" "}
          <a
            href="https://www.fupa.net/club/sv-fisch"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2 hover:text-fisch-gold"
          >
            FuPa
          </a>{" "}
          bereitgestellt und aktualisiert sich selbst.
        </p>
      </div>
    </>
  );
}
