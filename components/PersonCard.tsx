import { Mail, Phone, UserRound } from "lucide-react";
import type { VorstandsMitglied } from "@/types/content";

export default function PersonCard({ person }: { person: VorstandsMitglied }) {
  /*
   * EIN OFFENER POSTEN IST KEIN PLATZHALTER. In content/vorstand.json stand
   * bei der Abteilungsleitung Darts der Name "[Name eintragen]", und genau so
   * stand er auch oeffentlich auf /verein/vorstand und /darts. Auf einer
   * Seite, die als Arbeitsprobe dienen soll, liest sich das wie eine
   * Baustelle, dabei ist die Lage schlicht: Das Amt ist da, die Adresse ist
   * da, der Name steht noch nicht fest.
   *
   * Deshalb ist der Name jetzt leer, und die Karte sagt das auch. Bewusst
   * NICHT als stille Umschrift von "[Name eintragen]": Der Waechter
   * pruefe-platzhalter zaehlt diese Markierung im gebauten HTML, und eine
   * Anzeige, die sie nur versteckt, haette ihm eine gefuellte Stelle
   * vorgetaeuscht. Der Datenstand selbst ist geaendert, nicht seine Fassade.
   */
  const offen = person.name.trim() === "";
  const initialen = person.name
    .replace(/[[\]]/g, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3 border border-linie bg-flaeche-hoch p-6 text-center">
      {/*
        Bei einem offenen Posten stand hier der Rueckfall "SV" im gelben
        Kreis. Neben der Zeile "Noch nicht benannt" las sich das wie das
        Kuerzel einer Person, die S. V. heisst. Ein Umriss sagt dasselbe wie
        der Text und behauptet keinen Namen; der Kreis bleibt gedaempft,
        damit ein unbesetztes Amt nicht so laut ist wie ein besetztes.
      */}
      <div
        className={
          offen
            ? "flex h-16 w-16 items-center justify-center rounded-full border border-linie bg-flaeche-hoch-2 text-text-leise"
            : "flex h-16 w-16 items-center justify-center rounded-full bg-fisch-yellow font-display text-lg font-bold text-fisch-black"
        }
      >
        {offen ? (
          <UserRound className="h-7 w-7" aria-hidden="true" />
        ) : (
          initialen || "SV"
        )}
      </div>
      <div>
        {offen ? (
          <>
            <p className="font-display font-bold text-text">{person.rolle}</p>
            <p className="text-sm text-text-leise">Noch nicht benannt</p>
          </>
        ) : (
          <>
            <p className="font-display font-bold text-text">{person.name}</p>
            <p className="text-sm text-text-leise">{person.rolle}</p>
          </>
        )}
      </div>
      <div className="flex flex-col gap-1 text-sm">
        {person.email && (
          <a
            href={`mailto:${person.email}`}
            className="inline-flex items-center justify-center gap-1.5 text-text hover:decoration-fisch-yellow"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            {person.email}
          </a>
        )}
        {person.telefon && (
          <a
            href={`tel:${person.telefon}`}
            className="inline-flex items-center justify-center gap-1.5 text-text hover:decoration-fisch-yellow"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {person.telefon}
          </a>
        )}
      </div>
    </div>
  );
}
