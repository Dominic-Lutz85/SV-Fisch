import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { formatDatumLang, formatUhrzeit } from "@/lib/utils";
import type { Spiel, Termin } from "@/types/content";

/*
 * Kopfbereich der Startseite.
 *
 * Vorher lag hier ein Streifenmuster als Hintergrundbild und darüber das
 * Vereinswappen mit 8 Prozent Deckkraft, auf 85 Prozent der Bildschirmhöhe.
 * Ein Hintergrund, den man kaum sieht, macht den Text schlechter lesbar und
 * gibt dafür nichts zurück: entweder deutlich zeigen oder weglassen, die
 * Mitte kostet nur. Deshalb ist das Wappen jetzt ein angeschnittenes Motiv
 * in voller Deckkraft, und der Bereich ist von 85 vh auf eine feste,
 * deutlich flachere Höhe zurückgenommen.
 *
 * Unten steht das nächste Spiel. Der Grund steht im Kompendium unter
 * "Der erste Bildschirm muss zeigen, nicht versprechen": BVB, Ajax und
 * Man City führen alle mit etwas Konkretem statt mit einem Anspruch. Wir
 * haben keine Fotos, aber wir haben echte, gegen FuPa geprüfte Spieldaten.
 *
 * Der Verlauf über dem Wappen ist nötig, nicht dekorativ: ohne ihn läuft die
 * Schrift links in die gelben Flächen des Wappens.
 *
 * Die Einblendung läuft über CSS (animate-fade-up), nicht über eine
 * Bewegungsbibliothek. Vorher startete der ganze Kopfbereich bei Deckkraft 0
 * und wurde erst durch JavaScript sichtbar gemacht. Lief das Skript nicht,
 * war der erste Bildschirm leer, und genau das ist beim Prüfen mehrfach
 * passiert. Eine CSS-Animation braucht kein JavaScript, und die Regel für
 * "Bewegung reduzieren" in globals.css setzt sie sofort auf den Endzustand.
 * Damit ist diese Datei auch keine Client-Komponente mehr.
 */

interface HeroProps {
  naechsterTermin?: Termin;
  naechstesSpiel?: Spiel;
}

export default function Hero({ naechsterTermin, naechstesSpiel }: HeroProps) {
  const gegner = naechstesSpiel
    ? naechstesSpiel.heim.toLowerCase().includes("fisch")
      ? naechstesSpiel.auswaerts
      : naechstesSpiel.heim
    : undefined;

  return (
    <section className="relative overflow-hidden bg-fisch-black text-fisch-white">
      <Image
        src="/logo.svg"
        alt=""
        width={900}
        height={900}
        priority
        aria-hidden="true"
        /*
          Nur ab sm. Ein angeschnittenes Wappen braucht Breite: auf 390 Pixel
          Bildschirmbreite lag es hinter Überschrift und Fließtext, beides war
          nicht mehr zu lesen. Auch verkleinert blieb die Überlagerung. Auf dem
          Handy steht deshalb weiter unten ein kleines Wappen ÜBER dem Text
          statt eines großen dahinter.
        */
        className="pointer-events-none absolute hidden sm:block sm:-right-40 sm:-top-32 sm:h-[620px] sm:w-[620px] lg:h-[760px] lg:w-[760px]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-fisch-black via-fisch-black/95 to-fisch-black sm:to-transparent" />
      {/*
        Zweiter Verlauf, nur nach unten. Ohne ihn liegt der gelbe Knopf
        "Kompletter Spielplan" auf dem gelben Ring des Wappens und verliert
        dort seine Kante. Die Zeile am Fuß trägt Information und braucht
        deshalb einen ruhigen Untergrund, das obere Drittel des Wappens
        bleibt davon unberührt.
      */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-fisch-black via-fisch-black/90 to-transparent sm:h-2/5 sm:via-fisch-black/85" />

      <div className="container-fisch relative flex min-h-[400px] flex-col justify-end gap-7 py-12 sm:min-h-[560px] sm:gap-8 sm:py-16">
        <div className="animate-fade-up">
          {/* Handy-Ersatz für das angeschnittene Wappen, siehe oben. */}
          <Image
            src="/logo.svg"
            alt={`Wappen ${siteConfig.name}`}
            width={80}
            height={80}
            className="mb-5 h-16 w-16 sm:hidden"
          />
          <p className="text-sm font-bold uppercase tracking-widest text-fisch-yellow">
            {/* Aus den Spieldaten, nicht fest eingetragen: sonst steht hier
                nach einem Auf- oder Abstieg die falsche Liga. */}
            {naechstesSpiel?.wettbewerb ?? `Gegründet ${siteConfig.founded}`}
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mt-5 max-w-lg text-lg text-fisch-white/80">
            {siteConfig.claim} Fußball und Gymnastik, Bambini bis erste
            Mannschaft, mitten im Ort seit {siteConfig.founded}.
          </p>
        </div>

        {naechstesSpiel && (
          <div
            style={{ animationDelay: "150ms" }}
            className="animate-fade-up flex flex-col gap-4 border-t-2 border-fisch-yellow pt-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-fisch-yellow">
                Nächstes Spiel
              </p>
              <p className="mt-1 font-display text-xl font-bold sm:text-2xl">
                {siteConfig.shortName}{" "}
                <span className="text-fisch-white/40">gegen</span> {gegner}
              </p>
              <p className="mt-1 text-sm text-fisch-white/70">
                {formatDatumLang(naechstesSpiel.datum)}, {naechstesSpiel.uhrzeit}{" "}
                Uhr · {naechstesSpiel.ort === "Heim" ? "Heimspiel" : "Auswärts"}
                {naechstesSpiel.ort === "Heim" && naechstesSpiel.spielstaette
                  ? ` · ${naechstesSpiel.spielstaette}`
                  : ""}
              </p>
            </div>
            <Link
              href="/fussball/spielplan"
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-fisch-yellow px-5 py-2.5 text-sm font-bold text-fisch-black transition-colors hover:bg-fisch-yellow-dark sm:self-auto"
            >
              Kompletter Spielplan{" "}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>

      {/*
        Der nächste Vereinstermin. Er stand vorher als Kasten im Kopfbereich und
        wäre beim Umbau sonst ersatzlos von der Startseite verschwunden. Als
        schmale Zeile am Fuß bleibt er sichtbar, ohne dem Spiel die Aufmerksamkeit
        zu nehmen.
      */}
      {naechsterTermin && (
        <div className="relative border-t border-white/10 bg-white/5">
          <div className="container-fisch flex flex-wrap items-center gap-x-3 gap-y-1 py-3 text-sm">
            <CalendarDays
              className="h-4 w-4 shrink-0 text-fisch-yellow"
              aria-hidden="true"
            />
            <span className="font-bold uppercase tracking-wide text-fisch-yellow">
              Termin
            </span>
            <span className="font-semibold">{naechsterTermin.titel}</span>
            <span className="text-fisch-white/60">
              {formatDatumLang(naechsterTermin.datum)}
              {naechsterTermin.uhrzeit
                ? `, ${formatUhrzeit(naechsterTermin.datum)} Uhr`
                : ""}
              {naechsterTermin.ort ? ` · ${naechsterTermin.ort}` : ""}
            </span>
            <Link
              href="/kalender"
              className="ml-auto inline-flex shrink-0 items-center gap-1.5 font-semibold text-fisch-white underline-offset-4 hover:text-fisch-yellow hover:underline"
            >
              Alle Termine <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
