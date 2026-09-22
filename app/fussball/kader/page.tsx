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
        {/*
          Kein Kader von FuPa: ein ehrlicher Hinweis statt einer Mannschaft
          aus Platzhaltern. Die Begruendung steht bei aktuellerKader() in
          lib/fupa.ts; kurz: Bis zum 23.09.2026 haette die Seite hier im
          Ausfall sechzehn Spieler namens "[Name eintragen]" gezeigt.

          Der Verweis auf FuPa steht IM Hinweis und nicht nur unten: Wer den
          Kader sucht und ihn hier nicht findet, soll ihn mit einem Klick
          woanders finden, statt die Seite als kaputt abzuhaken.
        */}
        {kader ? (
          <SquadGrid spieler={kader} />
        ) : (
          <div className="rounded-lg border border-linie bg-flaeche-hoch p-6">
            <p className="font-display text-lg font-bold text-text">
              Der Kader ist gerade nicht abrufbar
            </p>
            <p className="mt-2 text-sm text-text-leise">
              Die Mannschaftsliste wird bei FuPa gepflegt und von dort
              geladen. Im Moment antwortet FuPa nicht. Das legt sich
              erfahrungsgemäß von selbst; bis dahin steht der vollständige
              Kader{" "}
              <a
                href="https://www.fupa.net/team/sv-fisch-m1-2026-27"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-2 hover:decoration-fisch-yellow"
              >
                direkt bei FuPa
              </a>
              .
            </p>
          </div>
        )}
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
