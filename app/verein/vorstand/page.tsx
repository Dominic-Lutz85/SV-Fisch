import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PersonCard from "@/components/PersonCard";
import { getVorstand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Vorstand",
  description:
    "Der Vorstand des SV Fisch 1964 e.V. – Ansprechpartner für Verein, Fußball, Jugend und Gymnastik.",
};

const bereiche = ["Verein", "Fußball", "Jugend", "Gymnastik"] as const;

export default function VorstandPage() {
  const vorstand = getVorstand();

  return (
    <>
      <PageHeader
        eyebrow="Der Verein"
        title="Vorstand"
        description="Diese Menschen engagieren sich ehrenamtlich für den SV Fisch – meldet euch gerne direkt bei Fragen, Ideen oder wenn ihr mitanpacken wollt."
      />
      <div className="container-fisch py-16 sm:py-20">
        {bereiche.map((bereich) => {
          const mitglieder = vorstand.filter((m) => m.bereich === bereich);
          if (mitglieder.length === 0) return null;
          return (
            <div key={bereich} className="mb-14 last:mb-0">
              <h2 className="mb-6 font-display text-2xl font-bold text-text">
                {bereich}
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {mitglieder.map((person) => (
                  <PersonCard key={`${person.name}-${person.rolle}`} person={person} />
                ))}
              </div>
            </div>
          );
        })}
        <p className="mt-4 text-sm text-text-leise">
          [BITTE PRÜFEN/ERGÄNZEN] – Namen und Kontaktdaten des aktuellen
          Vorstands in{" "}
          <code className="rounded bg-flaeche-hoch-2 px-1.5 py-0.5">
            content/vorstand.json
          </code>{" "}
          eintragen.
        </p>
      </div>
    </>
  );
}
