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
  saisonVon,
  toreAusVereinssicht,
} from "@/lib/ergebnis";
import AusgangsZeichen from "@/components/AusgangsZeichen";
import VereinsFenster, { type FensterBild } from "@/components/VereinsFenster";
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
 * Man City führen alle mit etwas Konkretem statt mit einem Anspruch.
 *
 * Hier stand bis zum 22.09.2026 der Satz "Wir haben keine Fotos, aber wir
 * haben echte, gegen FuPa geprüfte Spieldaten". Die erste Hälfte stimmt
 * nicht mehr: Rechts steht seit dem 22.09. ein Bildfenster mit einem echten
 * Vereinsfoto, auf dem Handy randlos über die volle Breite. Die zweite
 * Hälfte gilt unverändert, beides steht jetzt nebeneinander.
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
  /*
   * Was im Bildfenster rechts steht. Kommt von der Seite und nicht von hier,
   * weil der Abruf bei Meta dorthin gehoert, wo auch der Spielplan geholt
   * wird. Sonst haette der Kopfbereich eine eigene Datenquelle, und bei
   * einem Ausfall waere nicht mehr zu sehen, wer wen fragt.
   */
  fensterBild: FensterBild;
}

export default function Hero({
  fensterBild,
  naechsterTermin,
  naechstesSpiel,
  spielplan,
}: HeroProps) {
  const heute = heuteInDeutschland();
  /*
   * VIER EINTRAEGE, NICHT FUENF, seit dem 22.09.2026.
   *
   * Die Standardwerte von saisonBand sind drei zurueck und zwei voraus. Sie
   * stammen vom 08.09., als der Kopfbereich noch die ganze Breite hatte: Bei
   * 1920 Pixeln passten fuenf Eintraege in eine Zeile (fuenf mal 176 plus
   * vier mal 12 ergibt 928, die Zeile hatte 1216).
   *
   * Seit rechts das Bildfenster sitzt, hat die Zeile noch 776 Pixel. Der
   * fuenfte Eintrag brach um und stand allein in einer zweiten Zeile, mit
   * eigener Oberkante. Das sah nach Fehler aus.
   *
   * Weggefallen ist das UEBERNAECHSTE Spiel, nicht ein Ergebnis: Drei
   * Ergebnisse zeigen eine Form, ein einzelnes nur ein Ereignis, und das
   * naechste Spiel ist die wichtigste Angabe der Seite. Das uebernaechste
   * steht zwei Bildschirme tiefer unter "Naechste Spiele".
   */
  const band = saisonBand(spielplan, heute, 3, 1);
  const stand = letzterSpielstand(spielplan, heute);
  const saison = saisonVon(band);

  return (
    <section className="relative overflow-hidden bg-fisch-black text-text">
      {/*
        DAS WAPPEN BLEIBT IM HINTERGRUND, und das ist eine Korrektur.

        Beim Einbau des Bildfensters am 22.09.2026 hatte ich es entfernt, mit
        der Begruendung, ein Wappen sei eine Marke und kein Bild und stehe in
        der Kopfleiste ohnehin schon. Dominics Rueckfrage war: "warum machst
        du das SV Fisch Logo so wie es vorher war nicht einfach in den
        Hintergrund?" Nebeneinandergestellt ist der Fall eindeutig: Ohne
        Wappen war rechts neben dem Fenster einfach schwarze Flaeche, rund
        350 Pixel bei 1920. Mit Wappen liegt das Foto darauf wie eine Karte
        auf einem Grund, und die Flaeche ist gefuellt statt leer.

        Der Fehler dahinter war ein gedanklicher: Ich hatte "Wappen ODER
        Foto" gerechnet, weil beide an derselben Stelle sassen. Sie liegen
        aber in verschiedenen Ebenen, und das Fenster ist klein genug, dass
        daneben Platz bleibt.

        NUR AB lg. Darunter laeuft das Foto randlos ueber die volle Breite
        und deckt das Wappen vollstaendig ab, gemessen bei 390 und 768
        Pixeln. Es dort zu laden hiesse, eine Datei zu holen, die niemand zu
        sehen bekommt.

        Der Verlauf von links gehoert dazu und ist nicht dekorativ: Ohne ihn
        laeuft die Schrift in die gelben Flaechen des Wappens. Die beiden
        anderen Verlaeufe von frueher sind weg und bleiben weg. Der eine
        dunkelte auf dem Handy die Stelle, an der Schrift auf dem Wappen lag,
        dort liegt jetzt das Foto. Der andere gab dem gelben Knopf eine Kante
        gegen den gelben Ring, und der Knopf steht jetzt links, das Wappen
        rechts.
      */}
      {/*
        DIE ROLLBEWEGUNG, seit dem 22.09.2026, Idee vom Auftraggeber: Das
        Wappen kommt klein von links herein, wird beim Rollen groesser und
        kommt oben rechts zur Ruhe.

        Sie laeuft ueber CSS und nicht ueber gsap, obwohl das Paket im Projekt
        liegt. Der Grund steht oben im Kommentar zur Einblendung: Frueher
        startete der ganze Kopfbereich bei Deckkraft 0 und wurde erst durch
        JavaScript sichtbar. Lief das Skript nicht, war der erste Bildschirm
        leer. Eine CSS-Animation braucht kein JavaScript, und die Regel fuer
        "Bewegung reduzieren" in globals.css setzt sie sofort auf den
        Endzustand.

        WAS SIE NICHT KOSTET: transform verschiebt nichts im Layout, also gibt
        es keinen Versatz beim Laden. Die Deckkraft bleibt durchgehend bei 1,
        das Wappen ist also auch waehrend der Bewegung da und haengt nicht
        davon ab, dass sie laeuft.

        Die Rechnung zur Drehzahl steht bei --animate-wappen-rollt.
      */}
      <Image
        src="/logo.svg"
        alt=""
        width={900}
        height={900}
        priority
        aria-hidden="true"
        className="wappen-rad animate-wappen-rollt pointer-events-none absolute -right-40 -top-32 hidden h-[760px] w-[760px] lg:block"
      />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-fisch-black via-fisch-black/95 to-transparent lg:block" />

      {/*
        Halbton-Raster ueber dem Verlauf und unter dem Text, siehe
        globals.css. Es gibt der schwarzen Flaeche eine Textur, ohne die
        Schrift schlechter lesbar zu machen.
      */}
      <div className="halbton pointer-events-none absolute inset-0" aria-hidden="true" />

      {/*
        ZWEISPALTIG AB lg, darunter untereinander mit dem Bild zuerst.

        Die 24rem fuer das Fenster sind nicht geraten: Bei 1920 Pixeln ist
        der Inhaltsbereich 1216 breit, davon nimmt das Fenster 384 und laesst
        dem Spielband 776. Das Band braucht fuer fuenf Eintraege 928 Pixel
        (fuenf mal 176 plus vier mal 12), passt also nicht mehr in eine Zeile
        und bricht auf vier plus einen um. Das ist beabsichtigt: Lieber ein
        Umbruch im Band als ein Bild, das zu klein ist, um ein Bild zu sein.

        items-center und nicht items-end: Das Fenster ist niedriger als die
        Textspalte, und unten buendig saehe es aus, als haenge es am Rand.
      */}
      <div className="container-fisch relative grid gap-8 py-10 sm:py-12 lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-center lg:gap-14 lg:py-16">
        {/*
          Auf dem Handy steht das Bild ZUERST, ab lg rechts. Das ist die
          Reihenfolge der Referenzen: Union Berlin und der BVB fuehren auf
          dem Handy mit dem Foto, nicht mit dem Vereinsnamen.

          min-w-0 AN BEIDEN FELDERN, und das ist kein Schmuck. Ohne es war
          das Bildfeld bei 390 Pixeln Bildschirmbreite 978 Pixel breit,
          gemessen am 22.09.2026. Der Grund ist derselbe wie am 08.09. bei
          TeamTableMini: Raster- und Flexfelder haben min-width: auto und
          schrumpfen nicht unter die Breite ihres Inhalts. Der Inhalt ist
          hier das Spielband, das fuer fuenf Eintraege 928 Pixel verlangt.
          Es zog die ganze Spalte auf, und das Foto zeigte statt des Motivs
          einen Ausschnitt aus der Bildmitte, naemlich Hosenbeine.

          Die Lehre steht seit dem 08.09. im Projekt. Sie noch einmal zu
          lernen hat eine halbe Stunde gekostet.
        */}
        <div className="animate-fade-up relative min-w-0 lg:order-2">
          <VereinsFenster bild={fensterBild} />

          {/*
            DAS WAPPEN TRITT AUF UND GEHT WIEDER, nur auf dem Handy.

            Bis zum 23.09.2026 lief die Rollbewegung erst ab 1024 Pixeln, auf
            dem Handy gab es sie gar nicht. Der Auftraggeber wollte sie dort
            auch, und der erste Gedanke war ein zweites, kleineres Wappen, das
            liegen bleibt. Sein Einwand war besser: Es soll "einmal elegant
            erscheinen und dann verschwinden und fuer das Bild Platz machen".

            Damit loest sich das Platzproblem von selbst. Auf 375 Pixeln
            Breite konkurriert ein liegenbleibendes Wappen mit dem Foto, ein
            auftretendes nicht.

            360 PIXEL, OBWOHL DAS FOTO NUR 250 HOCH IST. Das Wappen ragt
            damit rund 110 Pixel darunter hinaus, ueber die Zeile "Aus dem
            Vereinsleben". Ich hatte es deshalb auf 210 verkleinert, bis der
            Auftraggeber sagte: "das es herausragt ist garnicht schlimm."

            Er hat recht, und der Grund ist der Zweck: Das hier ist ein
            Auftritt und kein Wasserzeichen. Ein Wappen, das brav im
            Bilderrahmen bleibt, wirkt wie ein Aufkleber; eines, das darueber
            hinausgeht, wirkt, als komme es von woanders her und ziehe
            weiter. Nach 2,4 Sekunden ist es ohnehin weg, und die Zeile
            darunter ist waehrenddessen nur halb verdeckt.

            ES LIEGT UEBER DEM FOTO UND NICHT DAHINTER. Dahinter waere es nur
            an den Raendern zu sehen, also als zwei Sicheln links und rechts,
            und niemand erkaeme darauf, dass das ein Wappen ist. Darueber
            bleibt das Foto trotzdem sichtbar: Die Deckkraft liegt bei 0,92,
            und nach 2,4 Sekunden ist das Wappen ganz weg.

            lg:hidden, weil ab da das grosse Wappen im Hintergrund steht und
            liegen bleibt. Zwei rollende Wappen auf einem Bildschirm waeren
            eines zu viel.

            aria-hidden und pointer-events-none: Es ist reine Zier, darf nicht
            vorgelesen werden und keine Klicks abfangen. Das Fenster darunter
            fuehrt zu Instagram, und das muss vom ersten Moment an anklickbar
            sein, auch waehrend die Animation laeuft.
          */}
          <Image
            src="/logo.svg"
            alt=""
            width={900}
            height={900}
            priority
            aria-hidden="true"
            className="wappen-rad wappen-auftritt pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] lg:hidden"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-7 sm:gap-8 lg:order-1">
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
              {/*
                "Die Saison bis hierher" stand hier bis zum 22.09.2026 und
                war schief: Unter der Zeile liegen drei gespielte Partien UND
                die naechsten zwei. "Bis hierher" behauptet reine
                Vergangenheit. Die Spielzeit dagegen sagt etwas, das sonst
                nirgends im Kopfbereich steht, und wiederholt nicht die gelbe
                Kante mit "Naechstes Spiel". Sie kommt aus den Spielen selbst,
                siehe saisonVon() in lib/ergebnis.ts.
              */}
              <p className="text-xs font-bold uppercase tracking-widest text-fisch-yellow">
                {saison ? `Saison ${saison}` : "Die Spiele der Saison"}
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
              {/*
                AB sm EIN RASTER STATT flex-wrap, seit dem 22.09.2026.

                Mit flex-wrap und fester Mindestbreite passten die fuenf
                Eintraege in eine Zeile, solange der Kopfbereich die ganze
                Breite hatte. Seit rechts das Bildfenster sitzt, sind es bei
                1920 Pixeln noch 776 statt 1216. Fuenf Eintraege brauchen 928,
                also brach der fuenfte um und stand allein in einer zweiten
                Zeile, mit eigener Oberkante. Das sah nach Fehler aus.

                auto-fit mit minmax loest das an jeder Breite und nicht nur
                bei 1920: Der Browser nimmt so viele Spalten, wie bei 9,5rem
                Mindestbreite hineinpassen, und die Eintraege fuellen die
                Zeile immer ganz aus. Ob das vier oder fuenf sind, entscheidet
                der Platz und nicht eine Zahl im Code.

                Unter sm bleibt es ein Scroller mit Einrastpunkten. Dort ist
                Wischen richtig, Umbrechen wuerde vier Zeilen ergeben.
              */}
              <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] sm:overflow-visible sm:px-0 sm:scroll-px-0">
                {band.map((s) => {
                  const ausgang = ausgangVon(s);
                  const tore = toreAusVereinssicht(s);
                  const istNaechstes = s.datum === naechstesSpiel?.datum;
                  const vergangen = s.datum < heute;
                  return (
                    <li
                      key={`${s.datum}-${s.auswaerts}`}
                      className={cn(
                        /*
                          sm:min-w-0 hebt die Mindestbreite im Raster wieder
                          auf. Sonst gewinnt sie gegen die Spaltenbreite, und
                          auto-fit kann nicht mehr verteilen. Unter sm bleibt
                          sie, dort traegt sie den Scroller.
                        */
                        "min-w-[168px] shrink-0 snap-start border-t-2 pt-3 sm:min-w-0",
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
      </div>
    </section>
  );
}
