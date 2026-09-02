import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import NewsCard from "@/components/NewsCard";
import Eyebrow from "@/components/Eyebrow";
import SponsorWall from "@/components/SponsorWall";
import Fixtures from "@/components/Fixtures";
import TeamTableMini from "@/components/TeamTableMini";
import {
  getAllNews,
  getSponsoren,
  getSpielplan,
  getKommendeSpiele,
  getNaechsterTermin,
  getTabelle,
} from "@/lib/content";

/*
 * Die Startseite zeigt "Nächste Spiele" und den nächsten Termin, beides hängt
 * vom heutigen Tag ab. Ohne revalidate friert Next die Seite beim Bauen ein.
 * Siehe die Begründung in lib/content.ts.
 */
export const revalidate = 3600;

export default function Home() {
  const news = getAllNews().slice(0, 3);
  const sponsoren = getSponsoren();
  const kommendeSpiele = getKommendeSpiele(getSpielplan(), 3);
  const naechsterTermin = getNaechsterTermin();
  const tabelle = getTabelle();

  return (
    <>
      <Hero naechsterTermin={naechsterTermin} naechstesSpiel={kommendeSpiele[0]} />

      {/*
        Hier stand ein Band aus vier gleich grossen Zahlenkacheln: 1964,
        420+ Mitglieder, 3 Abteilungen, 4 Mannschaften. Es ist am 02.09.2026
        entfernt worden, aus zwei Gruenden.

        Erstens waren drei der vier Zahlen nicht belegt. Die Vereinsseite bei
        FuPa fuehrt 100 Mitglieder, eine Mannschaft und die Abteilungen
        Fussball, Gymnastik und Traumtaenzer. Welche Angabe stimmt, ist offen,
        und eine angezeigte falsche Zahl kostet mehr als eine fehlende.

        Zweitens stand die einzige gesicherte Zahl, das Gruendungsjahr, auf
        demselben Bildschirm bereits dreimal: in der Kopfleiste, in der
        Kleinueberschrift des Kopfbereichs und im Vereinsnamen.

        Wer die echten Zahlen hat: nicht dieses Band wiederbeleben, sondern
        ueberlegen, welche davon ein Besucher wirklich sucht. Vier gleich
        grosse Kacheln haben keine Rangfolge, das Auge findet keinen Einstieg.
      */}

      <section className="container-fisch py-20 sm:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow className="mb-2">Aktuelles</Eyebrow>
            <h2 className="font-display text-3xl font-bold text-fisch-black sm:text-4xl">
              Neues aus dem Verein
            </h2>
          </div>
          <Link
            href="/aktuelles"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-fisch-black hover:text-fisch-gold"
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
            <Eyebrow on="dunkel">1. Mannschaft</Eyebrow>
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
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 p-2 sm:p-4">
              <Fixtures spiele={kommendeSpiele} compact variant="dark" />
            </div>
            {tabelle.length > 0 && <TeamTableMini zeilen={tabelle} />}
          </div>
        </div>
      </section>

      {sponsoren.length > 0 && (
        <section className="container-fisch py-20 sm:py-28">
          <Eyebrow className="mb-2">Danke an unsere Partner</Eyebrow>
          <h2 className="mb-10 font-display text-3xl font-bold text-fisch-black sm:text-4xl">
            Sponsoren & Förderer
          </h2>
          <SponsorWall sponsoren={sponsoren} />
        </section>
      )}
    </>
  );
}
