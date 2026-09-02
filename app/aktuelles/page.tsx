import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import NewsCard from "@/components/NewsCard";
import { getNewsByKategorie } from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Aktuelles",
  description: "Neuigkeiten aus dem SV Fisch 1964 e.V. – Fußball, Gymnastik und Vereinsleben.",
};

const kategorien = ["Alle", "Fußball", "Gymnastik", "Verein"] as const;

export default async function AktuellesPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const { kategorie } = await searchParams;
  const aktiveKategorie = kategorien.includes(kategorie as (typeof kategorien)[number])
    ? (kategorie as (typeof kategorien)[number])
    : "Alle";
  const news = getNewsByKategorie(aktiveKategorie);

  return (
    <>
      <PageHeader eyebrow="Aktuelles" title="Neuigkeiten aus dem Verein" />
      <div className="container-fisch py-16 sm:py-20">
        <nav aria-label="Nach Kategorie filtern" className="mb-10 flex flex-wrap gap-2">
          {kategorien.map((k) => (
            <Link
              key={k}
              href={k === "Alle" ? "/aktuelles" : `/aktuelles?kategorie=${k}`}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                aktiveKategorie === k
                  ? "border-text bg-fisch-black text-text"
                  : "border-linie text-text hover:border-text"
              )}
            >
              {k}
            </Link>
          ))}
        </nav>

        {news.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((artikel) => (
              <NewsCard key={artikel.slug} artikel={artikel} ebene="h2" />
            ))}
          </div>
        ) : (
          <p className="text-text-leise">
            Für diese Kategorie liegen aktuell keine Meldungen vor.
          </p>
        )}
      </div>
    </>
  );
}
