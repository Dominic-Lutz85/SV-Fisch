import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/lib/config";
import MainMenu from "@/components/MainMenu";

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
    <header className="sticky top-0 z-[60] border-b-2 border-fisch-black bg-fisch-yellow">
      <div className="container-fisch flex h-20 items-center justify-between gap-4">
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
            <span className="font-display text-lg font-bold tracking-tight text-fisch-black">
              {siteConfig.shortName}
            </span>
            <span className="text-xs font-medium text-fisch-black/70">
              gegr. {siteConfig.founded}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href={siteConfig.fanshopUrl}
            target="_blank"
            rel="noopener noreferrer"
            /* Auf gelbem Grund muss der Knopf schwarz sein, sonst verschwindet er. */
            className="rounded-full bg-fisch-black px-5 py-2.5 text-sm font-bold text-fisch-yellow transition-colors hover:bg-fisch-ink"
          >
            Fanshop
          </a>
          <MainMenu />
        </div>
      </div>
    </header>
  );
}
