import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PraesentiertVon from "@/components/PraesentiertVon";
import FupaWidget from "@/components/FupaWidget";

export const metadata: Metadata = {
  title: "Liveticker 1. Mannschaft",
  description:
    "Der Liveticker zum Spiel der 1. Mannschaft des SV Fisch 1964 e.V., Tore und Meldungen direkt vom Platz.",
};

/*
 * Eigene Seite für den Liveticker, obwohl er technisch derselbe FuPa-Baustein
 * ist wie die Tabelle und dort schon als Reiter steckt.
 *
 * Der Grund ist eine Adresse: Der Reiter im Widget hat keine, er ist ein div,
 * das FuPa per JavaScript umschaltet. Auf einen Reiter kann man niemandem
 * einen Link schicken, ihn nicht ins Menü hängen, nicht in eine Nachricht
 * kopieren und Google findet ihn auch nicht. Mit /fussball/liveticker gibt es
 * genau eine Adresse, die während eines Spiels sofort das Richtige zeigt.
 *
 * Die Seite hängt denselben Baustein ein und sagt ihm, welcher Reiter gemeint
 * ist. Wie das gemacht wird und was passiert, wenn FuPa die Beschriftung
 * ändert, steht in components/FupaWidget.tsx.
 *
 * Diese Seite ist bewusst nicht statisch zwischengespeichert: Ein Liveticker,
 * der eine Stunde alt sein darf, ist kein Liveticker.
 */
export const dynamic = "force-dynamic";

export default function LivetickerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Fußball · 1. Mannschaft"
        title="Liveticker"
        description="Tore, Karten und Meldungen zum laufenden Spiel, sobald jemand am Platz tickert."
        beiwerk={<PraesentiertVon />}
      />
      <div className="container-fisch py-16 sm:py-20">
        <FupaWidget
          containerId="fp-widget_root-3ImOg9e9ZE7oYqJGP3IxRrUlYCt"
          reiter="Liveticker"
          beschreibung="Liveticker zum Spiel der 1. Mannschaft"
          className="min-h-96"
        />
        <p className="mt-6 text-sm text-text-leise">
          Der Ticker wird von{" "}
          <a
            href="https://www.fupa.net/club/sv-fisch"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2 hover:decoration-fisch-yellow"
          >
            FuPa
          </a>{" "}
          bereitgestellt. Läuft gerade kein Spiel, steht hier die letzte Partie.
        </p>
      </div>
    </>
  );
}
