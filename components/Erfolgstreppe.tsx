import Image from "next/image";
import chronik from "@/content/chronik.json";

/*
 * Die Vereinschronik als gelbes Band zwischen Kopfbereich und Nachrichten:
 * von der Gründung 1964 links bis zur Kreisliga B rechts.
 *
 * UMGEBAUT AM 08.09.2026. Die Datei heißt weiter Erfolgstreppe, eine
 * Treppe ist sie aber nicht mehr. Warum, und was vorher hier stand:
 *
 * ERSTE FASSUNG: vier Säulen, die von oben herunterhingen und nach rechts
 * flacher wurden (148, 120, 92, 64 Pixel). Der Text stieg dadurch an, die
 * Fläche nahm ab. Wer den Text nicht las, sah einen Verein, der kleiner
 * wird.
 *
 * ZWEITE FASSUNG, 07.09.2026: dieselben Säulen auf einer gemeinsamen
 * Grundlinie, nach oben wachsend (72, 104, 136, 168). Damit zeigten
 * Fläche und Text in dieselbe Richtung. Diese Fassung ist nie live
 * gegangen und wurde durch die hier ersetzt.
 *
 * WARUM AUCH DIE ZWEITE FASSUNG NICHT REICHTE, und das ist der Kern:
 * Der Auftraggeber nannte den Bereich unruhig, bevor eine einzige Zahl
 * vorlag. Nachgemessen am 08.09.2026 auf der Live-Seite bei 1920 Pixeln
 * lagen zwischen dem Ende des Kopfbereichs und dem Beginn der
 * Nachrichten 230 Pixel mit
 *
 *   vier Farbwechseln (schwarz, #1f1f1f, Vereinsgelb, schwarz),
 *   fünf Unterkanten,
 *   acht Textgrundlinien,
 *   vier verschiedenen linken Rasterkanten.
 *
 * Das Problem steckte also nicht in der Treppe allein, sondern im Stapel
 * aus Terminband, Treppe und Nachrichten. Eine Treppe bringt von sich aus
 * so viele Kanten mit, wie sie Stufen hat. Solange sie im Stapel steht,
 * bleibt der Bereich unruhig, egal in welche Richtung sie läuft.
 *
 * DIESE FASSUNG: eine Fläche, eine Unterkante, eine Grundlinie für alle
 * vier Texte. Der Aufstieg steckt in vier Punkten, die auf einer Linie
 * steigen, also in drei Pixeln Linie statt in 148 Pixeln Fläche.
 * Gemessen: von vier linken Rasterkanten auf eine, von acht Grundlinien
 * auf drei.
 *
 * Zusammen mit dem Termin, der jetzt im Fuß des Kopfbereichs steht statt
 * als eigenes Band darunter (siehe Hero.tsx), sind es zwei Farbwechsel
 * statt vier.
 *
 * WOHER DIE ZAHLEN KOMMEN:
 * Aus der FuPa-Chronik der ersten Mannschaft, nicht aus dem Gedächtnis.
 * Die vollständige Saisontabelle steht als Beleg in content/chronik.json,
 * mit Quelle und Abrufdatum. Wer eine Stufe ändert, prüft sie dort.
 *
 * Beim Anlegen kam heraus, dass eine kursierende Angabe nicht stimmt: Für
 * die Jahre 2015 bis 2023 war von einer Kreisliga D die Rede. In der
 * Chronik kommt eine Kreisliga D überhaupt nicht vor, dort stehen
 * Reserveklasse II Trier-Saarburg und in 17/18 und 18/19 Kreisliga C
 * Saar. Die Stufe nennt deshalb, was belegt ist.
 *
 * OFFEN, UND ES IST KEIN GESTALTUNGSPUNKT: Diese vier Stufen glätten den
 * Weg. In 17/18 und 18/19 spielte der Verein bereits Kreisliga C, danach
 * vier Saisons Reserveklasse, erst 23/24 wieder Kreisliga C. Der Weg hat
 * also einen Rücksprung, den "bis 2023 Reserveklasse und Kreisliga C"
 * verschweigt. Das steht als eigener Punkt in der Projektnotiz und wird
 * am Text gelöst, nicht an der Form.
 */

/*
 * HÖHE DES BANDES, angepasst am 08.09.2026: Der Auftraggeber fand die
 * gelbe Leiste "viel zu hoch also dick". Gemessen war sie 185 Pixel.
 *
 * Gekürzt wurde an drei Stellen, nicht an einer: der Innenabstand des
 * Bandes von 32 auf 20 Pixel, der Abstand zur Kopfzeile von 28 auf 20,
 * und der Platz über den Bällen von 44 auf 32. Zusammen rund 45 Pixel.
 *
 * Warum nicht einfach die Bälle kleiner: Sie tragen den Anstieg. Wird
 * der kleinste unter 18 Pixel groß, verschwinden seine Nähte, und dann
 * ist er wieder nur ein Fleck.
 *
 * Der Platz über den Bällen ist die Untergrenze und kein runder Wert:
 * Der größte Ball hat 30 Pixel und sitzt 11 Pixel über der Grundlinie,
 * reicht also von -9 bis 21. Bei 32 Pixeln Innenabstand bleiben 11
 * Pixel Luft zur Jahreszeile. Wer weiter kürzt, schiebt den Ball in
 * die Schrift.
 */

/*
 * Wie weit die vier Bälle über und unter der gedachten Grundlinie
 * sitzen, in Pixeln. Sie stehen hier und nicht in den Daten, weil sie
 * eine Gestaltungsentscheidung sind: gleichmäßig um 7 Pixel steigend,
 * damit die Reihe als Anstieg lesbar ist und nicht als Zufall.
 *
 * 17 ist der Bezugspunkt: die frühere Linie lag bei top-4, also 16
 * Pixel, plus ihre halbe Stärke.
 */
const PUNKTE_Y = [10, 3, -4, -11];

/*
 * Die Größen der Bälle, von links nach rechts wachsend.
 *
 * 18 bis 30 und nicht 14 bis 26: Bei 14 Pixeln verschwinden die Nähte
 * des Balls und übrig bleibt ein Fleck. Das war beim Vergleichen am
 * 08.09.2026 deutlich zu sehen und ist derselbe Fehler, den der
 * Auftraggeber vorher schon an zu kleinen Motiven angestrichen hatte.
 *
 * Der Aufstieg steckt damit zweimal im Bild, in der steigenden Reihe
 * und in der wachsenden Größe. Das ist Absicht und der Unterschied zur
 * alten Treppe, bei der Fläche und Text in verschiedene Richtungen
 * zeigten.
 */
const BALL_GROESSEN = [18, 22, 26, 30];

/*
 * Der Bezugspunkt, um den die Bälle steigen, in Pixeln von der Oberkante
 * des Eintrags.
 *
 * 12 und nicht 17, und das ist nachgemessen: Beim Kürzen des Bandes am
 * 08.09.2026 lag der ERSTE Ball plötzlich 4 Pixel auf der Jahreszeile.
 * Mein Rechenfehler dabei war, den größten Ball zu prüfen. Der sitzt
 * aber am höchsten. Der tiefste ist der kleinste, weil er 10 Pixel
 * unter dem Bezugspunkt liegt.
 *
 * Wer hier etwas ändert, prüft den ERSTEN Ball gegen die Jahreszeile,
 * nicht den letzten.
 */
const BALL_BEZUG = 12;

export default function Erfolgstreppe() {
  const stufen = chronik.stufen;

  return (
    <div aria-labelledby="erfolgstreppe-titel" className="bg-fisch-yellow text-fisch-black">
      <h2 id="erfolgstreppe-titel" className="sr-only">
        Der Weg des SV Fisch
      </h2>

      <div className="container-fisch py-5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] opacity-70">
            Der Weg des SV Fisch
          </p>
          {/*
            Die Quelle steht sichtbar auf der Seite und nicht nur im
            Quelltext. Vereinszahlen, die jemand nachprüfen kann, sind die
            Stelle, an der sich nichts behaupten lässt.
          */}
          <p className="hidden text-[11px] font-bold uppercase tracking-[0.16em] opacity-50 sm:block">
            Quelle FuPa
          </p>
        </div>

        {/*
          Auf schmalen Bildschirmen wird aus der Reihe ein Raster mit zwei
          Spalten, und Linie und Punkte entfallen. Vier Punkte auf 350
          Pixeln wären 90 Pixel auseinander, das liest sich nicht mehr als
          Anstieg. Die Zeitfolge bleibt trotzdem lesbar, sie steht ja in
          den Jahreszahlen.

          sm:pt-10 sind 40 Pixel und nachgemessen: Der tiefste Punkt sitzt
          bei top 21 und ist 12 Pixel hoch, endet also bei 33. Bei 28
          Pixeln Innenabstand begann die Jahreszahl darunter, der Punkt lag
          auf ihr.
        */}
        <ol className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:mt-5 sm:grid-cols-4 sm:gap-8">
          {stufen.map((stufe, i) => (
            <li key={stufe.jahr} className="relative sm:pt-8">
              {/*
                KEINE LINIE MEHR. Hier lief bis zum 08.09.2026 eine
                dünne schwarze Linie hinter den Markierungen durch.
                
                Sie war das Traggerüst, solange dort vier gleich große
                Punkte saßen: Erst sie machte aus vier Punkten eine
                Reihe. Seit die Bälle von 18 auf 30 Pixel wachsen,
                tragen sie den Anstieg selbst, und die Linie stand
                daneben, ohne noch etwas beizusteuern. Sie lief
                außerdem rechts über den letzten Ball hinaus ins Leere,
                genau der Fehler, der im Kopfbereich schon einmal
                angestrichen wurde.
                
                Der Preis ist echt und soll hier stehen: Ohne Linie ist
                der Bezug zwischen den Bällen loser, auf einem breiten
                Bildschirm liegen 304 Pixel dazwischen. Das Auge stellt
                die Reihe selbst her, und dafür müssen die Bälle groß
                genug bleiben.
              */}
              <Image
                src="/fussball.png"
                alt=""
                width={96}
                height={96}
                aria-hidden="true"
                className="absolute left-0 hidden sm:block"
                style={{
                  width: `${BALL_GROESSEN[i]}px`,
                  height: `${BALL_GROESSEN[i]}px`,
                  top: `${BALL_BEZUG + (PUNKTE_Y[i] ?? 0) - BALL_GROESSEN[i] / 2}px`,
                }}
              />
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
