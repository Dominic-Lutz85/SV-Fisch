import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/lib/config";
import { getVorstand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum des SV Fisch 1964 e.V.",
};

export default function ImpressumPage() {
  const vertretung = getVorstand()
    .filter((m) => m.vertretungsberechtigt && m.name)
    .map((m) => m.name)
    .join(", ");

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
            {/*
              Aus der Konfiguration und nicht hier eingetippt, obwohl die
              Anschrift sich nie aendert. Sie stand am 22.09.2026 bereits in
              siteConfig.contact.addressLines und wurde trotzdem an dieser
              Stelle als "[BITTE PRÜFEN/ERGÄNZEN]" gefuehrt: Der Platzhalter
              wartete auf eine Angabe, die drei Dateien weiter schon lag.

              Die Aufteilung [1] Strasse, [2] PLZ und Ort ist dieselbe, die
              app/layout.tsx fuer die strukturierten Daten verwendet. Index 0
              ist der Name der Spielstaette und gehoert hier nicht hin, weil
              der Vereinsname bereits darueber steht.
            */}
            {siteConfig.contact.addressLines[1]}
            <br />
            {siteConfig.contact.addressLines[2]}
          </p>
          {/*
            Belegt durch § 8 der Satzung vom 25.11.2022: "Vorstand im Sinne
            des § 26 BGB ist der geschaeftsfuehrende Vorstand. Dieser vertritt
            den Verein gerichtlich und aussergerichtlich. Je 2 Mitglieder
            gemeinsam sind vertretungsberechtigt." Dazu zaehlt die Satzung den
            Schatzmeister, der im Verein "Kassenwart" heisst.

            Hier stand bis zum 24.09.2026 ein Platzhalter mit dem Vermerk, die
            Namen stuenden nur im Registerauszug. Das war zweimal falsch: Die
            Satzung sagt sehr wohl, wer dazugehoert, und die Eintragung ins
            Vereinsregister ist deklaratorisch. Vertretungsberechtigt ist, wer
            gewaehlt wurde, nicht erst, wer eingetragen ist.

            Die Namen kommen aus content/vorstand.json, damit ein
            Vorstandswechsel das Impressum mitnimmt. Wer sie leer laufen
            laesst, faellt bei scripts/pruefe-bereiche.mjs auf.
          */}
          <p className="mt-3 leading-relaxed text-text-leise">
            Vertreten durch den geschäftsführenden Vorstand: {vertretung}. Je
            zwei Mitglieder gemeinsam sind vertretungsberechtigt (§ 8 der{" "}
            <a href="/verein/satzung#p8" className="underline">
              Vereinssatzung
            </a>
            ).
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
            E-Mail: {siteConfig.contact.email}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display text-xl font-bold text-text">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          {/*
            § 18 Abs. 2 MStV verlangt eine natuerliche Person mit Namen und
            Anschrift. Die Anschrift ist die des Vereins, nicht die der
            Person; so haelt es auch der Fussballverband Rheinland.
          */}
          <p className="mt-3 leading-relaxed text-text-leise">
            {siteConfig.mstvVerantwortlich ? (
              <>
                {siteConfig.mstvVerantwortlich}
                <br />
                {siteConfig.contact.addressLines[1]}
                <br />
                {siteConfig.contact.addressLines[2]}
              </>
            ) : (
              "[BITTE PRÜFEN/ERGÄNZEN – Name der verantwortlichen Person]"
            )}
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
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text">Haftungshinweis</h2>
          <p className="mt-3 leading-relaxed text-text-leise">
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine
            Haftung für die Inhalte externer Links. Für den Inhalt der
            verlinkten Seiten sind ausschließlich deren Betreiber
            verantwortlich.
          </p>
        </section>
      </div>
    </>
  );
}
