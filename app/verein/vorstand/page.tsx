import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PersonCard from "@/components/PersonCard";
import { getVorstand } from "@/lib/content";
import { BEREICHE } from "@/types/content";

export const metadata: Metadata = {
  title: "Vorstand",
  description:
    "Der Vorstand des SV Fisch 1964 e.V. – Ansprechpartner für Verein, Fußball, Jugend und Gymnastik.",
};

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
        {BEREICHE.map((bereich) => {
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
        {/*
          Hier stand eine Arbeitsanweisung an mich selbst: "Namen und
          Kontaktdaten in content/vorstand.json eintragen", samt Dateipfad, in
          grauer Schrift unter dem Vorstand. Sie war oeffentlich sichtbar, auf
          einer Seite, die als Arbeitsprobe dient. Die Namen stehen jetzt
          drin, also ist die Anweisung erledigt und die Zeile weg.
        */}
        <p className="mt-4 text-sm text-text-leise">
          Stand: Vorstand nach der Mitgliederversammlung. Wer sich engagieren
          moechte oder eine Frage an ein bestimmtes Amt hat, schreibt am besten
          direkt an die Adresse auf der Karte.
        </p>
      </div>
    </>
  );
}
