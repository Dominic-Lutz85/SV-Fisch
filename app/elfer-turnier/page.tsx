import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, MapPin, Trophy } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getTermine } from "@/lib/content";
import { formatDatumLang } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Elfer-Turnier",
  description: "Das jährliche Elfer-Turnier des SV Fisch 1964 e.V. – Anmeldung, Termin und Infos.",
};

export default function ElferTurnierPage() {
  const termin = getTermine().find((t) => t.id === "elfer-turnier-2026");

  return (
    <>
      <PageHeader
        eyebrow="Vereinsevent"
        title="Elfer-Turnier"
        description="Unser traditionelles Elfmeterturnier für Teams aus der Region – ein Nachmittag voller Spannung, Spaß und guter Stimmung."
      />

      <div className="container-fisch grid gap-14 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-fisch-black">
          <Image
            src="/gallery/vereinsfeste/1.png"
            alt="Impression vom Elfer-Turnier [Platzhalter – Datei ersetzen]"
            fill
            className="object-cover"
          />
        </div>

        <div>
          {termin && (
            <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-fisch-line bg-white p-6">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-fisch-gold" aria-hidden="true" />
                <span className="font-semibold text-fisch-black">
                  {formatDatumLang(termin.datum)}
                </span>
              </div>
              {termin.ort && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-fisch-gold" aria-hidden="true" />
                  <span className="text-fisch-muted">{termin.ort}</span>
                </div>
              )}
            </div>
          )}

          <h2 className="font-display text-2xl font-bold text-fisch-black">
            So läuft der Tag ab
          </h2>
          <ul className="mt-4 flex flex-col gap-3 text-fisch-muted">
            <li className="flex gap-3">
              <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-fisch-gold" aria-hidden="true" />
              Teams aus Vereinen und Freizeitmannschaften treten im
              K.-o.-System gegeneinander an. [BITTE PRÜFEN/ERGÄNZEN – genauer
              Modus, Teamgröße]
            </li>
            <li className="flex gap-3">
              <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-fisch-gold" aria-hidden="true" />
              Im Anschluss an das Turnier gemütlicher Ausklang mit Musik und
              Grill auf dem Sportplatz.
            </li>
          </ul>

          <h2 className="mt-10 font-display text-2xl font-bold text-fisch-black">
            Team anmelden
          </h2>
          <p className="mt-3 text-fisch-muted">
            Meldet euer Team einfach per E-Mail an{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold underline">
              {siteConfig.contact.email}
            </a>{" "}
            an – mit Teamnamen, Ansprechpartner/in und Kontaktdaten. Die
            Startgebühr sowie weitere Details erhaltet ihr nach Anmeldung.
          </p>
          <p className="mt-4 text-xs text-fisch-muted">
            [BITTE PRÜFEN/ERGÄNZEN] – Teilnahmebedingungen, Startgeld und
            Anmeldeschluss ergänzen.
          </p>
        </div>
      </div>
    </>
  );
}
