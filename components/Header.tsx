import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/lib/config";
import MainMenu from "@/components/MainMenu";
import PraesentiertVon from "@/components/PraesentiertVon";

/*
 * Kopfleiste.
 *
 * Sie trägt seit dem 02.09.2026 nur noch drei Dinge: Wappen mit Vereinsnamen,
 * den Menü-Knopf und den Fanshop. Die frühere Leiste mit sieben Punkten und
 * vier Ausklappmenüs ist in das vollflächige Menü gewandert, siehe MainMenu.tsx.
 *
 * Diese Datei ist dadurch wieder eine Server-Komponente: sie enthält keinen
 * Zustand mehr, nur noch Auszeichnung. Der interaktive Teil steckt allein in
 * MainMenu.
 */

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
     */
    <header className="sticky top-0 z-[60] border-b-2 border-text bg-fisch-yellow">
      {/*
        Drei Spalten statt links/rechts: 1fr auto 1fr sorgt dafür, dass der
        Fanshop-Knopf WIRKLICH mittig steht und nicht dorthin rutscht, wo die
        beiden Seiten ihn gerade hinlassen. Wäre es ein einfaches
        justify-between mit drei Kindern, verschöbe sich die Mitte mit jeder
        Änderung an Wappen oder Menü-Beschriftung.
      */}
      <div className="container-fisch grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-3">
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
          <span className="hidden flex-col leading-none sm:flex">
            {/* Schwarz, weil die Kopfleiste gelb ist. Das Gelb steht am header und
                nicht in dieser Klassenliste, deshalb muss es hier ausdruecklich
                stehen. */}
            <span className="font-display text-xl font-extrabold uppercase tracking-tight text-fisch-black">
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
            <span className="mt-1.5 font-display text-[11px] font-extrabold tracking-[0.35em] text-fisch-black">
              {siteConfig.founded}
            </span>
          </span>
        </Link>

        <div className="flex justify-center">
          <a
            href={siteConfig.fanshopUrl}
            target="_blank"
            rel="noopener noreferrer"
            /* Auf gelbem Grund muss der Knopf schwarz sein, sonst verschwindet er. */
            className="whitespace-nowrap rounded-full bg-fisch-black px-5 py-2.5 text-sm font-bold text-fisch-yellow transition-colors hover:bg-fisch-ink sm:px-7"
          >
            Fanshop
          </a>
        </div>

        <div className="flex justify-end">
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
                groesse="h-12 w-auto sm:h-14"
                className="sm:items-end"
              />
            }
          />
        </div>
      </div>
    </header>
  );
}
