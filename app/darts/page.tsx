import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getVorstand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Darts",
  description:
    "Die neue Darts-Abteilung des SV Fisch 1964 e.V. – gemeinsam üben, spielen und Turniere bestreiten.",
};

const trainingszeiten = [
  { tag: "[BITTE PRÜFEN/ERGÄNZEN]", zeit: "[BITTE PRÜFEN/ERGÄNZEN] Uhr", ort: "Jakobushaus" },
];

export default function DartsPage() {
  const vorstand = getVorstand();
  const leitung = vorstand.find((m) => m.bereich === "Darts");

  return (
    <>
      <PageHeader
        eyebrow="Abteilung · Neu"
        title="Darts"
        description="Unsere neueste Abteilung: gemeinsam werfen, üben und Spaß am Spiel haben – Anfänger:innen genauso willkommen wie erfahrene Werfer:innen."
      />

      <div className="container-fisch grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <h2 className="font-display text-2xl font-bold text-fisch-black">
            Was uns ausmacht
          </h2>
          <p className="mt-4 leading-relaxed text-fisch-muted">
            Seit Kurzem gibt es beim SV Fisch eine eigene Darts-Abteilung.
            Ob zum entspannten Feierabend-Wurf oder mit Blick auf die ersten
            Ligaspiele – bei uns ist jede und jeder willkommen, unabhängig
            vom Erfahrungslevel. [BITTE PRÜFEN/ERGÄNZEN – Näheres zur
            Abteilung, Liga-Teilnahme, Ausrüstung]
          </p>

          <h2 className="mt-10 font-display text-2xl font-bold text-fisch-black">
            Trainingszeiten
          </h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-fisch-line">
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
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-fisch-black">
            <Image
              src="/darts/uebersicht.png"
              alt="Impression aus der Darts-Abteilung [Platzhalter – Datei ersetzen]"
              fill
              className="object-cover"
            />
          </div>
          {leitung && (
            <div className="rounded-2xl border border-fisch-line bg-white p-6">
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
