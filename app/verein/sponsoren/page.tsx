import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SponsorWall from "@/components/SponsorWall";
import Eyebrow from "@/components/Eyebrow";
import SponsorForm from "@/components/forms/SponsorForm";
import { ArrowDown } from "lucide-react";
import { getSponsoren } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sponsoren",
  description:
    "Unsere Sponsoren unterstützen den SV Fisch 1964 e.V. Werdet auch ihr Teil des Vereins.",
};

export default function SponsorenPage() {
  const sponsoren = getSponsoren();

  return (
    <>
      <PageHeader
        eyebrow="Der Verein"
        title="Sponsoren"
        description="Ohne unsere Sponsoren wäre vieles im Verein nicht möglich – von der Ausrüstung bis zum Vereinsfest. Danke für die Unterstützung!"
        beiwerk={
          /*
            Ein Anker und kein Knopf: Er fuehrt an eine Stelle derselben
            Seite, und das ist ein Link. Mit einem echten href funktioniert
            er auch ohne JavaScript, und Zurueck im Browser springt wieder
            nach oben.
          */
          <a
            href="#sponsor-werden"
            className="inline-flex items-center gap-2 rounded-full bg-fisch-yellow px-5 py-2.5 text-sm font-bold text-fisch-black hover:bg-fisch-yellow-dark"
          >
            Sponsor werden
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        }
      />
      <div className="container-fisch py-16 sm:py-20">
        <SponsorWall sponsoren={sponsoren} ebene="h2" />
      </div>

      {/*
        scroll-mt-28 wie auf der Satzungsseite: Die Kopfleiste steht fest
        oben, ohne den Abstand laege die Ueberschrift nach dem Sprung
        darunter.
      */}
      <div id="sponsor-werden" className="scroll-mt-28 bg-flaeche">
        <div className="container-fisch grid gap-10 border-t border-linie py-16 sm:py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <Eyebrow className="mb-2">Mitmachen</Eyebrow>
            <h2 className="mt-1 font-display text-3xl font-bold text-text">
              Sponsor werden
            </h2>
            <p className="mt-4 text-text-leise">
              Ob Bandenwerbung, Trikotsponsoring oder einmalige Förderung –
              wir freuen uns über jede Unterstützung und finden gemeinsam das
              passende Paket für euer Unternehmen.
            </p>
          </div>
          <SponsorForm />
        </div>
      </div>
    </>
  );
}
