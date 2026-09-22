import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getVorstand } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Jugend und Bambini",
  description:
    "Kinder- und Jugendfußball beim SV Fisch 1964 e.V. – wer Ansprechpartner ist und wie der Einstieg läuft.",
};

/*
 * Jugend und Bambini, seit dem 22.09.2026 auf einer schlanken Seite.
 *
 * WAS HIER STAND UND WARUM ES WEG IST: Bis heute gab es zwei eigene Seiten,
 * /fussball/bambini mit einem Kader und /fussball/bambini/spielplan mit einem
 * Spielplan. Beide wurden von Hand gepflegt, denn FuPa fuehrt beim SV Fisch
 * nur die erste Mannschaft. Gepflegt wurden sie nie: Auf den beiden Seiten
 * standen 27 der 64 verbliebenen Platzhalter im ganzen Projekt, mehr als auf
 * jeder anderen Seite. Ein Kader aus sechzehn Eintraegen "[Name eintragen]"
 * ist schlechter als gar keiner.
 *
 * Der Auftraggeber hat entschieden, beides herauszunehmen. Was bleibt, ist
 * das, wonach Eltern tatsaechlich suchen: an wen man sich wendet.
 *
 * WARUM UEBERHAUPT EINE SEITE und nicht nur ein Eintrag im Vorstand: "SV
 * Fisch Bambini" ist ein Suchbegriff. Wer ihn eingibt, soll irgendwo landen
 * statt auf einer Fehlerseite. Die beiden alten Adressen leiten hierher,
 * siehe next.config.ts.
 *
 * KEINE NAMEN VON KINDERN. Das ist der zweite Grund, warum hier nie wieder
 * ein Kader stehen sollte: Ein Verein, der Vor- und Nachnamen Minderjaehriger
 * offen ins Netz stellt, hat ein Problem, das groesser ist als eine leere
 * Seite.
 */

export default function JugendPage() {
  const ansprechpartner = getVorstand().find(
    (m) => m.bereich === "Jugend" && m.name.trim() !== ""
  );

  return (
    <>
      <PageHeader
        eyebrow="Fußball"
        title="Jugend und Bambini"
        description="Beim SV Fisch fängt Fußball früh an: spielerisch, ohne Ergebnisdruck und mit viel Bewegung."
      />

      <div className="container-fisch max-w-3xl py-16 sm:py-20">
        <p className="text-lg leading-relaxed text-text-leise">
          Für unsere Jüngsten steht der Spaß am Ball im Mittelpunkt. Wer
          mitmachen möchte, kommt einfach vorbei oder meldet sich vorher kurz –
          Probetraining ist jederzeit möglich und kostet nichts.
        </p>

        {ansprechpartner && (
          <div className="mt-10 border border-linie bg-flaeche-hoch p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-fisch-yellow">
              Ansprechpartner
            </p>
            <p className="mt-2 font-display text-xl font-bold text-text">
              {ansprechpartner.name}
            </p>
            <p className="text-sm text-text-leise">{ansprechpartner.rolle}</p>
            {ansprechpartner.email && (
              <a
                href={`mailto:${ansprechpartner.email}`}
                className="mt-4 inline-flex items-center gap-2 text-text underline underline-offset-4 hover:decoration-fisch-yellow"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {ansprechpartner.email}
              </a>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/verein/mitglied-werden"
            className="rounded-full bg-fisch-yellow px-5 py-2.5 text-sm font-bold text-fisch-black hover:bg-fisch-yellow-dark"
          >
            Mitglied werden
          </Link>
          <Link
            href="/kontakt"
            className="rounded-full border border-text px-5 py-2.5 text-sm font-bold text-text hover:bg-fisch-black hover:text-text"
          >
            Kontakt aufnehmen
          </Link>
        </div>

        <p className="mt-10 border-t border-linie pt-6 text-sm text-text-leise">
          Trainingszeiten und Spieltermine der Jugend stehen nicht online. Sie
          ändern sich zu oft, und eine veraltete Zeit auf einer Website ist
          schlechter als keine. Ein kurzer Anruf oder eine Mail an{" "}
          <a
            href={`mailto:${ansprechpartner?.email ?? siteConfig.contact.email}`}
            className="underline underline-offset-4"
          >
            {ansprechpartner?.email ?? siteConfig.contact.email}
          </a>{" "}
          bringt die aktuelle Auskunft.
        </p>
      </div>
    </>
  );
}
