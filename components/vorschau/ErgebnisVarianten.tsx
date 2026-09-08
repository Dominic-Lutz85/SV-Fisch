import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { siteConfig } from "@/lib/config";
import { formatDatum, formatDatumLang, formatUhrzeit } from "@/lib/utils";
import {
  ausgangVon,
  gegnerVon,
  ergebnisSatz,
  toreAusVereinssicht,
  type Ausgang,
  type Spielstand,
} from "@/lib/ergebnis";
import type { Spiel, Termin } from "@/types/content";

/*
 * ERKUNDUNG, KEIN PRODUKTIONSCODE.
 *
 * Vier Richtungen fuer die Frage: Wie kommt das letzte Spielergebnis in den
 * Kopfbereich der Startseite?
 *
 * Das Geruest (Wappen, Verlaeufe, Halbton, Ueberschrift) ist in allen vier
 * Faellen identisch und stammt aus components/Hero.tsx. Das ist Absicht und
 * kein Sparen: Verglichen wird die Behandlung des Ergebnisses, also muss
 * alles andere konstant bleiben. Wer hier zwei Sachen gleichzeitig aendert,
 * bekommt vier Bilder, aus denen sich nichts ableiten laesst. Genau das ist
 * bei der Erkundung am 08.09.2026 schon einmal passiert, als nur eine der
 * Richtungen den Vereinstermin anders trug.
 *
 * Referenzen, am 08.09.2026 selbst aufgerufen und als Bildschirmfoto
 * abgelegt unter scratchpad/zeigen/ref:
 *
 *   Manchester City   Rechte Spalte mit zwei Karten untereinander,
 *                     "NEXT FIXTURE" und "LAST RESULT", Ergebnis in zwei
 *                     dunklen Kaesten. Steht UNTER dem Kopfbereich.
 *   Eintracht         Waagerechtes Spielplanband quer ueber die Seite,
 *                     Vergangenes mit Ergebnis, Kommendes mit "-:-",
 *                     das naechste Spiel unterstrichen.
 *   Union Berlin      Das Ergebnis IST die Schlagzeile ueber dem Foto:
 *                     "0:1 gegen die SGE bedeutet Unions Niederlage".
 *   Mainz 05          Ebenso, aber ohne Ziffern in der Zeile:
 *                     "05ER LASSEN IN HAMBURG NICHTS ANBRENNEN".
 *
 * Was daraus folgt und im Memo steht: KEINER der vier Vereine stellt eine
 * nackte Ergebniskachel in den Kopfbereich. Entweder das Ergebnis ist eine
 * Schlagzeile, oder es steht weiter unten in einer Spalte.
 */

/* ------------------------------------------------------------------ */
/* gemeinsame Bausteine                                                */
/* ------------------------------------------------------------------ */

/**
 * Die Ergebniskaesten wie auf der Spielplanseite, dort von Manchester City
 * uebernommen. Hier zusaetzlich in drei Groessen, weil eine Ziffer im
 * Kopfbereich mehr Gewicht braucht als eine in einer Liste.
 */
function Kaesten({
  wert,
  groesse = "mittel",
}: {
  wert: string;
  groesse?: "klein" | "mittel" | "gross";
}) {
  const [a, b] = wert.split(":");
  const stil =
    groesse === "gross"
      ? "min-w-12 px-3 py-1.5 text-3xl"
      : groesse === "klein"
        ? "min-w-7 px-1.5 py-0.5 text-base"
        : "min-w-9 px-2 py-1 text-xl";
  return (
    <span className="flex items-center gap-1" aria-label={`Ergebnis ${wert}`}>
      <span
        className={`bg-fisch-white text-center font-display font-extrabold text-fisch-black ${stil}`}
      >
        {a}
      </span>
      <span
        className={`bg-fisch-white text-center font-display font-extrabold text-fisch-black ${stil}`}
      >
        {b}
      </span>
    </span>
  );
}

/** S, U oder N wie in der Spielliste. */
function Zeichen({ ausgang, gross }: { ausgang: Ausgang; gross?: boolean }) {
  if (!ausgang) return null;
  const kurz = ausgang === "sieg" ? "S" : ausgang === "unentschieden" ? "U" : "N";
  const lang =
    ausgang === "sieg"
      ? "Sieg"
      : ausgang === "unentschieden"
        ? "Unentschieden"
        : "Niederlage";
  return (
    <span
      title={lang}
      className={[
        "grid shrink-0 place-items-center rounded-full font-extrabold",
        gross ? "h-8 w-8 text-sm" : "h-6 w-6 text-xs",
        ausgang === "sieg" && "bg-fisch-yellow text-fisch-black",
        ausgang === "unentschieden" && "bg-flaeche-hoch-2 text-text",
        ausgang === "niederlage" && "border border-linie bg-flaeche text-text-leise",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span aria-hidden="true">{kurz}</span>
      <span className="sr-only">{lang}</span>
    </span>
  );
}

/*
 * Der Hinweis auf ein gespieltes Spiel ohne Eintrag.
 *
 * Er gehoert in JEDE der vier Richtungen, nicht in eine. Die Begruendung
 * steht ausfuehrlich in lib/ergebnis.ts: Ein Verein, der am Dienstag noch
 * das Ergebnis vom vorletzten Sonntag gross zeigt, sieht ungepflegt aus,
 * und zwar genau bei den Leuten, die beim Spiel dabei waren.
 */
function Nachtrag({ spiel }: { spiel: Spiel }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-text-leise">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-fisch-yellow"
      />
      Ergebnis vom {formatDatum(spiel.datum)} folgt
    </span>
  );
}

interface VariantenProps {
  stand: Spielstand;
  naechstesSpiel?: Spiel;
  naechsterTermin?: Termin;
}

/* ------------------------------------------------------------------ */
/* Geruest                                                             */
/* ------------------------------------------------------------------ */

/*
 * Alles aus components/Hero.tsx, was nicht zur Frage gehoert. Die
 * Begruendungen zu Verlaeufen, Halbton und dem angeschnittenen Wappen
 * stehen dort und werden hier bewusst NICHT wiederholt, sonst laufen zwei
 * Fassungen derselben Erklaerung auseinander.
 *
 * Neu ist nur der Schalter `schuhe`: Richtung D haengt eine Anzeigetafel an
 * dieselbe Linie, und zwei Gegenstaende an einer Leitung sind einer zu viel.
 */
function Geruest({
  nebenText,
  fuss,
  schuhe = true,
  naechsterTermin,
}: {
  /*
   * Steht auf dem Bildschirm RECHTS NEBEN dem Textblock, im Fluss und
   * nicht absolut. Der erste Versuch fuer Richtung C setzte die Ziffer
   * absolut auf sm:right-8, und damit lag sie mitten im Wappen: gelbe
   * Ziffer auf gelbem Ring, im Bildschirmfoto vom 08.09.2026 praktisch
   * unlesbar.
   *
   * Zwischen Textspalte und Wappen liegt eine freie Flaeche, und die
   * wandert mit der Fensterbreite. Gemessen sind beide Kanten: Der Text
   * ist auf max-w-lg gedeckelt, endet also 512 Pixel nach der linken
   * Rasterkante. Das Wappen beginnt bei 1920 erst bei 79,6 Prozent der
   * Containerbreite, bei 1440 bei 59,9 und bei 1280 bei 53,3 (die Werte
   * stehen in components/Hero.tsx). Die Luecke ist bei 1280 nur noch
   * rund 136 Pixel breit, deshalb waechst die Ziffer erst ab lg auf
   * volle Groesse.
   */
  nebenText?: React.ReactNode;
  fuss: React.ReactNode;
  schuhe?: boolean;
  naechsterTermin?: Termin;
}) {
  return (
    <section className="relative overflow-hidden bg-fisch-black text-text">
      <Image
        src="/logo.svg"
        alt=""
        width={900}
        height={900}
        priority
        aria-hidden="true"
        className="pointer-events-none absolute hidden sm:block sm:-right-40 sm:-top-32 sm:h-[620px] sm:w-[620px] lg:h-[760px] lg:w-[760px]"
      />
      <Image
        src="/logo.svg"
        alt=""
        width={600}
        height={600}
        priority
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-[280px] w-[280px] sm:hidden"
      />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-fisch-black via-fisch-black/95 to-transparent sm:block" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fisch-black/75 to-fisch-black sm:hidden" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-fisch-black via-fisch-black/90 to-transparent sm:via-fisch-black/85" />
      <div className="halbton pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="container-fisch relative flex min-h-[400px] flex-col justify-end gap-7 pb-12 pt-[13.5rem] sm:min-h-[560px] sm:gap-8 sm:py-16">
        <div className="animate-fade-up flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-10 lg:gap-16">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-widest text-fisch-yellow">
              Kreisliga B Staffel 10 Trier-Saarburg
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              {siteConfig.name}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-text-leise">
              {siteConfig.claim} Fußball und Gymnastik, Bambini bis erste
              Mannschaft, mitten im Ort seit {siteConfig.founded}.
            </p>
          </div>
          {nebenText}
        </div>

        <div className="animate-fade-up relative flex flex-col gap-4 border-t-2 border-fisch-yellow pt-5 sm:border-t-0">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 hidden h-[2px] sm:block"
            style={{
              background:
                "linear-gradient(to right, rgb(243 218 11) 0%, rgb(243 218 11) 66%, rgb(243 218 11 / 0.14) 82%, rgb(243 218 11 / 0) 100%)",
            }}
          />
          {schuhe && (
            <Image
              src="/fussballschuhe.png"
              alt=""
              width={153}
              height={320}
              aria-hidden="true"
              className="pointer-events-none absolute -top-[7px] left-[62%] hidden h-[160px] w-[77px] select-none sm:block"
            />
          )}
          {fuss}
        </div>

        {naechsterTermin && (
          <p className="animate-fade-up flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-leise">
            <CalendarDays className="h-4 w-4 shrink-0 text-fisch-yellow" aria-hidden="true" />
            <span className="font-bold text-text">{naechsterTermin.titel}</span>
            {/* Wortgleich mit components/Hero.tsx. Weicht der Fuss ab, sind
                alle gemessenen Hoehen gegenueber der Live-Seite verschoben,
                und der ganze Vergleich taugt nichts. */}
            <span>
              {formatDatumLang(naechsterTermin.datum)}
              {naechsterTermin.uhrzeit
                ? `, ${formatUhrzeit(naechsterTermin.datum)} Uhr`
                : ""}
              {naechsterTermin.ort ? ` · ${naechsterTermin.ort}` : ""}
            </span>
            <Link
              href="/kalender"
              className="font-bold text-fisch-yellow underline underline-offset-4"
            >
              Alle Termine
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}

/** Der Block "Nächstes Spiel" im heutigen Zustand, fuer die Richtungen, die ihn behalten. */
function NaechstesSpielBlock({ spiel }: { spiel: Spiel }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-fisch-yellow">
        Nächstes Spiel
      </p>
      <p className="mt-1 font-display text-xl font-bold sm:text-2xl">
        {siteConfig.shortName} <span className="text-fisch-yellow">-</span>{" "}
        {gegnerVon(spiel)}
      </p>
      <p className="mt-1 text-sm text-text-leise">
        {formatDatumLang(spiel.datum)}, {spiel.uhrzeit} Uhr ·{" "}
        {spiel.ort === "Heim" ? "Heimspiel" : "Auswärts"}
      </p>
    </div>
  );
}

function SpielplanKnopf({ rand }: { rand?: boolean }) {
  return (
    <Link
      href="/fussball/spielplan"
      className={
        rand
          ? "inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-linie px-5 py-2.5 text-sm font-bold text-text transition-colors hover:border-fisch-yellow hover:text-fisch-yellow"
          : "inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-fisch-yellow px-5 py-2.5 text-sm font-bold text-fisch-black transition-colors hover:bg-fisch-yellow-dark sm:self-auto"
      }
    >
      Kompletter Spielplan <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* A - Ergebnisband                                                    */
/* ------------------------------------------------------------------ */

/*
 * A ERGEBNISBAND, nach dem Spielplanband von Eintracht Frankfurt.
 *
 * Die Idee: Das Ergebnis bekommt keine eigene Kachel. Es ist einfach die
 * Stelle, an der die Saison gerade steht. Drei gespielte Partien links, die
 * beiden kommenden rechts, alles in einer Zeile, das naechste Spiel gelb
 * unterstrichen.
 *
 * DER PREIS, und der gehoert ins Memo: Das Band ersetzt den Block "Naechstes
 * Spiel". Der naechste Gegner steht damit nicht mehr gross da, sondern als
 * einer von fuenf Eintraegen. Das ist ein echter Verlust an Deutlichkeit.
 *
 * Das Band liegt INNERHALB des dunklen Kopfbereichs und nicht an dessen
 * Unterkante. An der Unterkante waere es ein viertes Band zwischen
 * Kopfbereich und gelber Chronik, und genau diesen Stapel haben wir am
 * 08.09.2026 abgebaut.
 *
 * Auf dem Handy laeuft das Band waagerecht, mit Einrastpunkten. Ein
 * bewusster, eingefasster Scroller ist etwas anderes als ein Ueberlauf der
 * Seite: Die Seite selbst bleibt bei 390 Pixeln ohne Querbalken.
 */
export function ErgebnisbandVariante({
  stand,
  naechstesSpiel,
  naechsterTermin,
  spielplan,
}: VariantenProps & { spielplan: Spiel[] }) {
  const heute = naechstesSpiel?.datum ?? "9999-12-31";
  const vergangen = spielplan
    .filter((s) => s.datum < heute)
    .slice(-3);
  const kommend = spielplan.filter((s) => s.datum >= heute).slice(0, 2);
  const kette = [...vergangen, ...kommend];

  return (
    <Geruest
      /*
        KEINE SCHUHE. Nachgesehen im Bildschirmfoto vom 08.09.2026: Sie
        haengen bei 62 Prozent und liegen damit auf dem fuenften Eintrag
        des Bandes, hier "FSV Trier-Kuerenz 14:00". Das Band braucht die
        ganze Linie.
      */
      schuhe={false}
      naechsterTermin={naechsterTermin}
      fuss={
        <div className="flex flex-col gap-4">
          {/*
            Kein justify-between. Damit stand der Hinweis am rechten Rand
            des Containers, also mitten im Wappen und dort unlesbar.
          */}
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-fisch-yellow">
              Die Saison bis hierher
            </p>
            {stand.offen && <Nachtrag spiel={stand.offen} />}
          </div>

          {/*
            -mx-4 plus px-4 laesst das Band auf dem Handy bis an den Rand
            laufen, ohne dass der erste Eintrag am Raster klebt.
          */}
          <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {kette.map((s) => {
              const ausgang = ausgangVon(s);
              const istNaechstes = s === naechstesSpiel;
              const tore = toreAusVereinssicht(s);
              return (
                <li
                  key={`${s.datum}-${s.auswaerts}`}
                  className={[
                    "min-w-[168px] shrink-0 snap-start border-t-2 pt-3 sm:min-w-[176px]",
                    istNaechstes ? "border-fisch-yellow" : "border-linie",
                  ].join(" ")}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-leise">
                    {formatDatum(s.datum)} · {s.ort === "Heim" ? "Heim" : "Auswärts"}
                  </p>
                  <p className="mt-1.5 truncate text-sm font-bold text-text">
                    {gegnerVon(s)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {tore ? (
                      <>
                        <Zeichen ausgang={ausgang} />
                        <span className="font-display text-lg font-extrabold text-text">
                          {tore[0]}:{tore[1]}
                        </span>
                      </>
                    ) : s.datum < heute ? (
                      <span className="text-sm text-text-leise">noch offen</span>
                    ) : (
                      <span className="font-display text-lg font-extrabold text-fisch-yellow">
                        {s.uhrzeit}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div>
            <SpielplanKnopf />
          </div>
        </div>
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* B - Zwei Spalten im Fuss                                            */
/* ------------------------------------------------------------------ */

/*
 * B ZWEI SPALTEN, nach der rechten Spalte von Manchester City.
 *
 * Dort stehen "NEXT FIXTURE" und "LAST RESULT" als zwei Karten
 * untereinander. Hier nebeneinander, weil der Kopfbereich breit ist und
 * flach bleiben soll.
 *
 * Das ist die sparsamste der vier Richtungen: Auf dem Bildschirm kostet sie
 * keinen einzigen Pixel Hoehe, weil der Fuss ohnehin eine Zeile ist. Der
 * Block "Naechstes Spiel" behaelt seine Groesse, das Ergebnis stellt sich
 * links daneben und ist durch die Kaesten trotzdem sofort zu finden.
 *
 * Reihenfolge links nach rechts ist zeitlich: gewesen, dann kommend. Das
 * liest sich von selbst richtig, ohne dass jemand die Ueberschriften lesen
 * muss.
 */
export function ZweiSpaltenVariante({
  stand,
  naechstesSpiel,
  naechsterTermin,
}: VariantenProps) {
  const letztes = stand.letztes;
  return (
    <Geruest
      /*
        KEINE SCHUHE, und das ist die unangenehmste Erkenntnis dieser
        Erkundung. Nachgemessen im Bildschirmfoto vom 08.09.2026: Die
        Schuhe haengen bei 62 Prozent, die Zeile "SV Fisch - DJK St.
        Matthias Trier II" endet dahinter. Der Schuh lag auf dem "II".
        Verschieben hilft nicht dauerhaft, weil beide Werte
        unterschiedlich mit der Fensterbreite wandern.

        Dahinter steckt etwas Grundsaetzliches: Die Schuhe waren die
        Antwort auf eine LEERE Linie. Sobald der Fuss zwei Spalten traegt,
        ist die Linie nicht mehr leer, und das Motiv verliert seinen
        Grund. Das gilt fuer A, B und D. Nur C laesst den Fuss in Ruhe und
        behaelt die Schuhe deshalb.
      */
      schuhe={false}
      naechsterTermin={naechsterTermin}
      fuss={
        <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-end sm:gap-10">
          {letztes && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-text-leise">
                Zuletzt
              </p>
              <div className="mt-1.5 flex items-center gap-3">
                <Zeichen ausgang={ausgangVon(letztes)} gross />
                <Kaesten wert={letztes.ergebnis!} />
              </div>
              <p className="mt-2 text-sm text-text-leise">
                {ergebnisSatz(letztes)}
                <span className="mx-1.5 text-linie">·</span>
                {formatDatum(letztes.datum)}
              </p>
              {stand.offen && (
                <p className="mt-1.5">
                  <Nachtrag spiel={stand.offen} />
                </p>
              )}
            </div>
          )}

          {/* Die senkrechte Kante trennt Vergangenheit von Zukunft. Sie ist
              1 Pixel und nur ab sm da, darunter steht beides untereinander
              und braucht keine Trennung. */}
          <span aria-hidden="true" className="hidden w-px self-stretch bg-linie sm:block" />

          {naechstesSpiel && <NaechstesSpielBlock spiel={naechstesSpiel} />}

          {/*
            Kein ml-auto. Damit klebte der Knopf am rechten Containerrand
            und lag bei 1920 Pixeln auf dem Wappen, das dort bei 79,6
            Prozent beginnt. Er gehoert an das Ende der Zeile, nicht an
            das Ende der Flaeche.
          */}
          <SpielplanKnopf />
        </div>
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* C - Die grosse Ziffer                                               */
/* ------------------------------------------------------------------ */

/*
 * C DIE GROSSE ZIFFER, nach Union Berlin und Mainz 05.
 *
 * Beide fuehren die Startseite mit dem Ergebnis als Schlagzeile. Union
 * schreibt die Ziffern sogar hinein: "0:1 gegen die SGE bedeutet Unions
 * Niederlage". Was beide dabei haben und wir nicht, ist ein Foto vom Spiel.
 * Also uebernehmen wir das Prinzip und ersetzen das Foto durch Typografie:
 * Die Ziffer selbst wird das Bild.
 *
 * Sie steht rechts neben dem Text und links vor dem Wappen, auf derselben
 * Grundlinie wie der Absatz. Damit fuellt sie die Flaeche, die im
 * Kopfbereich ohnehin leer ist, und kostet auf dem Bildschirm keine Hoehe.
 *
 * WAS DAGEGEN SPRICHT, und das gehoert vor die Entscheidung und nicht
 * danach: Bei einer Niederlage ist die Ziffer genauso gross. Am 16.08. war
 * das ein 1:3. Wer diese Richtung waehlt, entscheidet damit auch, dass die
 * Startseite eine Niederlage genauso gross zeigt wie einen Sieg. Das ist
 * vertretbar und ehrlich, aber es ist eine Entscheidung.
 *
 * Die Farbe traegt die Wertung, nicht die Groesse: Sieg in Vereinsgelb,
 * Unentschieden und Niederlage in der Textfarbe.
 */
export function GrosseZifferVariante({
  stand,
  naechstesSpiel,
  naechsterTermin,
}: VariantenProps) {
  const letztes = stand.letztes;
  const tore = letztes ? toreAusVereinssicht(letztes) : null;
  const ausgang = letztes ? ausgangVon(letztes) : null;

  return (
    <Geruest
      naechsterTermin={naechsterTermin}
      nebenText={
        letztes && tore ? (
          <div className="shrink-0 border-t-2 border-fisch-yellow pt-4 sm:border-l-2 sm:border-t-0 sm:pl-6 sm:pt-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-leise">
              Zuletzt · {formatDatum(letztes.datum)}
            </p>
            <p
              className={[
                "mt-2 font-display font-extrabold leading-none tracking-tight",
                "text-5xl lg:text-7xl",
                ausgang === "sieg" ? "text-fisch-yellow" : "text-text",
              ].join(" ")}
            >
              {tore[0]}
              <span className="mx-0.5 opacity-40">:</span>
              {tore[1]}
            </p>
            <p className="mt-3 max-w-[15rem] text-sm font-bold text-text">
              {ergebnisSatz(letztes)}
            </p>
            {stand.offen && (
              <p className="mt-1.5">
                <Nachtrag spiel={stand.offen} />
              </p>
            )}
          </div>
        ) : null
      }
      fuss={
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
          {naechstesSpiel && <NaechstesSpielBlock spiel={naechstesSpiel} />}
          <SpielplanKnopf />
        </div>
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* D - Die Anzeigetafel                                                */
/* ------------------------------------------------------------------ */

/*
 * D DIE ANZEIGETAFEL, eigene Richtung, entwickelt aus dem Stadionmotiv.
 *
 * Der Gedanke kommt aus der Loesung, die sich schon einmal als die beste
 * erwiesen hat: Die gelbe Linie wurde nicht kuerzer, sie bekam eine
 * Aufgabe. Sie traegt Schuhe. Hier traegt sie eine Anzeigetafel, so wie an
 * einem Sportplatz eine Tafel an einem Mast haengt.
 *
 * Deshalb haengen in dieser Richtung KEINE Schuhe an der Linie. Zwei
 * Gegenstaende an einer Leitung sind einer zu viel, und die Tafel braucht
 * genau die Stelle, an der die Schuhe haengen.
 *
 * Die Tafel ist gebaut, nicht gezeichnet: Rahmen, Kopfzeile mit Wettbewerb
 * und Datum, zwei Zeilen mit Mannschaft und Ziffer. Sie benutzt dieselben
 * Ergebniskaesten wie die Spielplanseite, nur groesser. Ein gezeichnetes
 * Motiv waere hier falsch, das Urteil dazu steht fest: "erkennt ja aber
 * keiner".
 *
 * Auf dem Handy gibt es keine Tafel. Bei 390 Pixeln ist die Linie 350 breit
 * und der Fuss ohnehin voll, dieselbe Rechnung wie bei den Schuhen. Dort
 * steht das Ergebnis als eine ruhige Zeile ueber dem naechsten Spiel.
 */
export function AnzeigetafelVariante({
  stand,
  naechstesSpiel,
  naechsterTermin,
}: VariantenProps) {
  const letztes = stand.letztes;
  const tore = letztes ? toreAusVereinssicht(letztes) : null;

  return (
    <Geruest
      schuhe={false}
      naechsterTermin={naechsterTermin}
      fuss={
        <div className="relative flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
          {/* Die Tafel haengt an der Linie, ab sm. */}
          {letztes && tore && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-[2px] left-[58%] hidden select-none sm:block"
            >
              {/* Der Mast: zwei Striche vom Aufhaengepunkt zur Tafel. */}
              <span className="absolute left-1/2 top-0 h-8 w-px -translate-x-1/2 bg-fisch-yellow/70" />
              <div className="mt-8 border border-fisch-yellow/70 bg-fisch-black/85 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                <p className="border-b border-fisch-yellow/40 bg-fisch-yellow/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-fisch-yellow">
                  Endstand · {formatDatum(letztes.datum)}
                </p>
                <div className="space-y-1 px-3 py-2">
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-xs font-bold text-text">
                      {siteConfig.shortName}
                    </span>
                    <span className="min-w-7 bg-fisch-white px-1.5 text-center font-display text-lg font-extrabold text-fisch-black">
                      {tore[0]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-6">
                    <span className="max-w-[9rem] truncate text-xs font-semibold text-text-leise">
                      {gegnerVon(letztes)}
                    </span>
                    <span className="min-w-7 bg-fisch-white px-1.5 text-center font-display text-lg font-extrabold text-fisch-black">
                      {tore[1]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Auf dem Handy traegt eine Zeile, was auf dem Bildschirm die
              Tafel traegt. */}
          {letztes && tore && (
            <p className="flex items-center gap-2 text-sm text-text-leise sm:hidden">
              <Zeichen ausgang={ausgangVon(letztes)} />
              <span className="font-bold text-text">
                {tore[0]}:{tore[1]}
              </span>
              <span>{ergebnisSatz(letztes)}</span>
            </p>
          )}

          {naechstesSpiel && <NaechstesSpielBlock spiel={naechstesSpiel} />}
          <SpielplanKnopf />
          {/*
            Eigene Zeile, IMMER. Vorher lief der Hinweis in derselben Zeile
            weiter und verschwand unter der Tafel: im Bildschirmfoto vom
            08.09.2026 war nur noch "Erge" zu lesen.
          */}
          {stand.offen && (
            <p className="w-full basis-full">
              <Nachtrag spiel={stand.offen} />
            </p>
          )}
        </div>
      }
    />
  );
}
