import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Download, MapPin } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getTermine } from "@/lib/content";
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
  Verein: "bg-fisch-white text-fisch-black border border-fisch-black",
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

  const alle = getTermine();
  const termine = alle.filter((t) => aktive === "Alle" || t.kategorie === aktive);

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
                    ? "border-fisch-black bg-fisch-black text-fisch-white"
                    : "border-fisch-line text-fisch-ink hover:border-fisch-black"
                )}
              >
                {k}
              </Link>
            ))}
          </nav>
          <a
            href="/kalender/ical"
            className="inline-flex items-center gap-2 rounded-full border border-fisch-black px-4 py-2 text-sm font-semibold text-fisch-black hover:bg-fisch-black hover:text-fisch-white"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Alle Termine (iCal)
          </a>
        </div>

        {termine.length > 0 ? (
          <ul className="flex flex-col divide-y divide-fisch-line">
            {termine.map((t) => (
              <li key={t.id} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-fisch-black sm:w-56">
                  <CalendarDays className="h-4 w-4 text-fisch-muted" aria-hidden="true" />
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
                    <p className="font-semibold text-fisch-black">{t.titel}</p>
                  </div>
                  {t.ort && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-fisch-muted">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {t.ort}
                    </p>
                  )}
                  {t.beschreibung && (
                    <p className="mt-1 text-sm text-fisch-muted">{t.beschreibung}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-fisch-muted">Für diese Kategorie sind aktuell keine Termine hinterlegt.</p>
        )}
      </div>
    </>
  );
}
