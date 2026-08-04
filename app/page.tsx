import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import NewsCard from "@/components/NewsCard";
import StatsRow from "@/components/StatsRow";
import SponsorWall from "@/components/SponsorWall";
import Fixtures from "@/components/Fixtures";
import {
  getAllNews,
  getSponsoren,
  getSpielplan,
  getKommendeSpiele,
  getNaechsterTermin,
} from "@/lib/content";

export default function Home() {
  const news = getAllNews().slice(0, 3);
  const sponsoren = getSponsoren();
  const kommendeSpiele = getKommendeSpiele(getSpielplan(), 3);
  const naechsterTermin = getNaechsterTermin();

  return (
    <>
      <Hero naechsterTermin={naechsterTermin} />

      <section className="container-fisch -mt-14 relative z-10 sm:-mt-20">
        <StatsRow />
      </section>

      <section className="container-fisch py-20 sm:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-fisch-yellow-dark">
              Aktuelles
            </p>
            <h2 className="font-display text-3xl font-bold text-fisch-black sm:text-4xl">
              Neues aus dem Verein
            </h2>
          </div>
          <Link
            href="/aktuelles"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-fisch-black hover:text-fisch-yellow-dark"
          >
            Alle Neuigkeiten <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {news.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((artikel) => (
              <NewsCard key={artikel.slug} artikel={artikel} />
            ))}
          </div>
        ) : (
          <p className="text-fisch-muted">
            Aktuell gibt es keine Meldungen. Neue Beiträge landen automatisch
            hier, sobald eine Datei in{" "}
            <code className="rounded bg-fisch-line px-1.5 py-0.5 text-sm">
              content/news
            </code>{" "}
            hinzugefügt wird.
          </p>
        )}
      </section>

      <section className="bg-fisch-black py-20 text-fisch-white sm:py-28">
        <div className="container-fisch grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-fisch-yellow">
              1. Mannschaft
            </p>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Nächste Spiele
            </h2>
            <p className="mt-4 max-w-md text-fisch-white/70">
              Alle Termine, Ergebnisse und die aktuelle Tabelle der
              Kreisliga-Saison findet ihr im Fußball-Bereich.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/fussball/spielplan"
                className="rounded-full bg-fisch-yellow px-5 py-2.5 text-sm font-bold text-fisch-black hover:bg-fisch-yellow-dark"
              >
                Kompletter Spielplan
              </Link>
              <Link
                href="/fussball/tabelle"
                className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-bold text-fisch-white hover:border-fisch-yellow hover:text-fisch-yellow"
              >
                Tabelle ansehen
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-white/5 p-2 sm:p-4">
            <Fixtures spiele={kommendeSpiele} compact />
          </div>
        </div>
      </section>

      {sponsoren.length > 0 && (
        <section className="container-fisch py-20 sm:py-28">
          <p className="text-sm font-bold uppercase tracking-wider text-fisch-yellow-dark">
            Danke an unsere Partner
          </p>
          <h2 className="mb-10 font-display text-3xl font-bold text-fisch-black sm:text-4xl">
            Sponsoren & Förderer
          </h2>
          <SponsorWall sponsoren={sponsoren} />
        </section>
      )}
    </>
  );
}
