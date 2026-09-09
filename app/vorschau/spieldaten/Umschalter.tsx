"use client";

import { useState } from "react";

/*
 * Erkundungscode, 09.09.2026. Bewusst eine einzige Datei, bewusst ohne
 * Ruecksicht auf die Konventionen des Repos.
 */

interface Variante {
  schluessel: string;
  name: string;
  was: string;
  /* Die Eigenschaften, um die es hier eigentlich geht. */
  aktualitaet: string;
  zustimmung: string;
  aussehen: string;
  wartung: string;
  ausfall: string;
  /* Was daran unangenehm ist. Jede Variante hat etwas. */
  haken: string;
}

const VARIANTEN: Variante[] = [
  {
    schluessel: "b",
    name: "Heute (Vergleichspunkt)",
    was: "Zwei JSON-Dateien im Repo, von Hand gepflegt.",
    aktualitaet: "So alt wie der letzte Commit",
    zustimmung: "nicht nötig",
    aussehen: "eigenes",
    wartung: "jeden Sonntag von Hand",
    ausfall: "gibt es nicht, die Datei liegt im Repo",
    haken:
      "Steht hier nur deshalb richtig, weil die Zahlen heute von Hand nachgetragen wurden. Vorher stand die Startseite drei Tage auf Spieltag 4, während die Unterseite Tabelle schon Spieltag 5 zeigte. Nächsten Sonntag beginnt das von vorn.",
  },
  {
    schluessel: "a",
    name: "A · Server holt FuPa",
    was: "Next holt die Daten serverseitig von api.fupa.net und zeichnet sie mit den vorhandenen Bausteinen.",
    aktualitaet: "höchstens 5 Minuten alt",
    zustimmung: "nicht nötig",
    aussehen: "eigenes, unverändert",
    wartung: "keine",
    ausfall: "fällt auf die Dateien im Repo zurück",
    haken:
      "Hängt an einer Adresse, die FuPa für das eigene Widget betreibt und nicht als Schnittstelle dokumentiert. Ändert FuPa sie, greift der Rückfall, aber die Zahlen frieren ein.",
  },
  {
    schluessel: "c",
    name: "C · Das echte Widget",
    was: "Der eingebettete FuPa-Baustein, wie schon auf /fussball/tabelle.",
    aktualitaet: "so aktuell wie FuPa",
    zustimmung: "Pflicht, vier fremde Hosts",
    aussehen: "fremd, eigene Schrift und Reiterleiste",
    wartung: "keine",
    ausfall: "leerer Kasten mit Hinweis",
    haken:
      "Wer nicht zustimmt, sieht auf der Startseite keine Zahlen. Und die Reiterleiste bringt vier Ansichten mit, die dort niemand braucht.",
  },
  {
    schluessel: "d",
    name: "D · Gemischt",
    was: "Startseite zeichnet selbst aus der Schnittstelle, die Unterseiten behalten das offizielle Widget.",
    aktualitaet: "höchstens 5 Minuten alt",
    zustimmung: "auf der Startseite nicht, auf den Unterseiten ja",
    aussehen: "eigenes vorn, fremd hinten",
    wartung: "keine",
    ausfall: "vorn Rückfall, hinten leerer Kasten",
    haken:
      "Zwei Wege für dieselben Zahlen. Wenn FuPa umbaut, muss man an zwei Stellen nachsehen.",
  },
];

const ZEILEN: { titel: string; feld: keyof Variante }[] = [
  { titel: "Wie aktuell", feld: "aktualitaet" },
  { titel: "Einwilligung", feld: "zustimmung" },
  { titel: "Aussehen", feld: "aussehen" },
  { titel: "Aufwand für dich", feld: "wartung" },
  { titel: "Wenn FuPa schweigt", feld: "ausfall" },
];

export default function Umschalter() {
  const [aktiv, setAktiv] = useState("b");
  const v = VARIANTEN.find((x) => x.schluessel === aktiv)!;
  const adresse = `/vorschau/spieldaten/buehne?v=${aktiv}`;

  return (
    <div className="min-h-screen bg-[#141414] text-[#e1e1e1]">
      {/*
        Auch der Rahmen ist eine Seite der Vereinsseite und zieht deshalb
        Kopfleiste, Fusszeile und Zustimmungsdialog mit. Beim Vergleichen
        stoert das dreifach: der Dialog lag ueber der unteren Kante beider
        Rahmen.
      */}
      <style>{`
        header, footer, [role="dialog"] { display: none !important; }
      `}</style>
      <div className="mx-auto flex max-w-[1800px] flex-col gap-8 p-6 lg:flex-row">
        {/* Bedienfeld */}
        <aside className="w-full shrink-0 lg:w-[340px]">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#f3da0b]">
            Erkundung · 09.09.2026
          </p>
          <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight">
            Woher kommen die Spieldaten
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#a5a5a5]">
            Vier Wege für denselben Abschnitt. Zwei davon sehen gleich aus und
            unterscheiden sich nur im Betrieb, deshalb steht die Tafel unter
            den Rahmen.
          </p>

          <div className="mt-6 flex flex-col gap-2">
            {VARIANTEN.map((x) => (
              <button
                key={x.schluessel}
                onClick={() => setAktiv(x.schluessel)}
                className={`border px-4 py-3 text-left text-sm transition ${
                  x.schluessel === aktiv
                    ? "border-[#f3da0b] bg-[#f3da0b] font-bold text-[#0a0a0a]"
                    : "border-[#3a3a3a] text-[#e1e1e1] hover:border-[#f3da0b]"
                }`}
              >
                {x.name}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[#a5a5a5]">{v.was}</p>

          <p className="mt-4 border-l-2 border-[#f3da0b] pl-3 text-sm leading-relaxed text-[#e1e1e1]">
            <strong className="font-bold">Der Haken: </strong>
            {v.haken}
          </p>

          <dl className="mt-6 border-t border-[#3a3a3a] text-sm">
            {ZEILEN.map((z) => (
              <div
                key={z.titel}
                className="grid grid-cols-[130px_1fr] gap-3 border-b border-[#3a3a3a] py-2.5"
              >
                <dt className="text-[#a5a5a5]">{z.titel}</dt>
                <dd className="text-[#e1e1e1]">{String(v[z.feld])}</dd>
              </div>
            ))}
          </dl>
        </aside>

        {/* Handy und Bildschirm im selben Blick, das ist der ganze Punkt */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 xl:flex-row">
          <div className="shrink-0">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-[#a5a5a5]">
              Handy · 375
            </p>
            <iframe
              key={`handy-${aktiv}`}
              src={adresse}
              title={`Handy, Variante ${v.name}`}
              className="h-[750px] w-[375px] border border-[#3a3a3a] bg-black"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-[#a5a5a5]">
              Bildschirm
            </p>
            <iframe
              key={`gross-${aktiv}`}
              src={adresse}
              title={`Bildschirm, Variante ${v.name}`}
              className="h-[900px] w-full border border-[#3a3a3a] bg-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
