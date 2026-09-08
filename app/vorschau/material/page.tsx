"use client";

import { useState } from "react";
import { notFound } from "next/navigation";

/* ERKUNDUNG, KEIN PRODUKTIONSCODE. */

const RICHTUNGEN = [
  {
    id: "ist",
    name: "Jetzt live",
    quelle: "der Stand von heute",
    satz:
      "Schwarz wie die Seite, dazu eine Haarlinie oben und unten. Die Linie macht die ganze Trennung, die Fläche macht keine.",
    preis: "Ohne das Motiv, das jetzt noch drin liegt.",
  },
  {
    id: "stufe",
    name: "A · Eine Stufe",
    quelle: "Eintracht Frankfurt",
    satz:
      "Der Abschnitt geht auf #1f1f1f, die Rahmenlinien fallen weg. Wo die Fläche wechselt, braucht es keine Linie. Karten gehen auf #2c2c2c mit.",
    preis:
      "Drei Ebenen auf engem Raum: 10, 31, 44. Wer die Karten vergisst mitzuheben, hat einen Abschnitt ohne sichtbare Karten.",
  },
  {
    id: "kasten",
    name: "B · Ein Kasten",
    quelle: "eigene Richtung",
    satz:
      "Kein Band über die volle Breite. Der Inhalt liegt in einem Kasten, der vom Seitenrand abrückt. Getrennt wird durch Höhe statt durch Fläche.",
    preis:
      "Ein Kasten im Kasten: Der äußere trägt die Karten, und beide brauchen Innenabstand. Der Abschnitt wird höher.",
  },
  {
    id: "hell",
    name: "C · Hell umgekehrt",
    quelle: "Manchester City",
    satz:
      "Der Abschnitt wird Off-White, Überschrift und Knöpfe drehen mit. Die Karten bleiben dunkel. Die größte Trennung, die es gibt.",
    preis:
      "Bricht die durchgehend dunkle Seite auf. Entweder es ist eine Setzung oder ein Ausrutscher, dazwischen gibt es nichts.",
  },
  {
    id: "gelb",
    name: "D · Vereinsgelb",
    quelle: "Mainz 05",
    satz:
      "Der Abschnitt in Vereinsgelb, schwarze Schrift, dunkle Karten darauf. Mainz stellt genauso einen ganzen Abschnitt in die Vereinsfarbe.",
    preis:
      "Über den Nachrichten liegt schon das gelbe Chronikband. Zwei gelbe Flächen sind eine Klammer oder ein Durcheinander.",
  },
] as const;

export default function MaterialErkundung() {
  if (process.env.NODE_ENV === "production") notFound();

  const [aktiv, setAktiv] = useState<string>("stufe");
  const gewaehlt = RICHTUNGEN.find((r) => r.id === aktiv) ?? RICHTUNGEN[0];
  const adresse = `/vorschau/material/buehne?v=${aktiv}`;

  return (
    <main className="min-h-screen bg-fisch-black text-text">
      <div className="container-fisch py-12 sm:py-16">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-fisch-yellow">
          Erkundung · Spiele und Tabelle, das Material
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
          Eine Fläche trennt sich an ihren Kanten
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-text-leise">
          Deshalb zeigt die Vorschau diesmal die Nachbarschaft mit: Chronikband,
          Nachrichten, dann der Abschnitt. Ein Abschnitt in Vereinsgelb sieht
          für sich prima aus und ist trotzdem falsch, wenn eine
          Bildschirmhöhe darüber schon ein gelbes Band steht.
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
            <h2 className="font-display text-2xl font-extrabold">
              Wie die Referenzen es wirklich machen
            </h2>
            <p className="mt-3 text-text-leise">
              Nicht aus dem Kopf, sondern gemessen: Startseite als ein Bild
              aufgenommen und die linke Spalte Zeile für Zeile ausgelesen.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[28rem] text-sm">
                <thead>
                  <tr className="border-b border-linie text-left text-[10px] font-bold uppercase tracking-[0.16em] text-text-leise">
                    <th className="pb-2">Verein</th>
                    <th className="pb-2">Flächen im Wechsel</th>
                  </tr>
                </thead>
                <tbody className="text-text-leise">
                  {[
                    ["Eintracht", "rgb(18,18,18) und rgb(0,0,0), ohne jede Linie, ein Block auf rgb(42,42,42)"],
                    ["Manchester City", "rgb(0,12,28), dann rgb(255,255,255) über 3796 px, dann Blau"],
                    ["Mainz 05", "Weiß, dann rgb(174,15,10), dann Vereinsrot rgb(227,6,19)"],
                    ["BVB", "gelbes Kopfband, danach durchgehend rgb(0,0,0)"],
                  ].map(([a, b]) => (
                    <tr key={a} className="border-b border-linie/40 align-top">
                      <td className="py-2 pr-4 font-bold text-text">{a}</td>
                      <td className="py-2">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-text-leise">
              Unsere Stufe von #0a0a0a auf #1f1f1f sind 21 Helligkeitsstufen.
              Eintracht arbeitet mit 18. Wir liegen also genau in dem Bereich,
              den eine dunkle Vereinsseite tatsächlich benutzt.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-extrabold">
              Was beim Bauen herauskam
            </h2>
            <p className="mt-3 text-text-leise">
              <span className="font-bold text-text">
                Die Karten müssen mitwandern.
              </span>{" "}
              Fixtures und die Tabelle stehen selbst auf `flaeche-hoch`. Hebt
              man nur den Abschnitt auf dieselbe Farbe, verschwinden die Karten
              darin, und übrig bleibt ihre Rahmenlinie.
            </p>
            <p className="mt-3 text-text-leise">
              <span className="font-bold text-text">
                Und die Farbvariable gilt auch für das Element, an dem sie
                steht.
              </span>{" "}
              Der erste Versuch setzte am Abschnitt gleichzeitig die Klasse
              `bg-flaeche-hoch` und die Neusetzung von `--color-flaeche-hoch`.
              Damit färbte sich der Abschnitt mit, die Karten waren wieder
              genauso hell wie er, und die Stufe war weg. Unsichtbar, weil
              beides gleichzeitig passiert.
            </p>
            <p className="mt-4 border-l-2 border-fisch-yellow pl-4 text-sm font-bold text-text">
              Die helle Richtung holt die alte helle Komponentenfassung NICHT
              zurück. Die ist beim Farbumbau entfallen, weil ein Zweig, den
              niemand sieht, nicht gepflegt wird. Dunkle Karten auf hellem
              Grund kosten keine zweite Fassung.
            </p>
          </section>
        </div>
      </div>

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
              height={1200}
              className="border border-linie bg-fisch-black"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-leise">
              Bildschirm · 1440 Pixel, auf 62 Prozent verkleinert
            </p>
            <div className="h-[930px] overflow-hidden border border-linie">
              <iframe
                key={`d-${aktiv}`}
                src={adresse}
                title={`Bildschirmansicht ${gewaehlt.name}`}
                width={1440}
                height={1500}
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
