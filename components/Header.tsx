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
    <header className="sticky top-0 z-[60] border-b border-fisch-line bg-fisch-white/95 backdrop-blur supports-[backdrop-filter]:bg-fisch-white/80">
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
            <span className="text-xs font-medium text-fisch-muted">
              gegr. {siteConfig.founded}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href={siteConfig.fanshopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-fisch-yellow px-5 py-2.5 text-sm font-bold text-fisch-black transition-colors hover:bg-fisch-yellow-dark"
          >
            Fanshop
          </a>
          <MainMenu />
        </div>
      </div>
    </header>
  );
}
