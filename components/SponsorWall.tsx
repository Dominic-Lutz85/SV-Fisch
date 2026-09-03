import Image from "next/image";
import type { Sponsor } from "@/types/content";

const stufenReihenfolge: Sponsor["stufe"][] = ["Hauptsponsor", "Co-Sponsor"];

/*
 * Die Ueberschrift steht getrennt vom Wert, weil der Wert an einem einzelnen
 * Sponsor haengt und die Ueberschrift ueber einer Gruppe steht. "Co-Sponsor"
 * ist der eine, "Co-Sponsoren" sind die acht.
 */
const stufenTitel: Record<Sponsor["stufe"], string> = {
  Hauptsponsor: "Hauptsponsor",
  "Co-Sponsor": "Co-Sponsoren",
};

/*
 * Sponsorenwand als Verzeichnis, nicht als Logowand.
 *
 * Vorher standen hier neun helle Plättchen in einem Raster, alle gleich laut.
 * Das war sauber gebaut und hat trotzdem niemandem etwas gegeben: Ein Logo
 * ohne Zusammenhang ist ein Aufkleber. Jetzt steht unter jedem Logo, was die
 * Firma macht und wo sie sitzt. Damit wird die Seite für jemanden aus dem Ort
 * nützlich, und der Sponsor bekommt eine echte Gegenleistung.
 *
 * Zur Herkunft der Sätze: Jeder stammt von der Internetseite der jeweiligen
 * Firma, keiner ist ausgedacht. Die Regel dazu steht bei `beschreibung` in
 * types/content.ts, weil sie dort niemand übersieht, der einen Sponsor
 * ergänzt.
 *
 * Warum die Logos weiterhin auf einer hellen Platte liegen: Fünf der neun sind
 * schwarze oder dunkelgraue Schrift ohne eigenen Hintergrund und wären auf
 * #1f1f1f so gut wie unsichtbar. Ein fremdes Logo umzufärben kommt nicht in
 * Frage, die Marke gehört dem Sponsor. Vereine mit dunkler Seite lösen das
 * durchweg genauso. Neu ist nur, dass die Platte jetzt der Kopf einer Karte
 * ist und nicht die ganze Kachel.
 *
 * Die Platte hat eine feste Höhe und das Logo wird hineingerechnet. Mit fester
 * Höhe plus automatischer Breite bestimmt sonst das Seitenverhältnis die
 * Fläche, und ein flaches Logo wie Roth Munch (220 zu 46) wird dreimal so
 * breit wie ein hohes wie Brocker Holzbau (288 zu 167).
 */

/* Der Hauptsponsor liegt quer über die ganze Breite, mit Logo links. */
function HauptKarte({ sponsor }: { sponsor: Sponsor }) {
  return (
    <SponsorRahmen sponsor={sponsor} className="sm:col-span-2 lg:col-span-3">
      <div className="flex flex-col sm:flex-row">
        <div className="flex shrink-0 items-center justify-center bg-fisch-white p-6 sm:w-72 lg:w-80">
          <Image
            src={sponsor.logo}
            alt={`Logo ${sponsor.name}`}
            width={sponsor.breite}
            height={sponsor.hoehe}
            className="h-24 w-full object-contain sm:h-28"
          />
        </div>
        <div className="flex flex-col justify-center gap-2 p-6 sm:p-7">
          {/*
            Hier stand noch einmal "Hauptsponsor". Die Ueberschrift ueber der
            Karte sagt das bereits, zwei Zeilen weiter oben und in derselben
            Blickachse. Doppelt gesagt wirkt es nicht wichtiger, sondern
            unaufgeraeumt.
          */}
          <p className="font-display text-xl font-extrabold leading-tight text-text underline-offset-4 group-hover:underline group-hover:decoration-fisch-yellow group-hover:decoration-2 sm:text-2xl">
            {sponsor.name}
          </p>
          <p className="max-w-prose text-sm leading-relaxed text-text-leise">
            {sponsor.beschreibung}
          </p>
          {sponsor.ort && <Ortszeile ort={sponsor.ort} />}
        </div>
      </div>
    </SponsorRahmen>
  );
}

function MitKarte({ sponsor }: { sponsor: Sponsor }) {
  return (
    <SponsorRahmen sponsor={sponsor}>
      <div className="flex h-full flex-col">
        <div className="flex h-24 shrink-0 items-center justify-center bg-fisch-white p-4">
          <Image
            src={sponsor.logo}
            alt={`Logo ${sponsor.name}`}
            width={sponsor.breite}
            height={sponsor.hoehe}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <p className="font-display text-[15px] font-bold leading-snug text-text underline-offset-4 group-hover:underline group-hover:decoration-fisch-yellow group-hover:decoration-2">
            {sponsor.name}
          </p>
          <p className="text-[13px] leading-relaxed text-text-leise">
            {sponsor.beschreibung}
          </p>
          {sponsor.ort && <Ortszeile ort={sponsor.ort} className="mt-auto pt-1" />}
        </div>
      </div>
    </SponsorRahmen>
  );
}

function Ortszeile({ ort, className }: { ort: string; className?: string }) {
  return (
    <p
      className={`text-[11px] font-semibold uppercase tracking-wider text-text-leise ${className ?? ""}`}
    >
      {ort}
    </p>
  );
}

/*
 * Rahmen und Verlinkung an einer Stelle, damit die beiden Kartenformen sich
 * nicht auseinanderentwickeln.
 *
 * Ohne hinterlegte Adresse wird ein div gerendert und kein a. Ein Anker ohne
 * href ist für Suchmaschinen kein Link und für die Tastatur kein Ziel, er
 * sieht nur so aus. Lighthouse hat genau das schon einmal bemängelt.
 *
 * rel="sponsored": Diese Plätze sind bezahlt, und genau dafür gibt es die
 * Angabe. Sie ist ein Signal an Suchmaschinen und ersetzt keine sichtbare
 * Kennzeichnung. Die steht hier ohnehin darüber: "Hauptsponsor" und
 * "Co-Sponsoren" sagen einem Menschen unmissverständlich, was das ist.
 */
function SponsorRahmen({
  sponsor,
  className,
  children,
}: {
  sponsor: Sponsor;
  className?: string;
  children: React.ReactNode;
}) {
  const ziel = sponsor.url && sponsor.url !== "#" ? sponsor.url : undefined;
  const klassen = `group relative overflow-hidden border border-linie bg-flaeche ${className ?? ""}`;

  if (!ziel) {
    return <div className={klassen}>{children}</div>;
  }

  return (
    <a
      href={ziel}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className={`${klassen} transition-colors hover:border-fisch-yellow`}
    >
      {children}
      <span className="sr-only">Zur Website von {sponsor.name}</span>
    </a>
  );
}

/*
 * Die Ebene der Stufenueberschrift ist eine Eigenschaft, aus demselben Grund
 * wie bei NewsCard: auf der Startseite steht darueber ein h2 ("Sponsoren"),
 * auf /verein/sponsoren nicht. Dort sprang die Gliederung von h1 direkt auf
 * h3. Lighthouse hat das gemeldet, im Bild sieht man es nicht.
 */
export default function SponsorWall({
  sponsoren,
  ebene: Stufentitel = "h3",
}: {
  sponsoren: Sponsor[];
  /** h2 auf Seiten ohne eigene Zwischenueberschrift, sonst h3 */
  ebene?: "h2" | "h3";
}) {
  return (
    <div className="flex flex-col gap-10">
      {stufenReihenfolge.map((stufe) => {
        const liste = sponsoren.filter((s) => s.stufe === stufe);
        if (liste.length === 0) return null;
        return (
          <div key={stufe}>
            <Stufentitel className="mb-4 text-xs font-bold uppercase tracking-wider text-text-leise">
              {stufenTitel[stufe]}
            </Stufentitel>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {liste.map((s) =>
                s.stufe === "Hauptsponsor" ? (
                  <HauptKarte key={s.name} sponsor={s} />
                ) : (
                  <MitKarte key={s.name} sponsor={s} />
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
