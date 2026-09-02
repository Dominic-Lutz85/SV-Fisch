import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getVorstand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gymnastik",
  description:
    "Die Gymnastikabteilung des SV Fisch 1964 e.V. – Bewegung, Ausgleich und Gemeinschaft für Jung und Alt.",
};

const trainingszeiten = [
  { tag: "Montag", zeit: "[BITTE PRÜFEN/ERGÄNZEN] Uhr", ort: "Jakobushaus, Turnraum" },
  { tag: "Donnerstag", zeit: "[BITTE PRÜFEN/ERGÄNZEN] Uhr", ort: "Jakobushaus, Turnraum" },
];

export default function GymnastikPage() {
  const vorstand = getVorstand();
  const leitung = vorstand.find((m) => m.bereich === "Gymnastik");

  return (
    <>
      <PageHeader
        eyebrow="Abteilung"
        title="Gymnastik"
        description="Bewegung mit Musik, viel Gemeinschaft und Freude am Sport – offen für alle Altersgruppen und Fitnesslevel."
      />

      <div className="container-fisch grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <h2 className="font-display text-2xl font-bold text-fisch-black">
            Was uns ausmacht
          </h2>
          <p className="mt-4 leading-relaxed text-fisch-muted">
            In unserer Gymnastikgruppe steht der Ausgleich zum Alltag im
            Mittelpunkt: Übungen für Kraft, Beweglichkeit und Ausdauer, immer
            mit einer guten Portion Musik und guter Laune. Neue Mitglieder
            sind jederzeit willkommen – Vorkenntnisse braucht ihr keine.
          </p>

          <h2 className="mt-10 font-display text-2xl font-bold text-fisch-black">
            Trainingszeiten
          </h2>
          <div className="mt-4 overflow-hidden border border-fisch-line">
            <table className="w-full text-sm">
              <tbody>
                {trainingszeiten.map((t) => (
                  <tr key={t.tag} className="border-b border-fisch-line last:border-0">
                    <td className="px-4 py-3 font-semibold text-fisch-black">{t.tag}</td>
                    <td className="px-4 py-3 text-fisch-muted">{t.zeit}</td>
                    <td className="px-4 py-3 text-fisch-muted">{t.ort}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/verein/mitglied-werden"
              className="rounded-full bg-fisch-yellow px-5 py-2.5 text-sm font-bold text-fisch-black hover:bg-fisch-yellow-dark"
            >
              Mitglied werden
            </Link>
            <Link
              href="/kontakt"
              className="rounded-full border border-fisch-black px-5 py-2.5 text-sm font-bold text-fisch-black hover:bg-fisch-black hover:text-fisch-white"
            >
              Fragen? Kontakt aufnehmen
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-fisch-black">
            <Image
              src="/gallery/vereinsfeste/2.png"
              alt="Impression aus der Gymnastikabteilung [Platzhalter – Datei ersetzen]"
              fill
              className="object-cover"
            />
          </div>
          {leitung && (
            <div className="border border-fisch-line bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-fisch-muted">
                Abteilungsleitung
              </p>
              <p className="mt-1 font-display font-bold text-fisch-black">{leitung.name}</p>
              {leitung.email && (
                <a
                  href={`mailto:${leitung.email}`}
                  className="mt-1 inline-block text-sm text-fisch-black underline"
                >
                  {leitung.email}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
