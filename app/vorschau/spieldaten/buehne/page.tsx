import { notFound } from "next/navigation";
import Link from "next/link";

import Eyebrow from "@/components/Eyebrow";
import Fixtures from "@/components/Fixtures";
import TeamTableMini from "@/components/TeamTableMini";
import FupaWidget from "@/components/FupaWidget";
import { getSpielplan, getTabelle, getKommendeSpiele } from "@/lib/content";
import { holeSpielplan, holeTabelle } from "@/lib/fupa";
import { siteConfig } from "@/lib/config";
import type { Spiel, TabellenZeile } from "@/types/content";

/*
 * Die Buehne der Erkundung "Woher kommen die Spieldaten", 09.09.2026.
 *
 * Erkundungscode. Hier gelten die Konventionen des Repos ausdruecklich nicht
 * streng, sonst dauert das Erkunden so lange wie das Umsetzen.
 *
 * Diese Seite zeigt EINEN Abschnitt der Startseite, in einer von vier
 * Varianten, und wird vom Rahmen daneben zweimal in einem iframe geladen:
 * einmal 375 breit, einmal voll. Deshalb keine Kopf- und Fusszeile.
 */

export const dynamic = "force-dynamic";

const VARIANTEN = ["a", "b", "c", "d"] as const;
type Variante = (typeof VARIANTEN)[number];

async function datenFuer(v: Variante): Promise<{
  spiele: Spiel[];
  tabelle: TabellenZeile[];
  quelle: string;
}> {
  /*
   * B ist die Datei im Repo, also genau der heutige Zustand. Sie ist der
   * Vergleichspunkt: ohne sie waere nicht zu sehen, WAS die anderen aendern.
   */
  if (v === "b") {
    return {
      spiele: getSpielplan(),
      tabelle: getTabelle(),
      quelle: "content/spielplan.json und content/tabelle.json",
    };
  }

  /*
   * C zeichnet gar nichts selbst, dort haengt das Widget im Browser des
   * Besuchers. Die Schnittstelle hier abzufragen waere nicht nur unnoetig,
   * die Fusszeile behauptete dann auch noch, die Zahlen kaemen von dort.
   */
  if (v === "c") {
    return {
      spiele: [],
      tabelle: [],
      quelle:
        "widget-api.fupa.net, im Browser des Besuchers und erst nach Zustimmung",
    };
  }

  const [spiele, tabelle] = await Promise.all([
    holeSpielplan(siteConfig.contact.addressLines[0]),
    holeTabelle(),
  ]);

  /*
   * Der Rueckfall ist keine Zierde, sondern der Grund, warum A ueberhaupt
   * vertretbar ist: Wenn FuPa nicht antwortet, steht der Abschnitt trotzdem,
   * nur mit dem Stand aus dem Repo. Eine Vereinsseite mit leerem Spielplan
   * waere schlimmer als eine mit einer Woche altem.
   */
  return {
    spiele: spiele ?? getSpielplan(),
    tabelle: tabelle ?? getTabelle(),
    quelle: spiele && tabelle
      ? "api.fupa.net, serverseitig geholt"
      : "FuPa nicht erreichbar, Rueckfall auf die Dateien im Repo",
  };
}

export default async function Buehne({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();

  const { v } = await searchParams;
  const variante = (VARIANTEN as readonly string[]).includes(v ?? "")
    ? (v as Variante)
    : "b";

  const { spiele, tabelle, quelle } = await datenFuer(variante);
  const kommende = getKommendeSpiele(spiele, 3);

  /* C zeigt statt der eigenen Kaesten das echte Widget, im echten Rahmen. */
  const widget = variante === "c";
  /* D zeigt die eigenen Kaesten, verweist aber fuer alles Weitere aufs Widget. */
  const gemischt = variante === "d";

  return (
    <>
      {/*
        Kopfleiste, Fusszeile und Zustimmungsdialog raus.

        WARUM DAS SEIN MUSS: Die Buehne wird zweimal in einem iframe geladen.
        Ohne diese Regeln stand die gelbe Kopfleiste dreimal im Bild und der
        Zustimmungsdialog verdeckte unten die halbe Tabelle. Verglichen haette
        man dann Bildschirmrand statt Abschnitt.

        Der Dialog bleibt in Variante C stehen, denn dort IST er der Punkt:
        Ohne Zustimmung laedt das Widget nie, und genau das soll man sehen.
      */}
      <style>{`
        header, footer { display: none !important; }
        ${widget ? "" : '[role="dialog"] { display: none !important; }'}
      `}</style>
      <main
        className="bg-flaeche-hoch py-12 text-text"
        style={{ ["--color-flaeche-hoch" as string]: "#2c2c2c" }}
      >
      <div className="container-fisch">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow on="dunkel">1. Mannschaft</Eyebrow>
            <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">
              Spiele und Tabelle
            </h2>
            <p className="mt-3 max-w-lg text-text-leise">
              Kreisliga B, Staffel 10 Trier-Saarburg. Der komplette Spielplan
              und die vollständige Tabelle liegen im Fußball-Bereich.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/fussball/spielplan"
              className="rounded-full bg-fisch-yellow px-5 py-2.5 text-sm font-bold text-fisch-black"
            >
              Kompletter Spielplan
            </Link>
            <Link
              href="/fussball/tabelle"
              className="rounded-full border border-linie px-5 py-2.5 text-sm font-bold text-text"
            >
              Tabelle ansehen
            </Link>
          </div>
        </div>

        {widget ? (
          <div className="mt-10">
            <FupaWidget
              containerId="fp-widget_root-3ImOg9e9ZE7oYqJGP3IxRrUlYCt"
              beschreibung="Spielplan und Tabelle der Kreisliga B, Staffel 10"
              className="min-h-96"
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">
            <div>
              <h3 className="mb-3 font-display text-lg font-bold text-text">
                Nächste Spiele
              </h3>
              <Fixtures spiele={kommende} compact />
            </div>
            {tabelle.length > 0 && <TeamTableMini zeilen={tabelle} />}
          </div>
        )}

        {gemischt && (
          <p className="mt-6 border-l-2 border-fisch-yellow pl-4 text-sm text-text-leise">
            In Variante D bleiben die Unterseiten Tabelle, Spielplan und
            Liveticker beim eingebetteten FuPa-Widget. Nur dieser Abschnitt
            hier zeichnet selbst.
          </p>
        )}

        {/* Nur in der Erkundung sichtbar: woher die Zahlen gerade stammen. */}
        <p className="mt-8 border-t border-linie pt-4 font-mono text-xs text-text-leise">
          Variante {variante.toUpperCase()} · Quelle: {quelle} ·{" "}
          {widget
            ? "das Widget zaehlt selbst"
            : tabelle.length > 0
              ? `Tabelle nach ${tabelle[0].spiele} Spielen`
              : "keine Tabelle"}
        </p>
        </div>
      </main>
    </>
  );
}
