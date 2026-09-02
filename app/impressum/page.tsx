import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum des SV Fisch 1964 e.V.",
};

export default function ImpressumPage() {
  return (
    <>
      <PageHeader title="Impressum" />
      <div className="container-fisch max-w-2xl py-16 sm:py-20">
        <div className="mb-10 border border-fisch-yellow-dark bg-fisch-yellow/25 p-5 text-sm text-text">
          <strong>[BITTE PRÜFEN/ERGÄNZEN]</strong> – Dieses Impressum ist ein
          rechtliches Platzhalter-Gerüst gemäß § 5 TMG / § 18 MStV. Es ersetzt
          keine Rechtsberatung. Bitte vor Veröffentlichung durch den Vorstand
          bzw. eine sachkundige Stelle prüfen und vervollständigen.
        </div>

        <section className="mb-8">
          <h2 className="font-display text-xl font-bold text-text">
            Angaben gemäß § 5 TMG
          </h2>
          <p className="mt-3 leading-relaxed text-text-leise">
            {siteConfig.name}
            <br />
            [BITTE PRÜFEN/ERGÄNZEN – Straße, Hausnummer]
            <br />
            [BITTE PRÜFEN/ERGÄNZEN – PLZ, Ort]
          </p>
          <p className="mt-3 leading-relaxed text-text-leise">
            Vertreten durch: [BITTE PRÜFEN/ERGÄNZEN – 1. Vorsitzende/r]
          </p>
          <p className="mt-3 leading-relaxed text-text-leise">
            Registergericht: {siteConfig.register.court}
            <br />
            Registernummer: {siteConfig.register.number}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display text-xl font-bold text-text">Kontakt</h2>
          <p className="mt-3 leading-relaxed text-text-leise">
            Telefon: {siteConfig.contact.phone}
            <br />
            E-Mail: {siteConfig.contact.email}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display text-xl font-bold text-text">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p className="mt-3 leading-relaxed text-text-leise">
            [BITTE PRÜFEN/ERGÄNZEN – Name und Anschrift]
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display text-xl font-bold text-text">
            EU-Streitschlichtung
          </h2>
          <p className="mt-3 leading-relaxed text-text-leise">
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind
            nicht verpflichtet und nicht bereit, an
            Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen. [BITTE
            PRÜFEN/ERGÄNZEN]
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text">Haftungshinweis</h2>
          <p className="mt-3 leading-relaxed text-text-leise">
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine
            Haftung für die Inhalte externer Links. Für den Inhalt der
            verlinkten Seiten sind ausschließlich deren Betreiber
            verantwortlich. [BITTE PRÜFEN/ERGÄNZEN]
          </p>
        </section>
      </div>
    </>
  );
}
