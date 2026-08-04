import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Satzung",
  description: "Satzung des SV Fisch 1964 e.V.",
};

const paragraphen = [
  {
    titel: "§ 1 Name, Sitz, Geschäftsjahr",
    text: `Der Verein führt den Namen "SV Fisch 1964 e.V.". Er hat seinen Sitz in [Ort eintragen] und ist im Vereinsregister des ${siteConfig.register.court} unter der Nummer ${siteConfig.register.number} eingetragen. Das Geschäftsjahr ist das Kalenderjahr.`,
  },
  {
    titel: "§ 2 Zweck des Vereins",
    text: "Der Verein fördert den Sport, insbesondere Fußball und Gymnastik, auf gemeinnütziger Grundlage. Der Satzungszweck wird verwirklicht durch die Organisation von Trainings- und Übungsbetrieb, die Teilnahme an Wettkämpfen sowie die Ausrichtung von Vereinsveranstaltungen. [BITTE PRÜFEN/ERGÄNZEN]",
  },
  {
    titel: "§ 3 Mitgliedschaft",
    text: "Mitglied kann werden, wer den Zweck des Vereins unterstützt. Die Mitgliedschaft wird durch schriftlichen Antrag beim Vorstand erworben. [BITTE PRÜFEN/ERGÄNZEN – Details zu Aufnahme, Austritt, Ausschluss]",
  },
  {
    titel: "§ 4 Beiträge",
    text: "Die Höhe der Mitgliedsbeiträge wird von der Mitgliederversammlung festgelegt. [BITTE PRÜFEN/ERGÄNZEN]",
  },
  {
    titel: "§ 5 Organe des Vereins",
    text: "Organe des Vereins sind die Mitgliederversammlung und der Vorstand. [BITTE PRÜFEN/ERGÄNZEN – Zusammensetzung, Wahlperioden, Zuständigkeiten]",
  },
  {
    titel: "§ 6 Mitgliederversammlung",
    text: "Die ordentliche Mitgliederversammlung (Jahreshauptversammlung) findet einmal jährlich statt. [BITTE PRÜFEN/ERGÄNZEN – Einberufung, Fristen, Beschlussfähigkeit]",
  },
  {
    titel: "§ 7 Vorstand",
    text: "Der Vorstand im Sinne des § 26 BGB besteht aus [BITTE PRÜFEN/ERGÄNZEN – Anzahl und Ämter]. Er wird von der Mitgliederversammlung für die Dauer von [BITTE PRÜFEN/ERGÄNZEN] Jahren gewählt.",
  },
  {
    titel: "§ 8 Auflösung des Vereins",
    text: "Über die Auflösung des Vereins entscheidet die Mitgliederversammlung mit einer Mehrheit von [BITTE PRÜFEN/ERGÄNZEN]. Bei Auflösung fällt das Vereinsvermögen an [BITTE PRÜFEN/ERGÄNZEN – gemeinnützigen Zweck benennen].",
  },
];

export default function SatzungPage() {
  return (
    <>
      <PageHeader
        eyebrow="Der Verein"
        title="Satzung"
        description="Die Vereinssatzung regelt Zweck, Struktur und Organe des SV Fisch 1964 e.V."
      />
      <div className="container-fisch max-w-3xl py-16 sm:py-20">
        <div className="mb-10 rounded-xl border border-fisch-yellow-dark bg-fisch-yellow/25 p-5 text-sm text-fisch-ink">
          <strong>[BITTE PRÜFEN/ERGÄNZEN]</strong> – Dies ist ein
          Platzhalter-Gerüst auf Basis üblicher Vereinssatzungen. Es ersetzt
          keine Rechtsberatung. Die tatsächlich gültige, von der
          Mitgliederversammlung beschlossene Satzung muss vor Veröffentlichung
          vom Vorstand eingesetzt und bei Bedarf von einer sachkundigen Stelle
          geprüft werden.
        </div>
        <div className="flex flex-col gap-8">
          {paragraphen.map((p) => (
            <section key={p.titel}>
              <h2 className="font-display text-xl font-bold text-fisch-black">
                {p.titel}
              </h2>
              <p className="mt-2 leading-relaxed text-fisch-muted">{p.text}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
