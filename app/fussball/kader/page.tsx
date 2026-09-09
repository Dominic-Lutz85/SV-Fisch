import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SquadGrid from "@/components/SquadGrid";
import { aktuellerKader } from "@/lib/fupa";

export const metadata: Metadata = {
  title: "Kader 1. Mannschaft",
  description: "Der Kader der 1. Mannschaft des SV Fisch 1964 e.V.",
};

/*
 * 300 Sekunden wie auf den anderen Seiten mit FuPa-Daten: Die Schnittstelle
 * gibt in ihrer Cache-Control-Kopfzeile s-maxage=300 vor.
 */
export const revalidate = 300;

export default async function KaderPage() {
  const kader = await aktuellerKader();

  return (
    <>
      <PageHeader eyebrow="Fußball · 1. Mannschaft" title="Kader" />
      <div className="container-fisch py-16 sm:py-20">
        <SquadGrid spieler={kader} />
        {/*
          Hier stand bis zum 09.09.2026 "[BITTE PRÜFEN/ERGÄNZEN] – Kader in
          content/kader.json aktuell halten". Der Satz war nach der
          Umstellung gleich doppelt falsch: Die Datei ist nur noch der
          Rueckfall, und ein sichtbarer Platzhalter auf einer Arbeitsprobe
          ist laut CLAUDE.md ein Ausschlusskriterium. Jetzt derselbe
          Quellenhinweis wie auf /fussball/tabelle.
        */}
        <p className="mt-10 text-sm text-text-leise">
          Kader und Betreuerteam werden von{" "}
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
