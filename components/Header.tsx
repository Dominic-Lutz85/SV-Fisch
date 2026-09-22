import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/lib/config";
import MainMenu from "@/components/MainMenu";
import PraesentiertVon from "@/components/PraesentiertVon";
import SocialIcons from "@/components/SocialIcons";

/*
 * Kopfleiste.
 *
 * Seit dem 02.09.2026 trug sie nur drei Dinge: Wappen mit Vereinsnamen, den
 * Fanshop und den Menüknopf. Die frühere Leiste mit sieben Punkten und vier
 * Ausklappmenüs war in das vollflächige Menü gewandert, siehe MainMenu.tsx.
 *
 * AM 22.09.2026 KOMMT EIN TEIL DAVON ZURÜCK, und das ist kein Rückschritt,
 * sondern die Antwort auf zwei Befunde.
 *
 * Erstens der Auftraggeber: "mir gefällt die Kopfleiste nicht, ich hätte sie
 * gerne moderner und die Social Medias mit angezeigt." Nachgemessen an sechs
 * Vereinsseiten (Eintracht, Union, St. Pauli, Werder, Mainz 05, Freiburg):
 * Fünf von sechs zeigen ihre wichtigsten Ziele als TEXT in der Leiste, nicht
 * hinter einem Knopf. Hier stand dort nur der Fanshop, zwei Drittel der
 * Fläche waren leer.
 *
 * Zweitens, und das wiegt schwerer als Optik: MainMenu hängt per Portal am
 * body und entsteht erst im Browser. Im ausgelieferten HTML steht es NICHT.
 * Eine Seite, die nur dort verlinkt ist, existiert für Suchmaschinen und für
 * jeden ohne JavaScript nicht; genau so waren /kontakt und /elfer-turnier
 * monatelang unsichtbar. Die fünf Punkte hier stehen im HTML und verlinken
 * damit zum ersten Mal serverseitig auf Spielplan, Tabelle, Kalender, Darts
 * und Gymnastik.
 *
 * ZU DEN SOZIALEN KANÄLEN: Keine der sechs nachgesehenen Vereinsseiten hat
 * sie in der Kopfleiste, alle sechs erst in der Fußzeile. Hier ist es trotzdem
 * richtig, und der Grund ist das Größenverhältnis: Bei einem Profiverein ist
 * die Website der Hauptkanal und Instagram das Beiwerk. Beim SV Fisch hat das
 * Konto 772 Follower und 317 Beiträge, die Website ist Wochen alt. Wer den
 * Verein sucht, kennt Instagram und nicht sv-fisch.com.
 *
 * Diese Datei bleibt eine Server-Komponente: kein Zustand, nur Auszeichnung.
 * Der interaktive Teil steckt allein in MainMenu.
 */

/*
 * Fünf Ziele, und die Auswahl ist nicht nach Gefühl getroffen.
 *
 * Gesucht wird auf einer Vereinsseite dreierlei: wann das nächste Spiel ist,
 * wo die Mannschaft steht, und was sonst los ist. Dazu kommen die beiden
 * anderen Abteilungen, denn ohne sie liest sich die Leiste wie die eines
 * reinen Fußballvereins.
 *
 * "Fußball" als Sammelpunkt wäre falsch: Es gibt keine Seite /fussball, nur
 * die Unterseiten. Ein Punkt, der auf eine seiner eigenen Unterseiten zeigt,
 * verspricht eine Übersicht, die es nicht gibt.
 */
const LEISTE = [
  { label: "Spielplan", href: "/fussball/spielplan" },
  { label: "Tabelle", href: "/fussball/tabelle" },
  { label: "Termine", href: "/kalender" },
  { label: "Darts", href: "/darts" },
  { label: "Gymnastik", href: "/gymnastik" },
] as const;

export default function Header() {
  return (
    /*
     * Kopfleiste in Vereinsgelb.
     *
     * So machen es alle Vorbilder: Man City himmelblau, Bayern rot, Ajax rot.
     * Der BVB ist der interessante Fall, gleiche Farben wie hier, und er nimmt
     * Schwarz mit Gelb als Akzent. Beides ist vertretbar, entschieden wurde
     * Gelb.
     *
     * Kein backdrop-blur mehr: Bei einer deckenden Farbfläche bringt es nichts,
     * und ein Element mit Hintergrundfilter wird zum Bezugsrahmen für
     * position:fixed, was das vollflächige Menü in einen 80-Pixel-Streifen
     * gesperrt hatte. Das Menü hängt zwar inzwischen per Portal am body, aber
     * die Falle muss hier nicht wieder aufgestellt werden.
     *
     * Rand: border-fisch-black, NICHT border-text. --color-text ist
     * #e1e1e1, also die helle Schrift fuer dunkle Flaechen. Auf dem Gelb
     * wurde daraus eine zarte weisse Kante ueber die ganze Breite. Auf
     * Gelb gilt Schwarz, so wie unten bei der Schrift auch.
     */
    <header className="sticky top-0 z-[60] border-b-2 border-fisch-black bg-fisch-yellow">
      {/*
        Hier stand ein Raster aus drei Spalten (1fr auto 1fr), damit der
        Fanshop-Knopf wirklich mittig sass und nicht dorthin rutschte, wo die
        beiden Seiten ihn gerade hinliessen.

        Seit dem 22.09.2026 ist die Mitte keine leere Flaeche mehr, sondern
        traegt die Navigation. Eine erzwungene Mitte waere jetzt das falsche
        Werkzeug: Die Punkte sollen links an der Marke anschliessen und der
        Rest nach rechts, nicht um einen gedachten Mittelpunkt schweben.
        Deshalb eine Reihe mit ml-auto am rechten Block.

        Die Hoehe bleibt bei 80 Pixeln. Das war die Bedingung: Die Leiste soll
        mehr zeigen, ohne mehr vom ersten Bildschirm zu nehmen.
      */}
      <div className="container-fisch flex h-20 items-center gap-4 lg:gap-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label={`${siteConfig.name}, zur Startseite`}
        >
          <Image
            src="/logo.svg"
            alt=""
            width={52}
            height={52}
            priority
            className="h-12 w-12 sm:h-14 sm:w-14"
          />
          {/*
            Der Name stand bis zum 22.09.2026 erst ab sm. Auf dem Handy blieb
            die Leiste dadurch zu zwei Dritteln leer: Wappen links, dann nichts,
            dann Fanshop und Menue. Nachgerechnet bei 390 Pixeln: Wappen 48,
            Name rund 90, Fanshop 110, Menue 40, Abstaende 3 mal 12 ergibt 324
            von 350 verfuegbaren. Es passt, und die Leiste traegt damit auch
            dort den Vereinsnamen.
          */}
          <span className="flex flex-col leading-none">
            {/* Schwarz, weil die Kopfleiste gelb ist. Das Gelb steht am header und
                nicht in dieser Klassenliste, deshalb muss es hier ausdruecklich
                stehen. */}
            <span className="font-display text-base font-extrabold uppercase tracking-tight text-fisch-black sm:text-xl">
              {siteConfig.shortName}
            </span>
            {/*
              Die Jahreszahl steht jetzt ohne "gegr." da. Damit sie als Teil des
              Schriftzugs gelesen wird und nicht als abgeschnittener Satz, bekommt
              sie die Behandlung, die grosse Vereine ihrer Gruendungszahl geben:
              klein, fett, weit gesperrt. Der Name darueber wird dafuer eine Stufe
              groesser und in Versalien gesetzt, sonst tragen die beiden Zeilen
              gleich viel Gewicht und der Block franst aus.
              Schwarz auf Gelb bei 80 Prozent Deckung ergibt 8,89 zu 1.
            */}
            <span className="mt-1 font-display text-[9px] font-extrabold tracking-[0.3em] text-fisch-black sm:mt-1.5 sm:text-[11px] sm:tracking-[0.35em]">
              {siteConfig.founded}
            </span>
          </span>
        </Link>

        {/*
          Die Navigation erscheint ab lg. Darunter fehlt der Platz: Bei 1024
          Pixeln stehen neben den fuenf Punkten noch Wappen, Vereinsname, zwei
          Social-Zeichen, der Fanshop und der Menueknopf in derselben Zeile.
          Wer sie frueher einblendet, bekommt einen Umbruch statt einer Leiste.

          Sie steht im ausgelieferten HTML und ist damit der erste feste
          Verweis auf diese fuenf Seiten, siehe Begruendung oben.
        */}
        <nav aria-label="Schnellzugriff" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {LEISTE.map((punkt) => (
              <li key={punkt.href}>
                <Link
                  href={punkt.href}
                  className="text-sm font-bold uppercase tracking-wide text-fisch-black underline-offset-4 hover:underline"
                >
                  {punkt.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/*
            Ab sm, nicht darunter: Auf einem Handy mit 390 Pixeln stehen Wappen,
            Fanshop und Menueknopf schon so eng, dass zwei weitere Zeichen die
            Zeile sprengen. Dort fuehrt das Bildfenster im Kopfbereich zu
            Instagram, und die Fusszeile hat beide Kanaele.
          */}
          <SocialIcons grund="gelb" className="hidden sm:flex" />

          {/*
            DER GLANZ, seit dem 22.09.2026. Begruendung und Zeiten stehen bei
            --animate-knopf-glanz in globals.css.

            relative und overflow-hidden sind noetig, damit der Streifen am
            Knopf haengt und an seiner Rundung abgeschnitten wird. Ohne
            overflow-hidden laeuft er quer ueber die Kopfleiste.

            Der Streifen liegt in einem eigenen span mit aria-hidden und
            pointer-events-none: Er ist reine Optik und darf weder vorgelesen
            werden noch Klicks abfangen.
          */}
          <a
            href={siteConfig.fanshopUrl}
            target="_blank"
            rel="noopener noreferrer"
            /* Auf gelbem Grund muss der Knopf schwarz sein, sonst verschwindet er. */
            className="relative overflow-hidden whitespace-nowrap rounded-full bg-fisch-black px-5 py-2.5 text-sm font-bold text-fisch-yellow transition-colors hover:bg-fisch-ink sm:px-7"
          >
            Fanshop
            <span
              aria-hidden="true"
              className="animate-knopf-glanz pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, transparent 38%, rgb(243 218 11 / 0.55) 50%, transparent 62%)",
              }}
            />
          </a>

          {/*
            Der Sponsorblock wird hier erzeugt und in das Menue hineingereicht.
            MainMenu ist eine Client-Komponente, PraesentiertVon liest beim
            Bauen Dateien vom Datentraeger, also kann das Menue ihn nicht selbst
            einbinden. Andersherum geht es: eine Serverkomponente darf einer
            Clientkomponente fertige Auszeichnung als Eigenschaft mitgeben.
          */}
          <MainMenu
            sponsor={
              <PraesentiertVon
                key="sponsor"
                groesse="h-16 w-auto sm:h-20 lg:h-24"
                className="items-start lg:items-center"
              />
            }
          />
        </div>
      </div>
    </header>
  );
}
