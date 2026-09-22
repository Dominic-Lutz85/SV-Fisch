import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Download, MapPin } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { alleTermine } from "@/lib/termine";
import { formatDatumLang, formatUhrzeit, cn } from "@/lib/utils";
import type { TerminKategorie } from "@/types/content";

export const metadata: Metadata = {
  title: "Kalender",
  description: "Alle Termine des SV Fisch 1964 e.V. – Spiele, Versammlungen und Feste.",
};

const kategorien: (TerminKategorie | "Alle")[] = [
  "Alle",
  "Fußball",
  "Gymnastik",
  "Verein",
  "Fest",
];

const kategorieFarben: Record<TerminKategorie, string> = {
  Fußball: "bg-fisch-yellow text-fisch-black",
  Gymnastik: "bg-fisch-black text-fisch-yellow",
  Verein: "bg-fisch-white text-fisch-black",
  Fest: "bg-fisch-yellow-dark text-fisch-black",
};

export default async function KalenderPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const { kategorie } = await searchParams;
  const aktive = kategorien.includes(kategorie as (typeof kategorien)[number])
    ? (kategorie as (typeof kategorien)[number])
    : "Alle";

  /*
    Vereinstermine UND Spiele, siehe lib/termine.ts. Bis zum 22.09.2026 las
    diese Seite nur content/termine.json, also die Handarbeit. Ein Kalender
    ohne die Spiele ist bei einem Fussballverein die halbe Miete verschenkt,
    und weil die sechs Handeintraege alle abgelaufen waren, stand er komplett
    leer da.
  */
  const alle = await alleTermine();

  /*
    NUR WAS BEVORSTEHT, und das war vorher anders.

    Der Kalender zeigte alles in Datumsreihenfolge, also am 22.09.2026 als
    erstes das Elfer-Turnier vom 20. Juli. Ein Kalender, der mit Vergangenem
    anfaengt, zwingt jeden erst einmal zum Scrollen, bis er findet, wonach er
    gesucht hat: was als Naechstes ansteht.

    Gemessen wird gegen MITTERNACHT des heutigen Tages und nicht gegen die
    aktuelle Uhrzeit: Ein Heimspiel um 14 Uhr soll am selben Abend noch im
    Kalender stehen, nicht um 14:01 verschwinden. Wer am Sonntagabend
    nachsieht, wo gespielt wurde, findet es sonst nicht mehr.

    Vergangenes ist damit nicht verloren: Die Spiele stehen mit Ergebnis
    unter /fussball/spielplan, und zum Turnier gibt es die Galerie.
  */
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);

  const termine = alle
    .filter((t) => new Date(t.endDatum ?? t.datum) >= heute)
    .filter((t) => aktive === "Alle" || t.kategorie === aktive);

  return (
    <>
      <PageHeader eyebrow="Vereinsleben" title="Kalender" />
      <div className="container-fisch py-16 sm:py-20">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Nach Kategorie filtern" className="flex flex-wrap gap-2">
            {kategorien.map((k) => (
              <Link
                key={k}
                href={k === "Alle" ? "/kalender" : `/kalender?kategorie=${k}`}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  aktive === k
                    ? "border-text bg-fisch-black text-text"
                    : "border-linie text-text hover:border-text"
                )}
              >
                {k}
              </Link>
            ))}
          </nav>
          <a
            href="/kalender/ical"
            className="inline-flex items-center gap-2 rounded-full border border-text px-4 py-2 text-sm font-semibold text-text hover:bg-fisch-black hover:text-text"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Alle Termine (iCal)
          </a>
        </div>

        {termine.length > 0 ? (
          <ul className="flex flex-col divide-y divide-linie">
            {termine.map((t) => (
              <li key={t.id} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-text sm:w-56">
                  <CalendarDays className="h-4 w-4 text-text-leise" aria-hidden="true" />
                  {formatDatumLang(t.datum)}
                  {t.uhrzeit || t.datum.includes("T") ? `, ${formatUhrzeit(t.datum)} Uhr` : ""}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-bold",
                        kategorieFarben[t.kategorie]
                      )}
                    >
                      {t.kategorie}
                    </span>
                    <p className="font-semibold text-text">{t.titel}</p>
                  </div>
                  {t.ort && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-text-leise">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {t.ort}
                    </p>
                  )}
                  {t.beschreibung && (
                    <p className="mt-1 text-sm text-text-leise">{t.beschreibung}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          /*
            Der Satz sagt jetzt, WARUM nichts dasteht, und was man stattdessen
            tun kann. Vorher stand hier "Für diese Kategorie sind aktuell keine
            Termine hinterlegt", und das liest sich, als sei die Seite kaputt.
            Seit der Kalender auch nach vorn filtert, ist der haeufigste Grund
            ein anderer: Es steht schlicht nichts mehr an.
          */
          <div className="text-text-leise">
            <p>
              {aktive === "Alle"
                ? "Aktuell steht nichts an. Sobald der nächste Termin feststeht, erscheint er hier."
                : `In der Kategorie ${aktive} steht aktuell nichts an.`}
            </p>
            {aktive !== "Alle" && (
              <p className="mt-2">
                <Link href="/kalender" className="underline underline-offset-4">
                  Alle Kategorien ansehen
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
