import Image from "next/image";
import chronik from "@/content/chronik.json";

/*
 * ERKUNDUNG, KEIN PRODUKTIONSCODE.
 *
 * Vier Fassungen der Chronik-Markierungen. Heute sind es vier schwarze
 * Punkte mit 12 Pixeln, die auf einer Linie steigen. Der Auftraggeber
 * hat einen Fussball als PNG geliefert und will ihn an deren Stelle.
 *
 * ZUR DATEI, weil es hier gut ausgegangen ist: Der Ball kam mit
 * Alphakanal, und zwar so, dass die weissen Sechsecke NICHT weiss,
 * sondern durchsichtig sind. Gemessen: 0 Prozent helle Pixel,
 * 27,9 Prozent schwarz, 72,1 Prozent transparent.
 *
 * Das ist genau richtig fuer diese Stelle: Auf dem gelben Band werden
 * die Sechsecke gelb und die Naehte schwarz, der Ball traegt also die
 * Vereinsfarben statt Schwarzweiss mitzubringen. Waeren sie weiss
 * gewesen, haette es vier weisse Kreise auf Vereinsgelb gegeben, und
 * genau diese Art Fleck ist im Vault als wiederkehrender Fehler notiert.
 *
 * Umgefaerbt wurde er trotzdem von rgb(0,0,0) auf das Vereinsschwarz
 * rgb(10,10,10), damit er zur Schrift daneben passt.
 */

const stufen = chronik.stufen;
const PUNKTE_Y = [10, 3, -4, -11];

function Rahmen({ kinder }: { kinder: (i: number) => React.ReactNode }) {
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
            <li key={stufe.jahr} className="relative sm:pt-10">
              <span
                aria-hidden="true"
                className={`absolute left-0 top-4 hidden h-[3px] bg-fisch-black/20 sm:block ${
                  i === stufen.length - 1 ? "w-full" : "w-[calc(100%+2rem)]"
                }`}
              />
              {kinder(i)}
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

/* Ein Ball, mittig ueber dem Punkt der Linie. */
function Ball({ groesse, y }: { groesse: number; y: number }) {
  return (
    <Image
      src="/fussball.png"
      alt=""
      width={96}
      height={96}
      aria-hidden="true"
      className="absolute hidden sm:block"
      style={{
        width: `${groesse}px`,
        height: `${groesse}px`,
        /* 17 ist die Mitte der Linie: top-4 sind 16, plus halbe Linienstaerke. */
        top: `${17 + y - groesse / 2}px`,
        /*
          left 0, also buendig zur Textkante darunter, und NICHT mittig
          ueber dem Linienanfang.

          Der alte Punkt war 12 Pixel gross und sass bei left 0, seine
          Mitte lag damit bei 6. Legt man die Ballmitte auf dieselben
          6 Pixel, ragt ein 24er Ball sechs Pixel nach links ueber die
          Textkante hinaus. Im Vergleichsbogen sieht man das sofort:
          Der Ball steht links neben der 1 von "1964".

          Die linke Textkante ist auf dieser Seite die staerkere Kante,
          und die Chronik steht ohnehin im Raster. Also buendig.
        */
        left: "0px",
      }}
    />
  );
}

function Punkt({ y }: { y: number }) {
  return (
    <span
      aria-hidden="true"
      className="absolute left-0 hidden h-3 w-3 rounded-full bg-fisch-black sm:block"
      style={{ top: `${11 + y}px` }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* A  Vier Baelle, alle gleich                                         */
/* ------------------------------------------------------------------ */
/*
 * Der Vorschlag des Auftraggebers, eins zu eins: jeder Punkt wird ein
 * Ball. 24 Pixel statt 12, weil ein Ball bei 12 Pixeln nur noch ein
 * grauer Fleck ist. Die Naehte brauchen Flaeche.
 */
export function ChronikBaelle() {
  return <Rahmen kinder={(i) => <Ball groesse={24} y={PUNKTE_Y[i]} />} />;
}

/* ------------------------------------------------------------------ */
/* B  Nur die letzte Stufe ist ein Ball                                */
/* ------------------------------------------------------------------ */
/*
 * Drei Punkte, ein Ball. Der Ball markiert damit die Gegenwart und
 * nicht die Geschichte: "hier stehen wir jetzt".
 *
 * Vier gleiche Zeichen haben keine Rangfolge, das ist derselbe Grund,
 * aus dem das Band mit vier Zahlenkacheln am 02.09.2026 entfernt wurde.
 */
export function ChronikLetzterBall() {
  return (
    <Rahmen
      kinder={(i) =>
        i === stufen.length - 1 ? (
          <Ball groesse={28} y={PUNKTE_Y[i]} />
        ) : (
          <Punkt y={PUNKTE_Y[i]} />
        )
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* C  Baelle, die groesser werden                                      */
/* ------------------------------------------------------------------ */
/*
 * Vier Baelle von 14 auf 26 Pixel. Damit steckt der Aufstieg zweimal
 * im Bild: in der steigenden Linie und in der wachsenden Groesse.
 *
 * Vorsicht, und deshalb steht es zur Wahl statt fest: Zwei Signale fuer
 * dieselbe Aussage koennen sich auch gegenseitig im Weg stehen. Genau
 * das war der Fehler der alten Treppe, wo Flaeche und Text in
 * verschiedene Richtungen zeigten.
 */
export function ChronikWachsend() {
  const groessen = [14, 18, 22, 26];
  return <Rahmen kinder={(i) => <Ball groesse={groessen[i]} y={PUNKTE_Y[i]} />} />;
}

/* ------------------------------------------------------------------ */
/* D  Anpfiff und Abpfiff                                              */
/* ------------------------------------------------------------------ */
/*
 * Ball am Anfang und am Ende, dazwischen Punkte. Der Weg bekommt damit
 * eine Klammer: 1964 faengt es an, seit 2026 stehen wir hier.
 *
 * Die ruhigste der vier Fassungen, weil nur zwei Stellen Gewicht
 * tragen statt vier.
 */
export function ChronikKlammer() {
  return (
    <Rahmen
      kinder={(i) =>
        i === 0 || i === stufen.length - 1 ? (
          <Ball groesse={24} y={PUNKTE_Y[i]} />
        ) : (
          <Punkt y={PUNKTE_Y[i]} />
        )
      }
    />
  );
}

export const CHRONIK_FASSUNGEN = [
  {
    id: "jetzt",
    name: "Jetzt live",
    satz: "Vier schwarze Punkte mit 12 Pixeln, steigend auf der Linie.",
  },
  {
    id: "baelle",
    name: "A · Vier Bälle",
    satz:
      "Dein Vorschlag, eins zu eins: jeder Punkt wird ein Ball, 24 statt 12 Pixel. Bei 12 wäre er nur ein grauer Fleck.",
  },
  {
    id: "letzter",
    name: "B · Nur der letzte",
    satz:
      "Drei Punkte, ein Ball mit 28 Pixeln. Der Ball markiert die Gegenwart statt die Geschichte: hier stehen wir jetzt.",
  },
  {
    id: "wachsend",
    name: "C · Wachsend",
    satz:
      "Vier Bälle von 14 auf 26 Pixel. Der Aufstieg steckt dann zweimal im Bild, in der Linie und in der Größe.",
  },
  {
    id: "klammer",
    name: "D · Anpfiff und Abpfiff",
    satz:
      "Ball am Anfang und am Ende, dazwischen Punkte. Die ruhigste Fassung, nur zwei Stellen tragen Gewicht.",
  },
] as const;
