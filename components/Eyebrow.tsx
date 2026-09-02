import { cn } from "@/lib/utils";

/*
 * Kleine Überschrift über einer Abschnitts-Überschrift ("AKTUELLES", "1. MANNSCHAFT").
 *
 * Warum es diesen Baustein gibt: Vereinsgelb als Schriftfarbe funktioniert nur auf
 * Schwarz. Auf dem hellen Untergrund lag dieselbe Zeile bei 1,66 zu 1 gemessen,
 * gefordert sind 4,5. Am Farbton zu drehen löst das nicht, denn auf hellem Grund
 * entsteht Auffälligkeit durch Helligkeit und Lesbarkeit durch Dunkelheit, das ist
 * derselbe Regler in zwei Richtungen. Deshalb wird auf Hell die FLÄCHE gelb und die
 * Schrift schwarz. Dieselbe Lösung benutzt der BVB für seine Ressort-Marker.
 *
 * Wer hier eine dritte Variante ergänzt: vorher den Kontrast im Browser nachrechnen,
 * nicht nach Augenmaß entscheiden.
 */

interface EyebrowProps {
  children: React.ReactNode;
  /** "hell" = Abschnitt auf Off-White, "dunkel" = Abschnitt auf Vereinsschwarz */
  on?: "hell" | "dunkel";
  className?: string;
}

export default function Eyebrow({ children, on = "hell", className }: EyebrowProps) {
  if (on === "dunkel") {
    // Gelb auf Schwarz: 13,99 zu 1, das trägt ohne Fläche.
    return (
      <p
        className={cn(
          "text-sm font-bold uppercase tracking-wider text-fisch-yellow",
          className
        )}
      >
        {children}
      </p>
    );
  }

  return (
    <p className={cn("flex", className)}>
      <span className="inline-block rounded-full bg-fisch-yellow px-3 py-1 text-xs font-bold uppercase tracking-wider text-fisch-black">
        {children}
      </span>
    </p>
  );
}
