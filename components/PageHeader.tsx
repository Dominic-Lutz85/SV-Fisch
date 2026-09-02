import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /*
   * Steht auf breiten Bildschirmen rechts neben der Ueberschrift, darunter auf
   * schmalen. Gedacht fuer den Hauptsponsor auf Spielplan und Tabelle, siehe
   * components/PraesentiertVon.tsx. Der Platz war vorher ohnehin leer: die
   * Ueberschrift ist ein Wort, die rechte Haelfte der Zeile blieb schwarz.
   */
  beiwerk?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  beiwerk,
}: PageHeaderProps) {
  /*
   * Auf dunklem Grund muss der Seitenkopf eine Stufe hoeher liegen als die
   * Seite, sonst verschmilzt er mit dem Inhalt darunter. Auf der hellen
   * Fassung war er der schwarze Kontrastblock.
   */
  return (
    <section className="border-b-4 border-fisch-yellow bg-flaeche text-text">
      <div className="container-fisch flex flex-col gap-8 py-14 sm:py-20 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div>
          {eyebrow && (
            <p className="text-sm font-bold uppercase tracking-wider text-fisch-yellow">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-text-leise sm:text-lg">
              {description}
            </p>
          )}
        </div>
        {beiwerk && <div className="shrink-0">{beiwerk}</div>}
      </div>
    </section>
  );
}
