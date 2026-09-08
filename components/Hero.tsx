import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { cn, formatDatum, formatDatumLang, formatUhrzeit } from "@/lib/utils";
import { heuteInDeutschland } from "@/lib/content";
import {
  ausgangVon,
  gegnerVon,
  letzterSpielstand,
  saisonBand,
  toreAusVereinssicht,
} from "@/lib/ergebnis";
import AusgangsZeichen from "@/components/AusgangsZeichen";
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
  /* Der ganze Spielplan. Das Band schneidet sich selbst zurecht. */
  spielplan: Spiel[];
}

export default function Hero({
  naechsterTermin,
  naechstesSpiel,
  spielplan,
}: HeroProps) {
  const heute = heuteInDeutschland();
  const band = saisonBand(spielplan, heute);
  const stand = letzterSpielstand(spielplan, heute);

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

        {/*
          DAS SAISONBAND, seit 08.09.2026.

          HIER STAND VORHER der Block "Naechstes Spiel": Dachzeile, Paarung
          in grosser Schrift, Datumszeile, daneben der gelbe Knopf. Er ist
          nicht kaputtgegangen, er ist ersetzt worden, und der Grund gehoert
          hierhin, damit ihn niemand aus Versehen zurueckbaut.

          Der Auftraggeber wollte das letzte Spielergebnis im Kopfbereich
          sehen. Vier Richtungen lagen als laufende Vorschau unter
          /vorschau/ergebnis, verglichen mit vier Vereinsseiten, die am
          08.09.2026 selbst aufgerufen wurden. Der wichtigste Fund dabei:
          KEINE davon stellt eine Ergebniskachel in den Kopfbereich.
          Manchester City stellt "LAST RESULT" in eine Spalte UNTER dem
          Kopfbereich, Union Berlin und Mainz 05 machen das Ergebnis zur
          Schlagzeile ueber einem Foto, und Eintracht Frankfurt legt ein
          waagerechtes Spielplanband quer ueber die Seite: Gespieltes mit
          Ergebnis, Kommendes mit Anstosszeit, das naechste Spiel markiert.

          Das Band ist die Uebernahme von Eintracht, und es kann etwas, das
          eine Ergebniskachel nicht kann: Es zeigt Vergangenheit und Zukunft
          in EINER Zeile. Das Ergebnis braucht keinen eigenen Platz mehr, es
          ist einfach die Stelle, an der die Saison gerade steht.

          WAS ES KOSTET, gemessen und nicht geschaetzt: Der Kopfbereich
          waechst bei 1920 Pixeln von 560 auf 615 und bei 390 von 760 auf
          835. Der naechste Gegner steht nicht mehr in 24 Pixel grosser
          Schrift da, sondern als einer von fuenf Eintraegen. Deshalb traegt
          genau dieser Eintrag eine gelbe Oberkante UND das Wort
          "Naechstes Spiel". Nur die Kante allein, wie bei Eintracht, ist zu
          leise fuer die wichtigste Angabe der Seite.

          UND DIE SCHUHE MUSSTEN AB. Das ist der unangenehme Teil. Sie
          haengen bei 62 Prozent der Linie, der fuenfte Eintrag des Bandes
          liegt dort. Verschieben hilft nicht dauerhaft, weil beide Werte
          verschieden mit der Fensterbreite wandern. Dahinter steckt aber
          etwas, das man erst beim Bauen sieht: Die Schuhe waren die Antwort
          auf eine LEERE Linie. Sobald die Linie ein Band traegt, hat sie
          ihre Aufgabe, und das Motiv verliert seinen Grund. Die Datei
          public/fussballschuhe.png bleibt liegen, samt Quelle unter
          assets/quellen, falls das Band je wieder verschwindet.
        */}
        {band.length > 0 && (
          <div className="animate-fade-up relative flex flex-col gap-4 border-t-2 border-fisch-yellow pt-5 sm:border-t-0">
            {/*
              Die verblassende Linie bleibt. Sie laeuft weiterhin quer durch
              das angeschnittene Wappen, und die Messwerte dazu stehen
              unveraendert: Das Wappen beginnt je nach Fensterbreite bei
              79,6 Prozent (1920), 66,4 (1600), 59,9 (1440), 53,3 (1280)
              oder 40,8 (1024). Die Endfarbe ist rgb(243 218 11 / 0) und
              nicht transparent, sonst mischen manche Browser sichtbar ueber
              Grau.
            */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 hidden h-[2px] sm:block"
              style={{
                background:
                  "linear-gradient(to right, rgb(243 218 11) 0%, rgb(243 218 11) 66%, rgb(243 218 11 / 0.14) 82%, rgb(243 218 11 / 0) 100%)",
              }}
            />

            {/*
              Kein justify-between. Sonst steht der Hinweis am rechten
              Containerrand, also mitten im Wappen und dort unlesbar.
            */}
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-fisch-yellow">
                Die Saison bis hierher
              </p>
              {/*
                DER HINWEIS AUF EIN FEHLENDES ERGEBNIS ist kein Schmuck.
                Am 08.09.2026 lag im Spielplan ein Spiel vom 06.09. ohne
                Eintrag. Ohne diese Zeile zeigt die Startseite am Dienstag
                das Ergebnis vom vorletzten Sonntag als das letzte, und
                zwar genau denen, die beim Spiel dabei waren. Die
                Ableitung steht in lib/ergebnis.ts.
              */}
              {stand.offen && (
                <span className="inline-flex items-center gap-2 text-xs text-text-leise">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-fisch-yellow"
                  />
                  Ergebnis vom {formatDatum(stand.offen.datum)} folgt
                </span>
              )}
            </div>

            <div className="relative">
              {/*
                -mx-5 px-5 und nicht -mx-4 px-4: container-fisch hat unter
                sm genau 1,25rem Innenabstand. Mit 4 statt 5 beginnt der
                erste Eintrag 4 Pixel links vom uebrigen Text, und das
                sieht man.

                scroll-px-5 gehoert dazu und ist nicht doppelt gemoppelt.
                Ohne diesen Wert zieht snap-mandatory den ersten Eintrag
                an die Kante des Scrollbereichs und setzt scrollLeft von
                selbst auf 20. Der Innenabstand ist dann zwar gesetzt,
                aber weggescrollt: Gemessen am 08.09.2026 begann der
                erste Eintrag bei x=0 statt bei x=20, waehrend der Text
                darueber bei 20 anfing.

                Ein eingefasster Scroller ist etwas anderes als ein
                Ueberlauf der Seite. Nachgemessen bei 390 Pixeln:
                scrollWidth gleich innerWidth, die Seite selbst bekommt
                keinen Querbalken.
              */}
              <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:scroll-px-0">
                {band.map((s) => {
                  const ausgang = ausgangVon(s);
                  const tore = toreAusVereinssicht(s);
                  const istNaechstes = s.datum === naechstesSpiel?.datum;
                  const vergangen = s.datum < heute;
                  return (
                    <li
                      key={`${s.datum}-${s.auswaerts}`}
                      className={cn(
                        "min-w-[168px] shrink-0 snap-start border-t-2 pt-3 sm:min-w-[176px]",
                        istNaechstes ? "border-fisch-yellow" : "border-linie"
                      )}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-leise">
                        {istNaechstes ? (
                          <span className="text-fisch-yellow">Nächstes Spiel</span>
                        ) : (
                          <>
                            {formatDatum(s.datum)} ·{" "}
                            {s.ort === "Heim" ? "Heim" : "Auswärts"}
                          </>
                        )}
                      </p>
                      <p className="mt-1.5 truncate text-sm font-bold text-text">
                        {gegnerVon(s)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        {tore ? (
                          <>
                            <AusgangsZeichen ausgang={ausgang} />
                            <span className="font-display text-lg font-extrabold text-text">
                              {tore[0]}:{tore[1]}
                            </span>
                          </>
                        ) : vergangen ? (
                          <span className="text-sm text-text-leise">noch offen</span>
                        ) : (
                          /*
                            Das Datum steht hier NUR beim naechsten Spiel.
                            Bei den uebrigen kommenden Partien steht es
                            schon in der Zeile darueber, und am 08.09.2026
                            stand im Bildschirmfoto zweimal "20.09.2026"
                            untereinander im selben Eintrag. Der Eintrag
                            "Naechstes Spiel" hat oben stattdessen sein
                            Etikett und braucht das Datum deshalb hier.
                          */
                          <span className="font-display text-lg font-extrabold text-fisch-yellow">
                            {istNaechstes ? `${formatDatum(s.datum)} · ` : ""}
                            {s.uhrzeit}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {/*
                Verlauf am rechten Rand, nur auf dem Handy: Er zeigt, dass
                das Band weitergeht. Ein abgeschnittener Eintrag allein
                reicht als Hinweis nicht, wenn er zufaellig genau an einer
                Kante endet.
              */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -right-5 w-12 bg-gradient-to-l from-fisch-black to-transparent sm:hidden"
              />
            </div>

            <div>
              <Link
                href="/fussball/spielplan"
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-fisch-yellow px-5 py-2.5 text-sm font-bold text-fisch-black transition-colors hover:bg-fisch-yellow-dark"
              >
                Kompletter Spielplan{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
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
