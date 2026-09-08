import { cn } from "@/lib/utils";
import type { Ausgang } from "@/lib/ergebnis";

/*
 * S, U oder N als kleines rundes Zeichen, wie auf der Spielplanseite.
 *
 * Lag bis zum 08.09.2026 in components/Fixtures.tsx. Seit der Kopfbereich
 * ebenfalls Ergebnisse zeigt, wird es an zwei Stellen gebraucht, und zwei
 * Fassungen desselben Zeichens laufen frueher oder spaeter auseinander.
 *
 * Das Wort steht als sr-only dabei und nicht nur als Buchstabe. Ein "N" auf
 * dunklem Grund ist fuer ein Vorleseprogramm nichts, und die Farbe allein
 * traegt die Bedeutung ohnehin nicht: Sieg gelb, Unentschieden grau
 * gefuellt, Niederlage nur umrandet. Wer Farben schlecht unterscheidet,
 * erkennt den Unterschied an der Fuellung.
 */
export default function AusgangsZeichen({
  ausgang,
  gross,
}: {
  ausgang: Ausgang;
  gross?: boolean;
}) {
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
        "grid shrink-0 place-items-center rounded-full font-extrabold",
        gross ? "h-8 w-8 text-sm" : "h-6 w-6 text-xs",
        ausgang === "sieg" && "bg-fisch-yellow text-fisch-black",
        ausgang === "unentschieden" && "bg-flaeche-hoch-2 text-text",
        ausgang === "niederlage" && "border border-linie bg-flaeche text-text-leise"
      )}
    >
      <span aria-hidden="true">{beschriftung}</span>
      <span className="sr-only">{langtext}</span>
    </span>
  );
}
