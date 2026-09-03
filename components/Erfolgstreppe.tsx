import chronik from "@/content/chronik.json";

/*
 * Der Übergang vom gelben Terminband in die Nachrichten, als Treppe.
 *
 * Vorher stieß hier Gelb hart auf Schwarz. Statt das mit einer Diagonale oder
 * einem Verlauf zu kaschieren, trägt der Übergang jetzt Inhalt: Jede Stufe ist
 * ein Erfolgsschritt des Vereins, von der Gründung 1964 links bis zur
 * Kreisliga B rechts. Die Stufen werden nach rechts flacher, die Schrift steht
 * jeweils unten, damit die Zeilen selbst nach oben steigen. Der Verein steigt
 * auf, und die Form sagt dasselbe wie der Text.
 *
 * WO ES HÄNGT, und das ist kein Behelf:
 * Das Terminband steckt im Hero, und der Hero hat overflow-hidden, damit das
 * angeschnittene Wappen nicht über die Seite hinausläuft. Ein Überstand kann
 * also nicht aus dem Band herauswachsen. Die Treppe hängt deshalb oben am
 * Nachrichtenbereich, sitzt dort direkt unter dem Band und sieht aus, als käme
 * sie von oben. Der Hero bleibt unangetastet.
 *
 * WOHER DIE ZAHLEN KOMMEN:
 * Aus der FuPa-Chronik der ersten Mannschaft, nicht aus dem Gedächtnis. Die
 * vollständige Saisontabelle steht als Beleg in content/chronik.json, mit
 * Quelle und Abrufdatum. Wer eine Stufe ändert, prüft sie dort.
 *
 * Beim Anlegen kam heraus, dass eine kursierende Angabe nicht stimmt: Für die
 * Jahre 2015 bis 2023 war von einer Kreisliga D die Rede. In der Chronik
 * kommt eine Kreisliga D überhaupt nicht vor, dort stehen Reserveklasse II
 * Trier-Saarburg und in 17/18 und 18/19 Kreisliga C Saar. Die Stufe nennt
 * deshalb, was belegt ist.
 */

/*
 * Die Höhen fallen nach rechts ab. Sie stehen hier und nicht in der Schleife,
 * weil sie eine Gestaltungsentscheidung sind und keine Eigenschaft der Daten:
 * Vier Stufen, gleichmäßig um 28 Pixel abnehmend, damit die Kante als Treppe
 * lesbar bleibt und nicht als Zufall.
 *
 * Die flachste Stufe ist die JÜNGSTE, also die wichtigste, und hat damit den
 * wenigsten Platz. Das ist der Preis dafür, dass die Treppe nach oben führt.
 * Erster Versuch war deshalb falsch gebaut: Dort trug jede Stufe zusätzlich
 * einen ganzen Satz, und auf der obersten lief er aus dem Gelb heraus. Jetzt
 * tragen alle Stufen genau zwei kurze Zeilen, und die passen auch in 64 Pixel.
 * Was mehr braucht, gehört in eine Nachricht und nicht in einen Übergang.
 */
const HOEHEN = ["h-[148px]", "h-[120px]", "h-[92px]", "h-[64px]"];

export default function Erfolgstreppe() {
  const stufen = chronik.stufen;

  return (
    <div aria-labelledby="erfolgstreppe-titel" className="relative">
      <h2 id="erfolgstreppe-titel" className="sr-only">
        Der Weg des SV Fisch
      </h2>
      {/*
        Auf schmalen Bildschirmen wird aus der Treppe ein Raster mit zwei
        Spalten und gleicher Höhe. Vier Stufen nebeneinander auf einem Handy
        wären je 90 Pixel breit, darin steht kein Satz. Die Silhouette geht
        dabei verloren, der Inhalt nicht, und das ist die richtige Reihenfolge.
      */}
      <ol className="grid grid-cols-2 sm:flex sm:items-stretch">
        {stufen.map((stufe, i) => (
          <li
            key={stufe.jahr}
            className={`flex flex-col justify-end bg-fisch-yellow px-4 pb-3 pt-4 text-fisch-black sm:flex-1 sm:px-5 sm:pb-4 ${
              HOEHEN[i] ?? HOEHEN[HOEHEN.length - 1]
            } min-h-[96px] sm:min-h-0`}
          >
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] opacity-80">
              {stufe.jahr}
            </p>
            <p className="font-display text-[15px] font-extrabold leading-tight sm:text-base">
              {stufe.titel}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
