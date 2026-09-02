import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import NewsSlider from "@/components/NewsSlider";
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
  const news = getAllNews().slice(0, 9);
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

      {/*
        Polster von py-20/28 auf py-12/16 zurück und die Überschrift von 3xl/4xl
        auf 4xl/5xl hoch.
        
        Anlass: Zwischen dem gelben Band und dieser Überschrift standen 112
        Pixel Luft, während die Überschrift selbst mit 36 Pixeln kleiner war als
        alles andere auf der Seite, der Kopfbereich hat 60 und die Seitenköpfe
        48. Viel Abstand über einer kleinen Überschrift lässt einen Abschnitt
        gleichzeitig leer und unwichtig wirken.
      */}
      <section className="container-fisch py-12 sm:py-16">
        {news.length > 0 ? (
          <NewsSlider
            artikel={news}
            /*
              Die Schluessel an diesen drei Geschwistern sehen ueberfluessig aus,
              sie sind es aber nicht. Der Kopf wird als Eigenschaft von einer
              Serverkomponente an eine Clientkomponente gereicht und dabei ueber
              die RSC-Grenze serialisiert. Was hier als fest verdrahtetes JSX
              steht, kommt drueben als gewoehnliches Feld an, und React verlangt
              fuer Felder Schluessel. Ohne sie warnt die Konsole bei jedem
              Aufbau der Startseite.
              Nachgewiesen, nicht vermutet: mit einem blossen Text als Kopf
              verschwand die Warnung vollstaendig.
            */
            kopf={
              <div>
                <Eyebrow key="augenbraue" className="mb-2">
                  Aktuelles
                </Eyebrow>
                <h2
                  key="ueberschrift"
                  className="font-display text-4xl font-extrabold text-text sm:text-5xl"
                >
                  Neues aus dem Verein
                </h2>
                <Link
                  key="verweis"
                  href="/aktuelles"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-text underline underline-offset-4 hover:decoration-fisch-yellow"
                >
                  <span key="text">Alle Neuigkeiten</span>
                  <ArrowRight key="pfeil" className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            }
          />
        ) : (
          <p className="text-text-leise">
            Aktuell gibt es keine Meldungen. Neue Beiträge landen automatisch
            hier, sobald eine Datei in{" "}
            <code className="rounded bg-flaeche-hoch-2 px-1.5 py-0.5 text-sm">
              content/news
            </code>{" "}
            hinzugefügt wird.
          </p>
        )}
      </section>

      {/*
        Überschrift und Knöpfe stehen OBEN über der ganzen Breite, darunter
        Spiele und Tabelle nebeneinander.
        
        Vorher lag die Überschrift in einer eigenen Spalte links neben den
        Kästen. Weil sie nach vier Zeilen zu Ende war, die Kästen rechts aber
        weiterliefen, blieb unten links ein großes Loch. Zwei Spalten mit sehr
        unterschiedlich hohem Inhalt nebeneinanderzustellen erzeugt das
        zuverlässig.
      */}
      <section className="border-y border-linie bg-flaeche py-16 text-text sm:py-24">
        <div className="container-fisch">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow on="dunkel">1. Mannschaft</Eyebrow>
              <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">
                Spiele und Tabelle
              </h2>
              <p className="mt-3 max-w-lg text-text-leise">
                Kreisliga B, Staffel 10 Trier-Saarburg. Der komplette Spielplan
                und die vollständige Tabelle liegen im Fußball-Bereich.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/fussball/spielplan"
                className="rounded-full bg-fisch-yellow px-5 py-2.5 text-sm font-bold text-fisch-black hover:bg-fisch-yellow-dark"
              >
                Kompletter Spielplan
              </Link>
              <Link
                href="/fussball/tabelle"
                className="rounded-full border border-linie px-5 py-2.5 text-sm font-bold text-text hover:border-fisch-yellow hover:text-fisch-yellow"
              >
                Tabelle ansehen
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">
            <div>
              <h3 className="mb-3 font-display text-lg font-bold text-text">
                Nächste Spiele
              </h3>
              <Fixtures spiele={kommendeSpiele} compact />
            </div>
            {tabelle.length > 0 && <TeamTableMini zeilen={tabelle} />}
          </div>
        </div>
      </section>

      {sponsoren.length > 0 && (
        <section className="container-fisch py-20 sm:py-28">
          <Eyebrow className="mb-2">Danke an unsere Partner</Eyebrow>
          <h2 className="mb-10 font-display text-3xl font-bold text-text sm:text-4xl">
            Sponsoren & Förderer
          </h2>
          <SponsorWall sponsoren={sponsoren} />
        </section>
      )}
    </>
  );
}
