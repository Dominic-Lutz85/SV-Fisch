import Link from "next/link";
import { notFound } from "next/navigation";

import Eyebrow from "@/components/Eyebrow";
import Fixtures from "@/components/Fixtures";
import TeamTableMini from "@/components/TeamTableMini";
import { getKommendeSpiele, getSpielplan, getTabelle } from "@/lib/content";
import { Grund, type GrundId } from "@/components/vorschau/GrundVarianten";

/*
 * ERKUNDUNG, KEIN PRODUKTIONSCODE.
 *
 * Der Abschnitt "Spiele und Tabelle" wortgleich mit app/page.tsx, nur der
 * Grund wechselt. Alles andere muss konstant bleiben, sonst vergleicht der
 * Umschalter zwei Sachen gleichzeitig.
 */

export const dynamic = "force-dynamic";

export default async function GrundBuehne({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { v } = await searchParams;

  const kommendeSpiele = getKommendeSpiele(getSpielplan(), 3);
  const tabelle = getTabelle();
  const id = (v ?? "ist") as GrundId;

  return (
    <>
      <style>{`
        body > footer { display: none !important; }
        body > header { display: none !important; }
        [role="dialog"] { display: none !important; }
      `}</style>

      <section className="relative overflow-hidden border-y border-linie bg-flaeche py-16 text-text sm:py-24">
        <Grund id={id} />

        {/* relative, damit der Inhalt ueber dem Grund liegt. */}
        <div className="container-fisch relative">
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
                className="rounded-full bg-fisch-yellow px-5 py-2.5 text-sm font-bold text-fisch-black hover:bg-fisch-yellow-dark"
              >
                Kompletter Spielplan
              </Link>
              <Link
                href="/fussball/tabelle"
                className="rounded-full border border-linie px-5 py-2.5 text-sm font-bold text-text hover:border-fisch-yellow hover:text-fisch-yellow"
              >
                Tabelle ansehen
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">
            <div>
              <h3 className="mb-3 font-display text-lg font-bold text-text">
                Nächste Spiele
              </h3>
              <Fixtures spiele={kommendeSpiele} compact />
            </div>
            {tabelle.length > 0 && <TeamTableMini zeilen={tabelle} />}
          </div>
        </div>
      </section>
    </>
  );
}
