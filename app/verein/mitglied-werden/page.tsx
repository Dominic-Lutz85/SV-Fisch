import type { Metadata } from "next";
import { Download } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import MembershipForm from "@/components/forms/MembershipForm";

export const metadata: Metadata = {
  title: "Mitglied werden",
  description:
    "Werde Mitglied im SV Fisch 1964 e.V. – online anfragen oder die Beitrittserklärung als PDF herunterladen.",
};

export default function MitgliedWerdenPage() {
  return (
    <>
      <PageHeader
        eyebrow="Der Verein"
        title="Mitglied werden"
        description="Egal ob aktiv auf dem Platz, in der Gymnastikgruppe oder als Fördermitglied – wir freuen uns über jedes neue Gesicht."
      />
      <div className="container-fisch grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <h2 className="font-display text-2xl font-bold text-fisch-black">
            Online anfragen
          </h2>
          <p className="mt-3 text-fisch-muted">
            Am schnellsten geht es über dieses Formular – wir melden uns
            danach bei dir mit den nächsten Schritten und der offiziellen
            Beitrittserklärung.
          </p>
          <div className="mt-8">
            <MembershipForm />
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="border border-fisch-line bg-white p-6">
            <h3 className="font-display text-lg font-bold text-fisch-black">
              Lieber klassisch auf Papier?
            </h3>
            <p className="mt-2 text-sm text-fisch-muted">
              Beitrittserklärung herunterladen, ausfüllen und im
              Vereinsheim abgeben oder per Post schicken.
            </p>
            <a
              href="/downloads/beitrittserklaerung.pdf"
              download
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-fisch-black px-5 py-2.5 text-sm font-bold text-fisch-black hover:bg-fisch-black hover:text-fisch-white"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Beitrittserklärung (PDF)
            </a>
            <p className="mt-3 text-xs text-fisch-muted">
              [BITTE PRÜFEN/ERGÄNZEN] – Platzhalterdokument, vor Verwendung
              durch den Vorstand prüfen lassen.
            </p>
          </div>

          <div className="border border-fisch-line bg-white p-6">
            <h3 className="font-display text-lg font-bold text-fisch-black">
              Mitgliedsbeiträge
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-fisch-muted">
              <li>Fußball (aktiv): [BITTE PRÜFEN/ERGÄNZEN] € / Jahr</li>
              <li>Bambini: [BITTE PRÜFEN/ERGÄNZEN] € / Jahr</li>
              <li>Gymnastik: [BITTE PRÜFEN/ERGÄNZEN] € / Jahr</li>
              <li>Fördermitgliedschaft: [BITTE PRÜFEN/ERGÄNZEN] € / Jahr</li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
