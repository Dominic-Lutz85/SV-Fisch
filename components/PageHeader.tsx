interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  /*
   * Auf dunklem Grund muss der Seitenkopf eine Stufe hoeher liegen als die
   * Seite, sonst verschmilzt er mit dem Inhalt darunter. Auf der hellen
   * Fassung war er der schwarze Kontrastblock.
   */
  return (
    <section className="border-b-4 border-fisch-yellow bg-flaeche-hoch text-text">
      <div className="container-fisch py-14 sm:py-20">
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
    </section>
  );
}
