import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SponsorWall from "@/components/SponsorWall";
import Eyebrow from "@/components/Eyebrow";
import SponsorForm from "@/components/forms/SponsorForm";
import { getSponsoren } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sponsoren",
  description:
    "Unsere Sponsoren und Partner unterstützen den SV Fisch 1964 e.V. Werdet auch ihr Teil des Vereins.",
};

export default function SponsorenPage() {
  const sponsoren = getSponsoren();

  return (
    <>
      <PageHeader
        eyebrow="Der Verein"
        title="Sponsoren & Partner"
        description="Ohne unsere Sponsoren wäre vieles im Verein nicht möglich – von der Ausrüstung bis zum Vereinsfest. Danke für die Unterstützung!"
      />
      <div className="container-fisch py-16 sm:py-20">
        <SponsorWall sponsoren={sponsoren} />
      </div>

      <div className="bg-fisch-white">
        <div className="container-fisch grid gap-10 border-t border-fisch-line py-16 sm:py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <Eyebrow className="mb-2">Mitmachen</Eyebrow>
            <h2 className="mt-1 font-display text-3xl font-bold text-fisch-black">
              Sponsor werden
            </h2>
            <p className="mt-4 text-fisch-muted">
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
