import chronik from "@/content/chronik.json";

/*
 * Der Ligaverlauf als Kurve zwischen Kopfbereich und Nachrichten:
 * fuenfzehn belegte Saisons, die Hoehe ist die Spielklasse.
 *
 * DIESE DATEI ERSETZT AM 22.09.2026 components/Erfolgstreppe.tsx.
 * Der Auftraggeber zu deren letzter Fassung: "mir gefaellt das Layout bzw
 * Design dieser fetten gelben Spalte ueberhaupt nicht". Vorgelegt wurden
 * vier Richtungen, gewaehlt wurde "01 Die echte Kurve".
 *
 * WAS VORHER HIER STAND, in Kurzform, damit niemand rueckwaerts baut:
 * eine Treppe aus vier Saeulen (erst fallend, dann steigend), danach eine
 * flache gelbe Flaeche mit vier Baellen auf einer steigenden Linie. Die
 * lange Begruendung dieser Zwischenschritte ist mit der alten Datei
 * gegangen; sie half beim naechsten Umbau nicht mehr, weil sie eine Form
 * begruendete, die es nicht mehr gibt. Ein Kommentar, der einen
 * aufgehobenen Zustand begruendet, wird beim naechsten Mal als Vorgabe
 * gelesen, und genau das ist an dieser Stelle schon zweimal passiert.
 *
 * WARUM DIE KURVE UND NICHT NUR EIN ANDERES BAND: Sie loest zwei Sachen
 * auf einmal.
 *
 * Erstens die Optik. Das gelbe Band war eine deckende Flaeche ueber die
 * volle Breite zwischen zwei schwarzen Bereichen, also zwei Farbwechsel
 * auf 145 Pixeln. Diese Fassung hat keinen: Der Grund ist
 * --color-flaeche, #0a0a0a, derselbe Wert wie die Seite darum. Uebrig
 * bleiben eine feine Oberkante und eine gelbe Linie.
 *
 * Zweitens, und das wiegt schwerer, der Inhalt. Die vier Stufen
 * glaetteten den Weg: "bis 2023: Reserveklasse und Kreisliga C" liest
 * sich wie ein stetiger Aufstieg. In der FuPa-Chronik steht etwas
 * anderes. In 17/18 und 18/19 spielte der Verein bereits Kreisliga C,
 * danach vier Saisons Reserveklasse, erst 23/24 wieder Kreisliga C. Der
 * Rueckfall stand seit dem 08.09.2026 als offener Punkt im Quelltext der
 * alten Datei, mit dem Vermerk, er sei "am Text zu loesen, nicht an der
 * Form". Das war falsch herum gedacht: Die Form ist hier der ehrlichere
 * Ort, weil eine Kurve, die faellt, nichts beschoenigen kann.
 *
 * Ein Verein, der einen Rueckschlag ueberstanden hat und trotzdem
 * aufsteigt, ist ausserdem die bessere Geschichte als einer, der immer
 * stieg.
 *
 * WAS DIE KURVE NICHT ZEIGT: Die Chronik beginnt 2012/13. Die Gruendung
 * 1964 passt nicht auf diese Zeitachse, ohne dass die letzten fuenfzehn
 * Jahre zu einem Strich am rechten Rand zusammenfallen.
 *
 * Sichtbar steht sie deshalb gar nicht in diesem Block, und das ist kein
 * Versehen: Auf demselben Bildschirm steht 1964 bereits in der
 * Kopfleiste und im Kopfbereich. Genau diese Haeufung hat am 02.09.2026
 * schon einmal ein Zahlenband gekostet. Die Spanne rechts oben sagt, ab
 * wann die Kurve belegt ist; der Zusammenhang mit 1964 steht im
 * Vorlesetext am Ende dieser Datei, wo er niemandem im Weg ist.
 *
 * KEINE BEHAUPTUNG "ERSTMALS KREISLIGA B": Die alte Stufe sagte das, die
 * fuenfzehn belegten Saisons tragen es aber nicht. Sie reichen bis 2012,
 * der Verein besteht seit 1964. Was dazwischen liegt, weiss die Chronik
 * nicht. Wenn der Verein bestaetigt, dass es der erste Aufstieg in die
 * Kreisliga B ueberhaupt ist, gehoert das hier hinein und ist dann auch
 * einen eigenen Satz wert.
 */

/*
 * WARUM TEXT UND PUNKTE NICHT IM SVG STEHEN, sondern daneben als HTML.
 *
 * Ein SVG mit viewBox und width:100% skaliert alles mit, auch die
 * Schrift. Gerechnet fuer die erste Fassung: viewBox 900 breit, auf einem
 * Handy mit 358 Pixeln Innenbreite ist der Massstab 0,40. Aus 10 Pixeln
 * Schrift werden 4. Umgekehrt waere die Grafik auf einem breiten Schirm
 * 190 Pixel hoch geworden, also hoeher als das Band, das sie ersetzt.
 *
 * Deshalb traegt das SVG nur die Geometrie, mit preserveAspectRatio
 * "none": Es zieht sich auf jede Breite, die Hoehe bleibt fest. Damit die
 * Linie dabei nicht mitverzerrt, steht an jedem Strich
 * vector-effect="non-scaling-stroke"; das ist genau der Zweck dieses
 * Attributs.
 *
 * Punkte und Beschriftungen liegen als gewoehnliche Elemente darueber,
 * in Prozent gesetzt. Punkte bleiben dadurch rund statt oval, Text
 * bleibt Text: auswaehlbar, in der Schriftgroesse des Nutzers und in
 * einer Groesse, die auf 360 wie auf 1920 Pixeln dieselbe ist.
 */

/*
 * Die drei belegten Spielklassen, von unten nach oben.
 *
 * Die Zuordnung liest die Liga-Angabe aus content/chronik.json und
 * nimmt sie NICHT als feste Liste hier herein. Der Unterschied zaehlt:
 * Wer eine Saison ergaenzt, ergaenzt sie an einer Stelle, und die Kurve
 * folgt. Eine zweite Liste im Quelltext waere nach der ersten Saison
 * auseinandergelaufen.
 */
const EBENEN = ["Reserveklasse", "Kreisliga C", "Kreisliga B"] as const;

function ebeneVon(liga: string): number {
  const treffer = EBENEN.findIndex((name) => liga.startsWith(name));
  /*
   * Kein stiller Rueckfall auf 0. Eine unbekannte Liga waere sonst als
   * Reserveklasse gezeichnet, und die Kurve zeigte einen Absturz, den es
   * nie gab. Beim Bauen abbrechen ist hier das mildere Mittel: Es faellt
   * sofort auf und nicht erst jemandem im Verein.
   */
  if (treffer < 0) {
    throw new Error(
      `Ligaverlauf: "${liga}" passt zu keiner bekannten Spielklasse. ` +
        `Bekannt sind: ${EBENEN.join(", ")}. Entweder in content/chronik.json ` +
        `die Schreibweise pruefen oder die Klasse hier in EBENEN ergaenzen.`
    );
  }
  return treffer;
}

/*
 * Hoehe der Zeichenflaeche in Pixeln.
 *
 * 72 ergibt 36 Pixel zwischen den drei Hilfslinien. Das ist der
 * Abstand, ab dem ein Sprung um eine Klasse als Sprung gelesen wird und
 * nicht als Wackeln in der Linie.
 *
 * Nach oben begrenzt es das, was der Block ersetzt: Das gelbe Band war
 * 145 Pixel hoch. Die erste Fassung dieser Kurve kam auf 205 und war
 * damit das groessere Uebel, obwohl sie ruhiger aussah. Gekuerzt wurde
 * an drei Stellen, nicht an der Grafik allein: 84 auf 72 Pixel
 * Zeichenflaeche, py-6 auf py-4, und die Fusszeile mit der Zeitspanne
 * ist in die Kopfzeile gewandert, wo rechts ohnehin Platz war. Der
 * gemessene Wert steht in der Commit-Nachricht.
 */
const HOEHE = 72;

/* Halbe Punktgroesse plus Reserve. Der oberste und der unterste Punkt
   sitzen auf 0 und 100 Prozent und ragen zur Haelfte hinaus; ohne diesen
   Rand wuerden sie von der Oberkante beschnitten. */
const RAND = 7;

export default function Ligaverlauf() {
  /*
   * chronik.json steht absteigend, neueste Saison zuerst, weil es so
   * auch bei FuPa steht und sich so leichter mit der Quelle vergleichen
   * laesst. Die Zeitachse laeuft andersherum.
   */
  const saisons = [...chronik.saisons].reverse().map((s) => ({
    saison: s.saison,
    ebene: ebeneVon(s.liga),
  }));

  const letzte = saisons.length - 1;
  const x = (i: number) => (i / letzte) * 100;
  /* Ebene 2 (oben) ergibt 0 Prozent, Ebene 0 (unten) 100. */
  const y = (ebene: number) => ((EBENEN.length - 1 - ebene) / (EBENEN.length - 1)) * 100;

  const pfad = saisons
    .map((s, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)} ${y(s.ebene).toFixed(2)}`)
    .join(" ");

  /*
   * Der Text fuer Vorleseprogramme. Er beschreibt den Verlauf in Worten,
   * weil eine Linie nichts vorzulesen hat. Zusammengesetzt aus den Daten
   * und nicht von Hand geschrieben: Ein Satz, der beim Ergaenzen einer
   * Saison stehen bliebe, waere nach einem Jahr falsch.
   */
  const verlaufSatz = saisons
    .map((s) => `${s.saison} ${EBENEN[s.ebene]}`)
    .join(", ");

  return (
    /*
     * Kein eigener Hintergrund, gemessen rgba(0,0,0,0): Der Seitengrund
     * scheint durch. Eine eigene Flaeche waere hier eine Flaeche auf
     * gleichfarbigem Grund, denn --color-flaeche und --color-fisch-black
     * sind beide #0a0a0a. Was den Block abgrenzt, ist die Linie oben,
     * und das genuegt.
     */
    <section
      aria-labelledby="ligaverlauf-titel"
      className="border-t border-flaeche-hoch-2"
    >
      <div className="container-fisch py-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="ligaverlauf-titel"
            className="font-display text-[11px] font-extrabold uppercase tracking-[0.2em] text-text"
          >
            Der Weg des SV Fisch
          </h2>
          {/*
            Zeitspanne und Quelle stehen zusammen rechts. Die Spanne lag
            bis zur Messung vom 22.09.2026 als eigene Fusszeile unter der
            Kurve und kostete dort 22 Pixel Hoehe, waehrend hier oben
            rechts Platz frei stand.

            Die Quelle steht sichtbar auf der Seite und nicht nur im
            Quelltext. Vereinszahlen, die jemand nachpruefen kann, sind
            die Stelle, an der sich nichts behaupten laesst.

            Auf dem Handy faellt die Spanne weg: Titel und Spanne und
            Quelle sind zusammen rund 280 Pixel breit, bei 358 Pixeln
            Innenbreite wird daraus ein Umbruch.
          */}
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-leise">
            <span className="hidden sm:inline">
              {saisons[0].saison} – {saisons[letzte].saison} ·{" "}
            </span>
            Quelle FuPa
          </p>
        </div>

        {/*
          Zwei Spalten: links die Spielklassen, rechts die Kurve. Beide
          Spalten sind gleich hoch und rechnen mit denselben
          Prozentwerten, deshalb liegt jede Beschriftung genau auf ihrer
          Hilfslinie.

          min-w-0 an der rechten Spalte: Ein Grid-Feld hat von sich aus
          min-width:auto und schrumpft nicht unter seinen Inhalt. Ohne das
          hier schiebt die Kurve die Beschriftungsspalte aus dem Bild.
          Dieselbe Falle ist auf dieser Seite schon dreimal zugeschnappt.
        */}
        <div
          className="mt-3 grid gap-x-3"
          style={{ gridTemplateColumns: "auto minmax(0, 1fr)" }}
        >
          <div className="relative" style={{ height: `${HOEHE + 2 * RAND}px` }}>
            {/*
              DER PLATZHALTER IST NICHT UEBERFLUESSIG, auch wenn er nichts
              anzeigt. Die drei Beschriftungen darunter stehen absolut,
              damit jede genau auf ihrer Hilfslinie sitzt. Absolut gesetzte
              Elemente sind aber aus dem Fluss und geben der Spalte keine
              Breite: Die auto-Spalte war dadurch 0 Pixel breit, und die
              Beschriftungen ragten nach links aus dem Bild.

              Auf einem breiten Schirm fiel das nicht auf, weil der
              Innenabstand des Containers zufaellig ausreichte. Gemessen
              bei 375 Pixeln stand von "Reserveklasse" noch "SSE" da, der
              Rest lag bei Position -78.

              Der Platzhalter laeuft im Fluss mit, traegt das laengste der
              drei Woerter und ist unsichtbar statt entfernt: invisible
              nimmt Platz ein, hidden nicht. Er muss dieselbe Schrift und
              dieselben Groessen tragen wie die echten Beschriftungen,
              sonst misst er die falsche Breite.
            */}
            <span
              aria-hidden="true"
              className="invisible block whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]"
            >
              {EBENEN.reduce((a, b) => (b.length > a.length ? b : a))}
            </span>

            {EBENEN.map((name, ebene) => (
              <span
                key={name}
                className="absolute right-0 -translate-y-1/2 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.1em] text-text-leise sm:text-[11px]"
                style={{ top: `${RAND + (y(ebene) / 100) * HOEHE}px` }}
              >
                {name}
              </span>
            ))}
          </div>

          <div
            className="relative min-w-0"
            style={{ height: `${HOEHE + 2 * RAND}px` }}
          >
            {/*
              Das SVG traegt nur Hilfslinien und Kurve. Es sitzt um RAND
              eingerueckt, damit die Punkte darueber mit ihrer halben
              Groesse nicht aus dem Block ragen.
            */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              /*
                w-full und NICHT inset-x-0. Der Unterschied ist gemessen:
                Mit inset-x-0 war die Kurve 72 statt 1286 Pixel breit und
                klebte als Gezacke am linken Rand. Ein absolut gesetztes
                div zieht sich zwischen left:0 und right:0 auf, ein SVG
                nicht: Es hat ein eigenes Standardmass, und width:auto
                loest dort darauf auf statt auf die Breite des Elters.

                Aufgefallen ist es nur beim Nachmessen. Die Punkte sassen
                bereits richtig, weil sie HTML sind und in Prozent
                stehen; falsch lag allein die Linie darunter.
              */
              className="absolute left-0 w-full"
              style={{ top: `${RAND}px`, height: `${HOEHE}px` }}
            >
              {EBENEN.map((name, ebene) => (
                <line
                  key={name}
                  x1="0"
                  y1={y(ebene)}
                  x2="100"
                  y2={y(ebene)}
                  stroke="#2c2c2c"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              <path
                d={pfad}
                fill="none"
                stroke="#f3da0b"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/*
              Die Punkte. Der letzte ist gefuellt und groesser, weil er
              der Stand von heute ist; die uebrigen sind Ringe, damit die
              Linie durch sie hindurch sichtbar bleibt.

              Beschriftet wird keiner. Der Rueckfall 19/20 braucht keinen
              Pfeil: Die Linie faellt dort um eine Klasse, und das ist
              der ganze Grund, diese Fassung zu bauen. Wer eine gefallene
              Linie erst beschriftet, traut ihr nicht.
            */}
            {saisons.map((s, i) => {
              const ende = i === letzte;
              const groesse = ende ? 11 : 7;
              return (
                <span
                  key={s.saison}
                  className="absolute rounded-full border-2 border-fisch-yellow"
                  style={{
                    width: `${groesse}px`,
                    height: `${groesse}px`,
                    background: ende ? "#f3da0b" : "#0a0a0a",
                    left: `${x(i)}%`,
                    top: `${RAND + (y(s.ebene) / 100) * HOEHE}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              );
            })}
          </div>

        </div>

        {/* Für Vorleseprogramme: die Linie in Worten. */}
        <p className="sr-only">
          Ligazugehörigkeit des SV Fisch, {saisons.length} belegte Saisons: {verlaufSatz}.
          Der Verein wurde 1964 gegründet, die Chronik beginnt {saisons[0].saison}.
        </p>
      </div>
    </section>
  );
}
