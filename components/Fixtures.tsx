import { MapPin } from "lucide-react";

import { formatDatum } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { heuteInDeutschland } from "@/lib/content";
import type { Spiel } from "@/types/content";

/*
 * Spielliste.
 *
 * Aufbau übernommen von Manchester City und dem FC Bayern, beide am 02.09.2026
 * angesehen. Was bei beiden gleich war und hier deshalb auch so ist:
 *
 * 1. Gruppierung nach Monat mit großer Überschrift.
 * 2. Das Datum ist ein eigenes Element, bei Bayern eine Leiste über der Karte
 *    mit Wochentag links und Anstoßzeit rechts.
 * 3. Die Paarung steht MITTIG, Heim links, Gast rechts, dazwischen Anstoßzeit
 *    oder Ergebnis. Vorher stand hier alles linksbündig in einer Zeile.
 * 4. Der Wettbewerb steht klein über der Paarung, der Spielort klein darunter.
 * 5. Das nächste Spiel ist markiert.
 * 6. Bei Ergebnissen ein Kennzeichen für Sieg, Unentschieden und Niederlage
 *    sowie das Ergebnis in zwei Kästen, wie bei Man City.
 *
 * Nicht übernommen: die Vereinswappen der Gegner. Für die Kreisliga haben wir
 * keine, und Platzhalter wären schlechter als nichts.
 */

type Ausgang = "sieg" | "unentschieden" | "niederlage" | null;

function istFisch(team: string) {
  return team.toLowerCase().includes("fisch");
}

/** Aus "2:1" und der Frage, ob Fisch zu Hause war, den Ausgang ableiten. */
function ausgangVon(spiel: Spiel): Ausgang {
  if (!spiel.ergebnis) return null;
  const [a, b] = spiel.ergebnis.split(":").map((n) => parseInt(n.trim(), 10));
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  const heim = istFisch(spiel.heim);
  const eigene = heim ? a : b;
  const fremde = heim ? b : a;
  if (eigene > fremde) return "sieg";
  if (eigene < fremde) return "niederlage";
  return "unentschieden";
}

function MonatsUeberschrift({ datum }: { datum: string }) {
  const d = new Date(datum);
  const text = new Intl.DateTimeFormat("de-DE", {
    month: "long",
    year: "numeric",
  }).format(d);
  return (
    <h3 className="mb-4 mt-10 font-display text-xl font-extrabold uppercase tracking-wide text-fisch-black first:mt-0">
      {text}
    </h3>
  );
}

function Wochentag({ datum }: { datum: string }) {
  const d = new Date(datum);
  const tag = new Intl.DateTimeFormat("de-DE", { weekday: "long" }).format(d);
  return <>{tag}</>;
}

function Ergebniskasten({ wert }: { wert: string }) {
  const [a, b] = wert.split(":");
  return (
    <span className="flex items-center gap-1" aria-label={`Ergebnis ${wert}`}>
      <span className="min-w-8 bg-fisch-black px-2 py-1 text-center font-display text-lg font-extrabold text-fisch-white">
        {a}
      </span>
      <span className="min-w-8 bg-fisch-black px-2 py-1 text-center font-display text-lg font-extrabold text-fisch-white">
        {b}
      </span>
    </span>
  );
}

function AusgangsZeichen({ ausgang }: { ausgang: Ausgang }) {
  if (!ausgang) return null;
  const beschriftung =
    ausgang === "sieg" ? "S" : ausgang === "unentschieden" ? "U" : "N";
  const langtext =
    ausgang === "sieg"
      ? "Sieg"
      : ausgang === "unentschieden"
        ? "Unentschieden"
        : "Niederlage";
  return (
    <span
      title={langtext}
      className={cn(
        "grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-extrabold",
        ausgang === "sieg" && "bg-fisch-yellow text-fisch-black",
        ausgang === "unentschieden" && "bg-fisch-line text-fisch-black",
        ausgang === "niederlage" && "bg-fisch-black text-fisch-white"
      )}
    >
      <span aria-hidden="true">{beschriftung}</span>
      <span className="sr-only">{langtext}</span>
    </span>
  );
}

function Zeile({
  spiel,
  hervorgehoben,
  heute,
}: {
  spiel: Spiel;
  hervorgehoben: boolean;
  heute: string;
}) {
  const ausgang = ausgangVon(spiel);
  const vergangen = spiel.datum < heute;
  const heimspiel = spiel.ort === "Heim";

  return (
    <li className="mb-4">
      {/*
        Der Marker steht ÜBER der Karte, nicht darunter. Unten gelesen wirkte er
        wie die Beschriftung des NÄCHSTEN Eintrags in der Liste, so wie eine
        Bildunterschrift. Bayern setzt ihn ebenfalls oben.
      */}
      {hervorgehoben && (
        <p className="bg-fisch-yellow px-4 py-1 text-center text-[11px] font-extrabold uppercase tracking-widest text-fisch-black">
          Nächstes Spiel
        </p>
      )}

      {/* Datumsleiste über der Karte, nach dem Muster des FC Bayern. */}
      <div className="flex items-center justify-between gap-3 bg-fisch-line/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-fisch-black">
        <span>
          <Wochentag datum={spiel.datum} /> · {formatDatum(spiel.datum)}
        </span>
        <span>{spiel.uhrzeit} Uhr</span>
      </div>

      <div
        className={cn(
          "relative flex items-center gap-4 border border-t-0 border-fisch-line bg-white px-4 py-4",
          hervorgehoben && "border-fisch-yellow ring-1 ring-fisch-yellow"
        )}
      >
        {/* Farbkante links: Gelb für Heimspiele, Schwarz für auswärts. Bei
            Bayern zeigt diese Kante den Wettbewerb, hier gibt es nur einen. */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-0 left-0 w-1.5",
            heimspiel ? "bg-fisch-yellow" : "bg-fisch-black"
          )}
        />

        <AusgangsZeichen ausgang={ausgang} />

        <div className="min-w-0 flex-1">
          <p className="text-center text-[11px] font-bold uppercase tracking-wider text-fisch-muted">
            {spiel.wettbewerb}
          </p>

          <div className="mt-1 flex items-center justify-center gap-3 sm:gap-5">
            <span
              className={cn(
                "flex-1 text-right text-sm sm:text-base",
                istFisch(spiel.heim) ? "font-extrabold text-fisch-black" : "font-semibold text-fisch-ink"
              )}
            >
              {spiel.heim}
            </span>

            <span className="shrink-0">
              {spiel.ergebnis ? (
                <Ergebniskasten wert={spiel.ergebnis} />
              ) : vergangen ? (
                <span className="whitespace-nowrap bg-fisch-line/70 px-2 py-1 text-xs font-semibold text-fisch-muted">
                  Ergebnis fehlt
                </span>
              ) : (
                <span className="font-display text-base font-extrabold text-fisch-black">
                  {spiel.uhrzeit}
                </span>
              )}
            </span>

            <span
              className={cn(
                "flex-1 text-left text-sm sm:text-base",
                istFisch(spiel.auswaerts) ? "font-extrabold text-fisch-black" : "font-semibold text-fisch-ink"
              )}
            >
              {spiel.auswaerts}
            </span>
          </div>

          <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-fisch-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {heimspiel
              ? (spiel.spielstaette ?? "Sportplatz SV Fisch")
              : "Auswärts"}
          </p>
        </div>
      </div>

    </li>
  );
}

export default function Fixtures({
  spiele,
  compact = false,
  variant = "light",
  gruppiert = false,
  erstesHervorheben = false,
}: {
  spiele: Spiel[];
  /** Kurzform für die Startseite: eine Zeile je Spiel, ohne Karten */
  compact?: boolean;
  variant?: "light" | "dark";
  /** Nach Monaten gruppieren, wie bei Man City und Bayern */
  gruppiert?: boolean;
  /** Das erste Spiel als "Nächstes Spiel" markieren */
  erstesHervorheben?: boolean;
}) {
  const dark = variant === "dark";
  const heute = heuteInDeutschland();

  if (spiele.length === 0) {
    return (
      <p className={cn("text-sm", dark ? "text-fisch-white/70" : "text-fisch-muted")}>
        Aktuell sind keine Spiele hinterlegt.
      </p>
    );
  }

  /*
   * Kurzform für die Startseite. Dort steht die Liste auf schwarzem Grund neben
   * der Tabelle, da wären Karten mit Datumsleisten zu laut.
   */
  /*
   * Kurzform für die Startseite, dunkle Fassung derselben Formensprache wie die
   * Karten auf der Spielplanseite: Datumszeile oben, Paarung mittig, farbige
   * Kante links für Heim oder auswärts.
   *
   * Vorher standen hier linksbündige Zeilen mit einer gelben Pille rechts. Das
   * war ein anderer Stil als der Spielplan, und zwei Stile für dieselbe Sache
   * auf einer Seite sehen nach Zufall aus.
   */
  if (compact) {
    return (
      <ul className="flex flex-col gap-2.5">
        {spiele.map((spiel) => {
          const heimspiel = spiel.ort === "Heim";
          return (
            <li
              key={`${spiel.datum}-${spiel.heim}`}
              className={cn(
                "relative px-4 py-3",
                dark ? "bg-white/[0.06]" : "border border-fisch-line bg-white"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-y-0 left-0 w-1",
                  heimspiel
                    ? "bg-fisch-yellow"
                    : dark
                      ? "bg-white/40"
                      : "bg-fisch-black"
                )}
              />
              <div
                className={cn(
                  "flex items-center justify-between text-[11px] font-bold uppercase tracking-wider",
                  dark ? "text-fisch-white/60" : "text-fisch-muted"
                )}
              >
                <span>{formatDatum(spiel.datum)}</span>
                <span>{heimspiel ? "Heim" : "Auswärts"}</span>
              </div>
              <div className="mt-1 flex items-center justify-center gap-3">
                <span
                  className={cn(
                    "flex-1 truncate text-right text-sm",
                    istFisch(spiel.heim)
                      ? "font-extrabold"
                      : "font-medium opacity-80",
                    dark ? "text-fisch-white" : "text-fisch-black"
                  )}
                >
                  {spiel.heim}
                </span>
                <span className="shrink-0">
                  {spiel.ergebnis ? (
                    <span
                      className={cn(
                        "px-2 py-0.5 font-display text-sm font-extrabold",
                        dark
                          ? "bg-fisch-white text-fisch-black"
                          : "bg-fisch-black text-fisch-white"
                      )}
                    >
                      {spiel.ergebnis}
                    </span>
                  ) : spiel.datum < heute ? (
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[11px] font-semibold",
                        dark
                          ? "bg-white/10 text-fisch-white/70"
                          : "bg-fisch-line/60 text-fisch-muted"
                      )}
                    >
                      offen
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "font-display text-sm font-extrabold",
                        dark ? "text-fisch-yellow" : "text-fisch-black"
                      )}
                    >
                      {spiel.uhrzeit}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "flex-1 truncate text-left text-sm",
                    istFisch(spiel.auswaerts)
                      ? "font-extrabold"
                      : "font-medium opacity-80",
                    dark ? "text-fisch-white" : "text-fisch-black"
                  )}
                >
                  {spiel.auswaerts}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  if (!gruppiert) {
    return (
      <ul className="flex flex-col">
        {spiele.map((spiel, i) => (
          <Zeile
            key={`${spiel.datum}-${spiel.heim}`}
            spiel={spiel}
            heute={heute}
            hervorgehoben={erstesHervorheben && i === 0}
          />
        ))}
      </ul>
    );
  }

  // Nach Monat gruppieren, Reihenfolge der Liste bleibt erhalten.
  const monate: { schluessel: string; spiele: Spiel[] }[] = [];
  for (const spiel of spiele) {
    const schluessel = spiel.datum.slice(0, 7);
    const letzter = monate[monate.length - 1];
    if (letzter && letzter.schluessel === schluessel) letzter.spiele.push(spiel);
    else monate.push({ schluessel, spiele: [spiel] });
  }

  let laufend = 0;
  return (
    <div>
      {monate.map((monat) => (
        <section key={monat.schluessel}>
          <MonatsUeberschrift datum={monat.spiele[0].datum} />
          <ul className="flex flex-col">
            {monat.spiele.map((spiel) => {
              const hervorgehoben = erstesHervorheben && laufend === 0;
              laufend += 1;
              return (
                <Zeile
                  key={`${spiel.datum}-${spiel.heim}`}
                  spiel={spiel}
                  heute={heute}
                  hervorgehoben={hervorgehoben}
                />
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
