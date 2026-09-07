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

      {/*
        Das Wappen auf dem Handy, 08.09.2026.

        Hier stand vorher, ein angeschnittenes Wappen brauche Breite und
        liege auf 390 Pixeln hinter Überschrift und Fließtext, deshalb
        stehe weiter unten ein kleines Wappen von 64 Pixeln ÜBER dem Text.

        Die Beobachtung stimmte, die Schlussfolgerung nicht. Das Problem
        war die Überlagerung, nicht die Größe. Und die Notlösung hatte
        einen Preis, der beim Nachmessen herauskam: In der Kopfleiste
        steht dasselbe Wappen mit 40 mal 40 bei y=20, das kleine im
        Kopfbereich mit 64 mal 64 bei y=130. Zweimal dasselbe Zeichen auf
        200 Pixeln, und das zweite zu klein, um als Motiv zu wirken. Es
        füllte keine Fläche, es belegte nur Platz. Danach kamen vier
        Textblöcke am Stück, ohne ein einziges Bild, zusammen 706 von
        844 Pixeln Bildschirmhöhe.

        Zum Vergleich am selben Tag aufgenommen: Union Berlin und der BVB
        führen auf dem Handy beide mit einem randlosen Foto über etwa die
        halbe Höhe. Das ist hier nicht nachbaubar, im Repo liegt genau ein
        echtes Vereinsfoto, hochkant mit eingebrannter Ergebnisgrafik.

        Also das groß machen, was da ist. Das Wappen liegt jetzt
        angeschnitten oben rechts und der Text DARUNTER statt darauf.
      */}
      <Image
        src="/logo.svg"
        alt=""
        width={600}
        height={600}
        priority
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-[280px] w-[280px] sm:hidden"
      />

      {/*
        Der Verlauf von links gilt nur ab sm. Er hält die Schrift aus den
        gelben Flächen des Wappens heraus, und dort steht das Wappen
        rechts NEBEN dem Text.
      */}
      <div className="absolute inset-0 hidden bg-gradient-to-r from-fisch-black via-fisch-black/95 to-transparent sm:block" />

      {/*
        Auf dem Handy läuft der Verlauf von oben nach unten, nicht von
        links nach rechts.

        Vorher stand hier derselbe Verlauf für beide Größen, unter sm aber
        mit to-fisch-black statt to-transparent, also auf voller Fläche
        deckend. Beim ersten Versuch mit dem großen Wappen war es im
        Bildschirmfoto nur noch zu ahnen. Der Verlauf muss dort dunkeln,
        wo Schrift steht, also unten, und oben das Motiv stehen lassen.
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fisch-black/75 to-fisch-black sm:hidden" />

      {/*
        Zweiter Verlauf, nur nach unten. Ohne ihn liegt der gelbe Knopf
        "Kompletter Spielplan" auf dem gelben Ring des Wappens und verliert
        dort seine Kante. Die Zeile am Fuß trägt Information und braucht
        deshalb einen ruhigen Untergrund, das obere Drittel des Wappens
        bleibt davon unberührt.
      */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-fisch-black via-fisch-black/90 to-transparent sm:via-fisch-black/85" />

      {/*
        Halbton-Raster über dem Verlauf, siehe globals.css. Es liegt bewusst
        ÜBER dem Verlauf und unter dem Text: so bekommt die dunkle Fläche unten
        eine Textur, ohne dass die Schrift darauf schlechter lesbar wird.
      */}
      {/*
        Volle Fläche, nicht mehr h-2/3 am unteren Rand. Vorher entstand dort, wo
        das Element anfing, eine harte waagerechte Kante quer durch den
        Kopfbereich, weil der Verlauf inzwischen von links nach rechts läuft und
        oben nichts mehr ausblendet.
      */}
      <div className="halbton pointer-events-none absolute inset-0" aria-hidden="true" />

      {/*
        Der große Innenabstand oben gilt nur auf dem Handy und ist der
        Platz, den das angeschnittene Wappen braucht.

        13,5rem sind 216 Pixel und kein runder Wert, sondern nachgemessen:
        Bei 160 Pixeln endete das Wappen bei y=266 und die Dachzeile begann
        schon bei y=242. Die gelbe Dachzeile lag damit auf dem gelben Ring
        des Wappens und war dort nicht mehr zu lesen. Jetzt beginnt sie
        bei 298, also 32 Pixel darunter.

        Wer den Wert ändert, misst beides nach: Unterkante des Wappens
        gegen Oberkante der Dachzeile.
      */}
      <div className="container-fisch relative flex min-h-[400px] flex-col justify-end gap-7 pb-12 pt-[13.5rem] sm:min-h-[560px] sm:gap-8 sm:py-16">
        <div className="animate-fade-up">
          <p className="text-sm font-bold uppercase tracking-widest text-fisch-yellow">
            {/* Aus den Spieldaten, nicht fest eingetragen: sonst steht hier
                nach einem Auf- oder Abstieg die falsche Liga. */}
            {naechstesSpiel?.wettbewerb ?? `Gegründet ${siteConfig.founded}`}
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mt-5 max-w-lg text-lg text-text-leise">
            {siteConfig.claim} Fußball und Gymnastik, Bambini bis erste
            Mannschaft, mitten im Ort seit {siteConfig.founded}.
          </p>
        </div>

        {naechstesSpiel && (
          <div
            /*
              Ohne Verzoegerung. Die 150 ms haben den Spieltermin nach hinten
              geschoben, und das ist die konkreteste Angabe auf der ganzen
              Seite. Sie soll zuerst da sein, nicht als Letztes.
            */
            className="animate-fade-up relative flex flex-col gap-4 border-t-2 border-fisch-yellow pt-5 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6"
          >
            {/*
              DIE SCHUHE AN DER LINIE, seit 08.09.2026.

              Der Auftraggeber fand die gelbe Linie zu lang, und nachgemessen
              hatte er recht: Sie ist 1216 Pixel breit, die Überschrift
              darüber 672 und der Absatz 512. Sie lief also über 700 Pixel
              ins Leere.

              Zwei Runden gezeichneter Motive (Anstoßkreis, Strafraum,
              Stadiongrundriss und weitere) haben das Problem nicht gelöst.
              Sein Urteil dazu war "erkennt ja aber keiner", und das stimmte:
              Ein Symbol, das an eine 1216 Pixel lange Linie passen soll,
              ist zwangsläufig klein.

              Seine eigene Lösung ist besser als alle davon, und zwar aus
              einem Grund, den man erst sieht, wenn es hängt: Die Linie muss
              gar nicht kürzer werden. Sie braucht nur eine Aufgabe. Schuhe,
              die über eine Leitung geworfen wurden, kennt jeder, und dafür
              muss die Leitung lang sein.

              Zur Datei: Die Zeichnung kam mit Alphakanal, also ohne den
              weißen Kasten, der sonst das übliche Problem ist. Umgefärbt
              wurde sie trotzdem, von rgb(248,224,0) auf das Vereinsgelb
              rgb(243,218,11). Nebeneinander auf derselben Linie wäre der
              Unterschied sichtbar gewesen.

              Zur Lage: left-[62%] ist nachgemessen und kein runder Wert.
              Weiter links stehen die Schuhe über der Paarung, weiter rechts
              laufen sie bei 1440 Pixeln aus dem Container. -top-[7px] hebt
              den Aufhängering so weit an, dass die Linie hindurchläuft
              statt darüber zu enden.

              NUR AB sm: Auf 390 Pixeln ist die Linie 350 breit und der Text
              füllt sie ganz aus. Die Schuhe lägen dort auf der Paarung.
            */}
            <Image
              src="/fussballschuhe.png"
              alt=""
              width={153}
              height={320}
              aria-hidden="true"
              className="pointer-events-none absolute -top-[7px] left-[62%] hidden h-[160px] w-[77px] select-none sm:block"
            />

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-fisch-yellow">
                Nächstes Spiel
              </p>
              {/*
                Bindestrich statt des Wortes "gegen". Zwei Gründe: So schreibt
                der Fußball eine Paarung, und das Wort stand auf white/40, also
                bei 3,56 zu 1 gegen Vereinsschwarz, gefordert sind 4,5. Der
                Trenner ist jetzt so hell wie die Namen und damit lesbar.
              */}
              <p className="mt-1 font-display text-xl font-bold sm:text-2xl">
                {siteConfig.shortName}{" "}
                <span className="text-fisch-yellow">-</span> {gegner}
              </p>
              <p className="mt-1 text-sm text-text-leise">
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

        {/*
          Der nächste Vereinstermin, seit 08.09.2026 als leise Zeile im Fuß
          des Kopfbereichs statt als eigenes Band darunter.

          WAS HIER VORHER STAND UND WARUM ES WEG IST, ausführlich, weil an
          dieser Stelle schon zweimal umgebaut wurde:

          Erst war der Termin ein vollbreites Band in Vereinsgelb nach dem
          Muster großer Vereine. Weil darunter die gelbe Chronik steht,
          waren beide zusammen ein durchgehendes gelbes Feld mit zwei ganz
          verschiedenen Botschaften darin. Deshalb wurde das Band dunkel
          (flaeche-hoch, #1f1f1f) mit Linien oben und unten.

          Damit war das Farbproblem gelöst und ein Rhythmusproblem
          entstanden. Nachgemessen am 08.09.2026 auf der Live-Seite bei
          1920 Pixeln: Zwischen dem Ende des Kopfbereichs und dem Beginn
          der Nachrichten lagen 230 Pixel mit VIER Farbwechseln (schwarz,
          #1f1f1f, Vereinsgelb, schwarz), fünf Unterkanten, acht
          Textgrundlinien und vier verschiedenen linken Rasterkanten. Der
          Auftraggeber hat das als "zu unruhig" beschrieben, bevor irgendeine
          Zahl vorlag, und die Zahlen haben ihm recht gegeben.

          Ein eigenes Band ist für einen einzelnen Termin schlicht zu viel
          Gerüst. Als Zeile im Fuß spart es einen kompletten Farbwechsel und
          70 Pixel Höhe, und der zweite gelbe Pillenknopf verschwindet: auf
          dem Handy standen zwei davon mit 183 Pixeln untereinander, für
          zwei verschiedene Sachen.

          WER DAS ZURÜCKDREHT, holt sich beides zurück, das Farbproblem UND
          den vierten Farbwechsel. Das Band gehört nur wieder her, wenn
          unter dem Kopfbereich keine farbige Fläche mehr steht.

          Der Termin behält Uhrzeit und Ort. Beide sind optional in den
          Daten, und ein Termin ohne Ort ist für einen Verein normal.
        */}
        {naechsterTermin && (
          <p className="animate-fade-up flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-leise">
            <CalendarDays
              className="h-4 w-4 shrink-0 text-fisch-yellow"
              aria-hidden="true"
            />
            <span className="font-bold text-text">{naechsterTermin.titel}</span>
            <span>
              {formatDatumLang(naechsterTermin.datum)}
              {naechsterTermin.uhrzeit
                ? `, ${formatUhrzeit(naechsterTermin.datum)} Uhr`
                : ""}
              {naechsterTermin.ort ? ` · ${naechsterTermin.ort}` : ""}
            </span>
            <Link
              href="/kalender"
              className="font-bold text-fisch-yellow underline underline-offset-4 transition-colors hover:text-fisch-yellow-dark"
            >
              Alle Termine
            </Link>
          </p>
        )}
      </div>

    </section>
  );
}
