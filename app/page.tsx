import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import Erfolgstreppe from "@/components/Erfolgstreppe";
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
        Die Chronik als gelbes Band, direkt unter dem Kopfbereich.

        Hier stand bis zum 08.09.2026, sie liege "direkt unter dem gelben
        Terminband und ausserhalb von container-fisch, damit die Treppe wie
        das Band ueber die volle Breite laeuft". Beides stimmte nicht mehr:
        Das Terminband war laengst dunkel und ist inzwischen ganz weg, und
        der Container liegt seit dem 07.09. in der Komponente selbst.

        Ein Kommentar, der einen aufgehobenen Zustand begruendet, ist
        schlimmer als gar keiner, weil er beim naechsten Umbau als Vorgabe
        gelesen wird. Genau das ist hier zweimal passiert. Die Begruendung
        steht vollstaendig in Erfolgstreppe.tsx, gemessen und mit Datum.

        Die Flaeche laeuft randlos ueber den Bildschirm, der Text darin
        steht im Raster. Beides ist Absicht.
      */}
      <Erfolgstreppe />

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
      <section className="container-fisch pb-12 pt-8 sm:pb-16 sm:pt-10">
        {news.length > 0 ? (
          <NewsSlider
            artikel={news}
            kopf={
              /*
                Der Schluessel gehoert an DIESES Element, nicht an seine
                Kinder. Hier standen Schluessel an Eyebrow, h2 und Link,
                mit einer ausfuehrlichen Begruendung zur RSC-Grenze, und
                die Warnung blieb trotzdem bei jedem Aufbau der Startseite
                stehen: "Each child in a list should have a unique key
                prop. Check the render method of NewsSlider. It was passed
                a child from Home."
                
                Der Satz sagt schon, wo es klemmt. Nicht die Kinder des
                Kopfes landen in einer Liste, sondern der Kopf selbst,
                naemlich in NewsSlider neben den beiden Pfeilknoepfen.
                Ein Schluessel an den Kindern kann daran nichts aendern.
              */
              <div key="slider-kopf">
                <Eyebrow className="mb-2">
                  Aktuelles
                </Eyebrow>
                <h2
                  className="font-display text-4xl font-extrabold text-text sm:text-5xl"
                >
                  Neues aus dem Verein
                </h2>
                <Link
                  href="/aktuelles"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-text underline underline-offset-4 hover:decoration-fisch-yellow"
                >
                  <span>Alle Neuigkeiten</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
          <Eyebrow className="mb-2">Danke an unsere Sponsoren</Eyebrow>
          <h2 className="mb-10 font-display text-3xl font-bold text-text sm:text-4xl">
            Sponsoren
          </h2>
          <SponsorWall sponsoren={sponsoren} />
        </section>
      )}
    </>
  );
}
