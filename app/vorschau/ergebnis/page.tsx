"use client";

import { useState } from "react";
import { notFound } from "next/navigation";

/*
 * ERKUNDUNG, KEIN PRODUKTIONSCODE.
 *
 * Memo und Umschalter fuer die Frage "wie kommt das letzte Spielergebnis in
 * den Kopfbereich". Aufbau wie bei der Erkundung zum Uebergang am
 * 08.09.2026: erst das Memo mit dem, was gemessen und nachgesehen ist, dann
 * die Richtungen als laufende Seite, Handy und Bildschirm im selben Blick.
 */

const RICHTUNGEN = [
  {
    id: "a",
    name: "A · Ergebnisband",
    quelle: "Eintracht Frankfurt",
    satz:
      "Fünf Partien in einer Zeile: drei gespielte mit Ergebnis, zwei kommende mit Anstoßzeit. Das Ergebnis ist keine Kachel, sondern die Stelle, an der die Saison gerade steht.",
    preis:
      "Der Block „Nächstes Spiel“ fällt weg. Der nächste Gegner ist danach einer von fünf Einträgen statt der größte Text im Fuß.",
  },
  {
    id: "b",
    name: "B · Zwei Spalten",
    quelle: "Manchester City",
    satz:
      "Der Fuß bekommt links „Zuletzt“ mit den Ergebniskästen und dem S-Zeichen, rechts bleibt das nächste Spiel. Gelesen wird von links nach rechts, also gewesen zu kommend.",
    preis:
      "Der Fuß trägt danach vier Sachen nebeneinander. Unter 1280 Pixeln bricht die Zeile um, und der Kopfbereich wächst.",
  },
  {
    id: "c",
    name: "C · Die große Ziffer",
    quelle: "Union Berlin, Mainz 05",
    satz:
      "Die Ziffer wird das Bild. Sie steht rechts neben dem Text, vor dem Wappen, auf der leeren Fläche, die der Kopfbereich ohnehin hat. Sieg in Gelb, alles andere in Textfarbe.",
    preis:
      "Eine Niederlage steht genauso groß da wie ein Sieg. Am 16.08. wäre das ein 1:3 in Schriftgröße 96 gewesen. Das ist ehrlich, aber es ist eine Entscheidung.",
  },
  {
    id: "d",
    name: "D · Die Anzeigetafel",
    quelle: "eigene Richtung",
    satz:
      "Die gelbe Linie trägt eine Tafel, so wie am Sportplatz eine Tafel am Mast hängt. Gebaut aus Rahmen, Kopfzeile und den Ergebniskästen, nicht gezeichnet.",
    preis:
      "Die Schuhe müssen ab. Zwei Gegenstände an einer Leitung sind einer zu viel, und die Tafel braucht genau deren Platz.",
  },
] as const;

export default function ErgebnisErkundung() {
  if (process.env.NODE_ENV === "production") notFound();

  const [aktiv, setAktiv] = useState<string>("b");
  const [daten, setDaten] = useState<"offen" | "fertig">("offen");
  const [aushang, setAushang] = useState<"an" | "aus">("aus");
  const gewaehlt = RICHTUNGEN.find((r) => r.id === aktiv) ?? RICHTUNGEN[0];
  const adresse = `/vorschau/ergebnis/buehne?v=${aktiv}&d=${daten}&m=${aushang}`;

  return (
    <main className="min-h-screen bg-fisch-black text-text">
      <div className="container-fisch py-12 sm:py-16">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-fisch-yellow">
          Erkundung · Kopfbereich, letztes Ergebnis
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
          Kein großer Verein stellt das Ergebnis in den Kopfbereich
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-text-leise">
          Am 08.09.2026 vier Vereinsseiten aufgerufen und angesehen. Keine
          einzige zeigt oben eine Ergebniskachel. Entweder das Ergebnis ist die
          Schlagzeile, oder es steht weiter unten in einer Spalte. Das ist der
          Ausgangspunkt für die vier Richtungen.
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-linie py-5 sm:grid-cols-4">
          {[
            ["Verantwortlich", "Dominic"],
            ["Stand", "8. September 2026"],
            ["Fläche", "Startseite, Kopfbereich"],
            ["Ampel", "Gelb, Datenpflege"],
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
              Was die Referenzen machen
            </h2>
            <ul className="mt-4 space-y-4 text-sm text-text-leise">
              <li>
                <span className="font-bold text-text">Manchester City.</span>{" "}
                Rechte Spalte, zwei Karten untereinander: „NEXT FIXTURE“ mit
                Anstoßzeit zwischen den Wappen, darunter „LAST RESULT“ mit den
                Ziffern in zwei dunklen Kästen. Beides steht unter dem
                Kopfbereich, nicht darin. Unsere Ergebniskästen auf der
                Spielplanseite stammen bereits von dort.
              </li>
              <li>
                <span className="font-bold text-text">Eintracht Frankfurt.</span>{" "}
                Ein waagerechtes Spielplanband quer über die Seite: „FCU 3:3
                SGE“, „SGE 1:4 FCA“, „M05 –:– SGE“. Gespieltes trägt das
                Ergebnis, Kommendes einen Gedankenstrich, das nächste Spiel ist
                unterstrichen. Vergangenheit und Zukunft in einer Zeile.
              </li>
              <li>
                <span className="font-bold text-text">Union Berlin.</span> Das
                Ergebnis ist die Schlagzeile über einem randlosen Foto:
                „0:1 gegen die SGE bedeutet Unions Niederlage“, darüber klein
                „Frankfurt reicht ein Tor:“.
              </li>
              <li>
                <span className="font-bold text-text">Mainz 05.</span> Dasselbe
                ohne Ziffern: „05ER LASSEN IN HAMBURG NICHTS ANBRENNEN“.
              </li>
            </ul>
            <p className="mt-4 text-sm text-text-leise">
              Was Union und Mainz dabei haben und wir nicht, ist ein Foto vom
              Spiel. Im Repo liegt genau ein echtes Vereinsfoto. Deshalb ersetzt
              Richtung C das Foto durch Typografie.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-extrabold">
              Das eigentliche Problem ist nicht die Gestaltung
            </h2>
            <p className="mt-3 text-text-leise">
              Heute ist der 8. September. Im Spielplan steht ein Spiel vom
              6. September gegen SV Tawern II, ohne Ergebnis. Das jüngste Spiel
              mit Ergebnis ist das vom 30. August, 4:2 in Trier.
            </p>
            <p className="mt-3 text-text-leise">
              Wer stumpf „das letzte Ergebnis“ zeigt, schreibt am Dienstag groß
              4:2 in den Kopfbereich, obwohl am Sonntag davor gespielt wurde.
              Jeder im Ort weiß das. Die Seite sieht dann nicht modern aus,
              sondern ungepflegt, und zwar genau bei den Leuten, die beim Spiel
              dabei waren.
            </p>
            <p className="mt-3 text-text-leise">
              Deshalb trägt jede der vier Richtungen den Hinweis „Ergebnis vom
              06.09. folgt“. Und deshalb hat der Umschalter unten eine zweite
              Achse: Man sieht jede Richtung in beiden Datenlagen.
            </p>
            <p className="mt-4 border-l-2 border-fisch-yellow pl-4 text-sm font-bold text-text">
              Ohne jemanden, der montags das Ergebnis einträgt, macht diese
              Änderung die Startseite schlechter statt besser. Das ist keine
              Gestaltungsfrage.
            </p>
          </section>
        </div>

        <section className="mt-10 border-l-2 border-fisch-yellow pl-5">
          <h2 className="font-display text-2xl font-extrabold">
            Der Aushang, zweite Frage vom selben Tag
          </h2>
          <p className="mt-3 max-w-3xl text-text-leise">
            „Eine Stelle, an der immer die wichtigen Neuigkeiten stehen.“ Für
            einen Dorfverein sind das nicht Artikel, sondern kurzlebige Sätze:
            Spiel fällt aus, Training verlegt, Helfer gesucht. Die haben kein
            Bild und keine drei Absätze, und niemand schreibt dafür einen
            Beitrag.
          </p>
          <p className="mt-3 max-w-3xl text-text-leise">
            Also ein Aushang ganz oben, über dem Kopfbereich, mit zwei Stufen:
            gelb für alles, wegen dem jemand umsonst zum Platz fährt, dunkel mit
            gelber Kante für Aufrufe. Er dreht sich nicht, und er verschwindet
            von selbst, weil jede Meldung ein Bis-Datum hat. Ein Aushang, den
            jemand abhängen muss, hängt im März noch am Sportplatz.
          </p>
          <p className="mt-3 max-w-3xl text-sm text-text-leise">
            Unten zuschaltbar, damit sichtbar wird, was er dem ersten Bildschirm
            an Höhe kostet.
          </p>
        </section>
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
            <span className="font-bold text-text">
              Nach {gewaehlt.quelle}.
            </span>{" "}
            {gewaehlt.satz}
          </p>
          <p className="mt-1.5 max-w-3xl text-sm text-text-leise">
            <span className="font-bold text-fisch-yellow">Was es kostet:</span>{" "}
            {gewaehlt.preis}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-linie pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-leise">
                Datenlage
              </span>
              {(
                [
                  ["offen", "Wie heute: Ergebnis fehlt noch"],
                  ["fertig", "Sonntagabend: alles eingetragen"],
                ] as const
              ).map(([id, text]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDaten(id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                    daten === id
                      ? "bg-fisch-yellow text-fisch-black"
                      : "border border-linie text-text-leise hover:border-fisch-yellow"
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-leise">
                Aushang
              </span>
              {(
                [
                  ["aus", "Ohne"],
                  ["an", "Mit zwei Meldungen"],
                ] as const
              ).map(([id, text]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAushang(id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                    aushang === id
                      ? "bg-fisch-yellow text-fisch-black"
                      : "border border-linie text-text-leise hover:border-fisch-yellow"
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Handy und Bildschirm im selben Blick ---------------- */}
      {/*
        Volle Fensterbreite, nicht container-fisch. Der Container deckelt auf
        80rem, dann ist der Bildschirmrahmen zu schmal fuer 1440 mal 0,62 und
        schneidet rechts ab. Das ist am 08.09.2026 schon einmal passiert.
      */}
      <div className="px-8 py-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
          <div className="shrink-0">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-leise">
              Handy · 390 Pixel breit, 900 hoch, also ein erster Bildschirm
              plus etwas
            </p>
            <iframe
              key={`h-${aktiv}-${daten}-${aushang}`}
              src={adresse}
              title={`Handyansicht ${gewaehlt.name}`}
              width={390}
              height={900}
              className="border border-linie bg-fisch-black"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-leise">
              Bildschirm · 1440 Pixel, auf 62 Prozent verkleinert
            </p>
            <div className="h-[560px] overflow-hidden border border-linie">
              <iframe
                key={`d-${aktiv}-${daten}-${aushang}`}
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
