"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { useConsent, setConsent } from "@/lib/consent";

/*
 * Hülle für alles, was Daten von fremden Servern lädt: Karten, Widgets von
 * fupa.net oder fussball.de, eingebettete Videos.
 *
 * Solange niemand zugestimmt hat, steht hier ein Platzhalter und der fremde
 * Inhalt wird gar nicht erst angefordert. Wichtig ist, dass die Kinder nicht
 * nur versteckt, sondern NICHT GERENDERT werden: ein iframe mit display:none
 * lädt trotzdem, und ein Skript-Tag im HTML führt sich trotzdem aus. Verstecken
 * hilft gegen das Sehen, nicht gegen das Laden.
 *
 * Zwei Wege zum Inhalt, beide zulässig:
 *   - dauerhaft zustimmen, gilt dann für die ganze Seite
 *   - einmalig laden, gilt nur für diesen einen Baustein und diesen Besuch
 */

interface ExterneEinbettungProps {
  /** Name des Anbieters, so wie ihn ein Besucher lesen soll, z. B. "openstreetmap.org" */
  anbieter: string;
  /** Was der Inhalt ist, z. B. "Karte mit dem Weg zum Sportplatz" */
  beschreibung: string;
  /** Mindesthöhe des Platzhalters, damit die Seite beim Laden nicht springt */
  className?: string;
  children: React.ReactNode;
}

export default function ExterneEinbettung({
  anbieter,
  beschreibung,
  className,
  children,
}: ExterneEinbettungProps) {
  const consent = useConsent();
  const [einmaligGeladen, setEinmaligGeladen] = useState(false);

  if (consent === "all" || einmaligGeladen) {
    return <>{children}</>;
  }

  return (
    <div
      className={
        "flex flex-col items-start justify-center gap-4 border border-fisch-line bg-white p-6 " +
        (className ?? "")
      }
    >
      <div>
        <p className="font-semibold text-fisch-black">{beschreibung}</p>
        <p className="mt-1 text-sm text-fisch-muted">
          Dieser Inhalt wird von <strong>{anbieter}</strong> geladen. Dabei wird
          eure IP-Adresse an den Anbieter übertragen. Deshalb laden wir ihn erst,
          wenn ihr zustimmt.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setEinmaligGeladen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-fisch-yellow px-5 py-2.5 text-sm font-bold text-fisch-black transition-colors hover:bg-fisch-yellow-dark"
        >
          Einmal laden
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setConsent("all")}
          className="rounded-full border border-fisch-black px-5 py-2.5 text-sm font-semibold text-fisch-black transition-colors hover:bg-fisch-black hover:text-fisch-white"
        >
          Immer laden
        </button>
        <Link
          href="/datenschutz"
          className="text-sm font-semibold text-fisch-black underline underline-offset-2 hover:text-fisch-gold"
        >
          Datenschutz
        </Link>
      </div>
    </div>
  );
}
