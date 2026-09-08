"use client";

import { useState } from "react";
import { notFound } from "next/navigation";

/*
 * ERKUNDUNG, KEIN PRODUKTIONSCODE.
 *
 * Memo und Umschalter fuer die Frage "was liegt hinter Spiele und Tabelle".
 */

const RICHTUNGEN = [
  {
    id: "ist",
    name: "Jetzt live",
    quelle: "der Stand von heute",
    satz:
      "Das Stadionmotiv mit 26 Prozent Deckkraft. Gemessen im textfreien Streifen links unten: Mittel 17,9, Streuung 15,99, hellster Punkt 61.",
    preis: "Es ist weder Bild noch Textur, sondern die Mitte aus beidem.",
  },
  {
    id: "leer",
    name: "1 · Leer",
    quelle: "The Immortals",
    satz:
      "Kein Grund. Die Trennung machen die Haarlinie und der Abstand, sonst nichts. Die konsequenteste der sechs.",
    preis:
      "Der Abschnitt darüber ist ebenfalls schwarz. Ohne Grund sehen beide gleich aus, die Seite verliert einen Wechsel.",
  },
  {
    id: "flutlicht",
    name: "2 · Flutlicht",
    quelle: "WC 2026 Data Portraits",
    satz:
      "Ein weicher Lichtschein oben links hinter der Überschrift, ein kleinerer unten rechts. Reines CSS, kein Bild. Ein Flutlichtmast wirft genau so.",
    preis:
      "Sehr leise. Wer ein Motiv erwartet, sieht auf den ersten Blick nichts, sondern spürt es nur.",
  },
  {
    id: "wort",
    name: "3 · Geisterwort",
    quelle: "The Performance Lab",
    satz:
      "„KREISLIGA B“ in Konturschrift, so groß, dass es unten aus dem Abschnitt läuft. Ein Grund, der etwas sagt statt etwas darstellt.",
    preis:
      "Wörter im Hintergrund werden gelesen, auch wenn sie leise sind. Bei einem Abstieg steht dort das Falsche und muss mit.",
  },
  {
    id: "linien",
    name: "4 · Spielfeldlinien",
    quelle: "eigene Richtung",
    satz:
      "Der Platz als Bauzeichnung: Mittellinie, Anstoßkreis, Strafraum, Torraum. Echte Maße nach Regel 1, also 105 mal 68 Meter und 9,15 Meter Kreisradius.",
    preis:
      "Angeschnitten wirkt ein Feld schnell wie ein Rahmen. Muss großzügig überstehen, sonst sieht es aus wie ein Kasten.",
  },
  {
    id: "raster",
    name: "5 · Halbtonraster",
    quelle: "die eigene Seite",
    satz:
      "Dasselbe Punktraster wie im Kopfbereich, nur gröber und von unten rechts ausgeblendet. Erfindet nichts, führt weiter, was schon da ist.",
    preis:
      "Unspektakulär. Es löst das Problem, ohne dem Abschnitt etwas Eigenes zu geben.",
  },
  {
    id: "flaeche",
    name: "6 · Eigene Fläche",
    quelle: "BVB, Eintracht, Manchester City",
    satz:
      "Kein Motiv. Der Abschnitt bekommt flaeche-hoch statt flaeche und trennt sich durch das Material. Dazu eine schmale Lichtkante oben.",
    preis:
      "Das ist der Weg aller angesehenen Vereinsseiten. Nie im Weg, aber auch keine Bühne.",
  },
] as const;

export default function GrundErkundung() {
  if (process.env.NODE_ENV === "production") notFound();

  const [aktiv, setAktiv] = useState<string>("flutlicht");
  const gewaehlt = RICHTUNGEN.find((r) => r.id === aktiv) ?? RICHTUNGEN[0];
  const adresse = `/vorschau/grund/buehne?v=${aktiv}`;

  return (
    <main className="min-h-screen bg-fisch-black text-text">
      <div className="container-fisch py-12 sm:py-16">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-fisch-yellow">
          Erkundung · Spiele und Tabelle, der Grund
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
          Wir haben unsere eigene Regel gebrochen
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-text-leise">
          In `components/Hero.tsx` steht seit dem 07.09.2026 der Satz, warum
          das Wappen als blasser Grund entfernt wurde: entweder deutlich zeigen
          oder weglassen, die Mitte kostet nur. Das Stadionmotiv ist genau
          diese Mitte.
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-linie py-5 sm:grid-cols-4">
          {[
            ["Verantwortlich", "Dominic"],
            ["Stand", "8. September 2026"],
            ["Fläche", "Startseite, Spiele und Tabelle"],
            ["Ampel", "Grün, reine Oberfläche"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-leise">
                {k}
              </dt>
              <dd className="mt-1 text-sm font-bold">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <section>
            <h2 className="font-display text-2xl font-extrabold">Was gemessen ist</h2>
            <p className="mt-3 text-text-leise">
              Bei 1920 Pixeln, in einem Streifen ohne Text links unten im
              Abschnitt, verglichen mit zwei Stellen, über die niemand klagt:
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[26rem] text-sm">
                <thead>
                  <tr className="border-b border-linie text-left text-[10px] font-bold uppercase tracking-[0.16em] text-text-leise">
                    <th className="pb-2">Stelle</th>
                    <th className="pb-2 text-right">Mittel</th>
                    <th className="pb-2 text-right">Streuung</th>
                    <th className="pb-2 text-right">hellster</th>
                  </tr>
                </thead>
                <tbody className="text-text-leise">
                  {[
                    ["Grund jetzt", "17,9", "15,99", "61"],
                    ["Kopfbereich, Halbton", "17,5", "14,04", "47"],
                    ["Nachrichten, reines Schwarz", "10,2", "3,87", "85"],
                  ].map(([a, b, c, d]) => (
                    <tr key={a} className="border-b border-linie/40">
                      <td className="py-2 font-bold text-text">{a}</td>
                      <td className="py-2 text-right">{b}</td>
                      <td className="py-2 text-right">{c}</td>
                      <td className="py-2 text-right">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-text-leise">
              Der hellste Wert bei den Nachrichten ist eine Bildkachel, kein
              Grund. Interessant sind die anderen beiden: Das Stadion ist nicht
              unruhiger als das Halbtonraster im Kopfbereich, aber deutlich
              heller (61 gegen 47).
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-extrabold">
              Warum es trotzdem stört
            </h2>
            <p className="mt-3 text-text-leise">
              Nicht die Menge ist das Problem, sondern die Art. Das Halbtonraster
              ist ein regelmäßiges Muster, das Auge nimmt es als Oberfläche und
              hört auf hinzusehen. Das Stadion ist figürlich. Das Auge versucht
              ein Bild zu lesen, bekommt bei 26 Prozent aber keines, und
              versucht es weiter.
            </p>
            <p className="mt-3 text-text-leise">
              Dazu kommt: Es ist aus hunderten kleinen Vereinszeichen gebaut.
              Aus zwei Metern Abstand ist das ein Stadion, auf Armlänge ist es
              ein Teppich aus Zeichen, und am Bildschirm sitzt man auf
              Armlänge.
            </p>
            <p className="mt-4 border-l-2 border-fisch-yellow pl-4 text-sm font-bold text-text">
              Keine der sechs angesehenen Vereinsseiten legt ein großes blasses
              Motiv hinter einen zweispaltigen Abschnitt. Sie trennen durch
              Fläche und Abstand.
            </p>
          </section>
        </div>
      </div>

      {/* ---------------- Umschalter ---------------- */}
      <div className="sticky top-0 z-10 border-y border-linie bg-flaeche-hoch">
        <div className="container-fisch py-4">
          <div className="flex flex-wrap gap-2">
            {RICHTUNGEN.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setAktiv(r.id)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  aktiv === r.id
                    ? "bg-fisch-yellow text-fisch-black"
                    : "border border-linie text-text hover:border-fisch-yellow"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
          <p className="mt-3 max-w-3xl text-sm text-text-leise">
            <span className="font-bold text-text">Nach {gewaehlt.quelle}.</span>{" "}
            {gewaehlt.satz}
          </p>
          <p className="mt-1.5 max-w-3xl text-sm text-text-leise">
            <span className="font-bold text-fisch-yellow">Was es kostet:</span>{" "}
            {gewaehlt.preis}
          </p>
        </div>
      </div>

      <div className="px-8 py-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
          <div className="shrink-0">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-leise">
              Handy · 390 Pixel breit
            </p>
            <iframe
              key={`h-${aktiv}`}
              src={adresse}
              title={`Handyansicht ${gewaehlt.name}`}
              width={390}
              height={1000}
              className="border border-linie bg-fisch-black"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-leise">
              Bildschirm · 1440 Pixel, auf 62 Prozent verkleinert
            </p>
            <div className="h-[560px] overflow-hidden border border-linie">
              <iframe
                key={`d-${aktiv}`}
                src={adresse}
                title={`Bildschirmansicht ${gewaehlt.name}`}
                width={1440}
                height={900}
                style={{
                  transform: "scale(0.62)",
                  transformOrigin: "top left",
                  border: "none",
                }}
                className="bg-fisch-black"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
