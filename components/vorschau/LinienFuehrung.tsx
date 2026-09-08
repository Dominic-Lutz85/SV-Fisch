import Image from "next/image";
import chronik from "@/content/chronik.json";

/*
 * ERKUNDUNG, KEIN PRODUKTIONSCODE.
 *
 * Der Auftraggeber hat Fassung C gewaehlt, also vier Baelle, die von
 * links nach rechts groesser werden. Dazu seine Frage: "und die Linie
 * weg oder die Linie anders gestalten oder unterteilen?"
 *
 * Die Frage trifft einen echten Punkt. Solange vier gleiche Punkte auf
 * der Linie sassen, war die Linie das Traggeruest: Sie hat die Punkte
 * ueberhaupt erst zu einer Reihe gemacht. Sobald die Baelle wachsen,
 * tragen sie die Aussage selbst, und die Linie steht daneben, ohne noch
 * etwas beizusteuern.
 *
 * Vier Antworten darauf, jede mit einer anderen Rolle fuer die Linie.
 *
 * GROESSEN 18 BIS 30 STATT 14 BIS 26: Beim Vergleichsbogen zu Fassung C
 * war der erste Ball mit 14 Pixeln nur noch ein Fleck, die Naehte
 * verschwanden. Das ist derselbe Fehler, den der Auftraggeber an den
 * ersten Linienmotiven zu Recht bemaengelt hat ("erkennt ja aber
 * keiner"). Mit 18 bleibt die Zeichnung erhalten, und der Abstand
 * zwischen kleinstem und groesstem Ball waechst dabei sogar von 12 auf
 * 12 Pixel bei hoeherem Ausgangswert, das Wachstum liest sich also
 * genauso deutlich.
 */

const stufen = chronik.stufen;
const PUNKTE_Y = [10, 3, -4, -11];
const GROESSEN = [18, 22, 26, 30];

/* Mitte der Linie: top-4 sind 16 Pixel, plus die halbe Linienstaerke. */
const LINIE_MITTE = 17;

function Ball({ i }: { i: number }) {
  const g = GROESSEN[i];
  return (
    <Image
      src="/fussball.png"
      alt=""
      width={96}
      height={96}
      aria-hidden="true"
      className="absolute left-0 hidden sm:block"
      style={{
        width: `${g}px`,
        height: `${g}px`,
        top: `${LINIE_MITTE + PUNKTE_Y[i] - g / 2}px`,
      }}
    />
  );
}

function Rahmen({
  linie,
}: {
  linie: (i: number) => React.ReactNode;
}) {
  return (
    <div className="bg-fisch-yellow text-fisch-black">
      <div className="container-fisch py-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] opacity-70">
            Der Weg des SV Fisch
          </p>
          <p className="hidden text-[11px] font-bold uppercase tracking-[0.16em] opacity-50 sm:block">
            Quelle FuPa
          </p>
        </div>
        <ol className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:mt-7 sm:grid-cols-4 sm:gap-8">
          {stufen.map((stufe, i) => (
            <li key={stufe.jahr} className="relative sm:pt-11">
              {linie(i)}
              <Ball i={i} />
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] opacity-70">
                {stufe.jahr}
              </p>
              <p className="font-display text-[15px] font-extrabold leading-tight sm:text-base">
                {stufe.titel}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 1  Linie bleibt, wie sie ist                                        */
/* ------------------------------------------------------------------ */
export function FuehrungBleibt() {
  return (
    <Rahmen
      linie={(i) => (
        <span
          aria-hidden="true"
          className={`absolute left-0 top-4 hidden h-[3px] bg-fisch-black/20 sm:block ${
            i === stufen.length - 1 ? "w-full" : "w-[calc(100%+2rem)]"
          }`}
        />
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 2  Linie weg                                                        */
/* ------------------------------------------------------------------ */
/*
 * Nur die vier Baelle. Sie stehen auf verschiedenen Hoehen und steigen
 * dadurch von selbst, dafuer braucht es keine Linie darunter.
 *
 * Der Preis, und er ist echt: Ohne Linie ist der Bezug zwischen den
 * Baellen loser. Auf einem breiten Bildschirm liegen 304 Pixel
 * zwischen zwei Baellen, und das Auge muss die Reihe selbst herstellen.
 */
export function FuehrungWeg() {
  return <Rahmen linie={() => null} />;
}

/* ------------------------------------------------------------------ */
/* 3  Linie unterteilt                                                 */
/* ------------------------------------------------------------------ */
/*
 * Der Vorschlag des Auftraggebers: Die Linie laeuft NUR zwischen den
 * Baellen und hoert an ihnen auf, statt hinter ihnen durchzugehen.
 *
 * Das ist der Unterschied zwischen einer Schnur, auf der Perlen sitzen,
 * und vier Stationen, die durch Wege verbunden sind. Beim zweiten ist
 * der Ball das Ziel und nicht die Dekoration.
 *
 * Die Zahlen sind gemessen, nicht gesetzt: Die Luecke ist jeweils die
 * halbe Ballbreite plus 6 Pixel Luft. Weil die Baelle unterschiedlich
 * gross sind, ist die Luecke links am naechsten Ball eine andere als
 * rechts am eigenen.
 */
export function FuehrungUnterteilt() {
  return (
    <Rahmen
      linie={(i) => {
        if (i === stufen.length - 1) return null;
        const linksAb = GROESSEN[i] / 2 + 6;
        const rechtsBis = GROESSEN[i + 1] / 2 + 6;
        return (
          <span
            aria-hidden="true"
            className="absolute top-4 hidden h-[3px] bg-fisch-black/25 sm:block"
            style={{
              left: `${linksAb}px`,
              width: `calc(100% + 2rem - ${linksAb + rechtsBis}px)`,
            }}
          />
        );
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 4  Linie als Laufspur                                               */
/* ------------------------------------------------------------------ */
/*
 * Gestrichelt statt durchgezogen, und sie hoert am letzten Ball auf.
 *
 * Eine gestrichelte Linie wiegt weniger als eine durchgezogene, laesst
 * den Baellen also die Hauptrolle, haelt die Reihe aber trotzdem
 * zusammen. Der Abstand der Striche ist mit 3 zu 5 Pixeln bewusst eng:
 * Weiter auseinander wird daraus ein Muster, das selbst auffaellt.
 */
export function FuehrungSpur() {
  return (
    <Rahmen
      linie={(i) =>
        i === stufen.length - 1 ? null : (
          <span
            aria-hidden="true"
            className="absolute left-0 top-4 hidden h-[3px] w-[calc(100%+2rem)] sm:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(10,10,10,0.3) 0 3px, transparent 3px 8px)",
            }}
          />
        )
      }
    />
  );
}

export const FUEHRUNGEN = [
  {
    id: "bleibt",
    name: "1 · Linie bleibt",
    satz:
      "Wie heute, nur mit wachsenden Bällen. Die Linie läuft hinter den Bällen durch und über den letzten hinaus.",
  },
  {
    id: "weg",
    name: "2 · Linie weg",
    satz:
      "Nur die vier Bälle. Sie steigen von selbst, die Linie ist dann Beiwerk. Preis: 304 Pixel Abstand ohne Verbindung.",
  },
  {
    id: "unterteilt",
    name: "3 · Unterteilt",
    satz:
      "Deine Idee: die Linie läuft nur ZWISCHEN den Bällen und hört an ihnen auf. Aus Perlen auf einer Schnur werden Stationen mit Wegen.",
  },
  {
    id: "spur",
    name: "4 · Laufspur",
    satz:
      "Gestrichelt statt durchgezogen, und Schluss am letzten Ball. Wiegt weniger, hält die Reihe aber zusammen.",
  },
] as const;
