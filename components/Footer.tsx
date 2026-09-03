import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { mainNav } from "@/lib/navigation";
import { getSponsoren } from "@/lib/content";
import SocialIcons from "@/components/SocialIcons";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  const sponsoren = getSponsoren();
  const jahr = new Date().getFullYear();

  const vereinLinks = mainNav.find((i) => i.label === "Der Verein")?.children ?? [];

  /*
   * Nicht die Gruppe "Fussball" abgreifen, sondern jeden Menuepunkt, der unter
   * /fussball liegt. Der Liveticker haengt im Menue unter "Home", weil er
   * waehrend eines Spiels sofort erreichbar sein soll, gehoert hier unten aber
   * genauso in die Fussballspalte. Ueber den Pfad statt ueber die Gruppe
   * gefiltert, dann kann beim naechsten Umbau des Menues nichts verloren gehen.
   */
  const fussballLinks = mainNav
    .flatMap((i) => i.children ?? [])
    .filter((l) => l.href.startsWith("/fussball"));

  return (
    <footer className="mt-24 border-t border-linie bg-flaeche text-text">
      <div className="container-fisch grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="" width={44} height={44} className="h-11 w-11" />
            <span className="font-display text-lg font-bold">{siteConfig.shortName}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-leise">
            {siteConfig.claim}
          </p>
          <address className="mt-4 text-sm not-italic text-text-leise">
            {siteConfig.contact.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <SocialIcons className="mt-5" />
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-fisch-yellow">
            Der Verein
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {vereinLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-text-leise hover:text-text">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-fisch-yellow">
            Fußball & mehr
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {fussballLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-text-leise hover:text-text">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/darts" className="text-text-leise hover:text-text">
                Darts
              </Link>
            </li>
            <li>
              <Link href="/gymnastik" className="text-text-leise hover:text-text">
                Gymnastik
              </Link>
            </li>
            <li>
              <Link href="/galerie" className="text-text-leise hover:text-text">
                Galerie
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-fisch-yellow">
            Newsletter
          </h2>
          <p className="mt-4 text-sm text-text-leise">
            Spielergebnisse, Termine und Vereinsneuigkeiten – direkt ins Postfach.
          </p>
          <NewsletterForm />
        </div>
      </div>

      {sponsoren.length > 0 && (
        <div className="border-t border-linie py-10">
          <div className="container-fisch">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wider text-text-leise">
              Unsere Sponsoren
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {sponsoren.map((s) => {
                const ziel = s.url && s.url !== "#" ? s.url : undefined;
                /*
                  Helle Platte in fester Groesse, das Logo wird hineingerechnet.
                  Zwei Gruende, beide stehen ausfuehrlich in SponsorWall.tsx:
                  Fuenf der neun Logos sind schwarze Schrift ohne eigenen
                  Hintergrund und waren auf der dunklen Flaeche unsichtbar. Und
                  mit fester Hoehe plus automatischer Breite bestimmt das
                  Seitenverhaeltnis die Flaeche, ein flaches Logo wird dreimal
                  so breit wie ein hohes.
                */
                const logo = (
                  <span className="flex h-14 w-28 items-center justify-center bg-fisch-white p-2">
                    <Image
                      src={s.logo}
                      alt={`Logo ${s.name}`}
                      width={s.breite}
                      height={s.hoehe}
                      className="h-full w-full object-contain"
                    />
                  </span>
                );

                /*
                  Ohne hinterlegte Adresse ein span statt eines Ankers, siehe
                  SponsorWall.tsx. Ein a ohne href ist kein Link, sondern sieht
                  nur so aus, und Lighthouse zählt es unter "Links are not
                  crawlable" gegen die Seite.
                */
                if (!ziel) {
                  return (
                    <span
                      key={s.name}
                      className="opacity-70 grayscale"
                      aria-label={s.name}
                    >
                      {logo}
                    </span>
                  );
                }

                return (
                  <a
                    key={s.name}
                    href={ziel}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    /*
                      Kein grayscale und keine Abdunklung mehr. Das ist ein
                      verbreitetes Muster, aber es faerbt eine fremde Marke um,
                      und die gehoert dem Sponsor. Es widerspricht ausserdem dem
                      Sinn dieser Fassung: Wer bezahlt, wird gezeigt, nicht
                      gedaempft und erst beim Darueberfahren freigegeben.
                    */
                    className="transition-opacity hover:opacity-80"
                    aria-label={s.name}
                  >
                    {logo}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-linie">
        <div className="container-fisch flex flex-col items-center justify-between gap-4 py-6 text-xs text-text-leise sm:flex-row">
          <p>
            © {jahr} {siteConfig.name} · Alle Rechte vorbehalten · Design &amp;
            Umsetzung: Dominic Lutz
          </p>
          <nav aria-label="Rechtliches" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/impressum" className="hover:text-text">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-text">
              Datenschutz
            </Link>
            {/*
              Kontakt stand bisher nur im Hauptmenue und auf den
              Nachrichtenseiten. Auf der Startseite, also der Seite, auf der
              fast jeder ankommt, war die Kontaktseite von nirgendwo verlinkt.
              Das Hauptmenue entsteht erst im Browser und zaehlt dafuer nicht.
            */}
            <Link href="/kontakt" className="hover:text-text">
              Kontakt
            </Link>
            <Link href="/verein/sponsoren" className="hover:text-text">
              Links & Partner
            </Link>
            <a
              href={siteConfig.fanshopUrl}
              target="_blank"
              /* Kein rel="sponsored": Der Fanshop gehoert dem Verein selbst.
                 Die Angabe wuerde Google sagen, der Verein habe diesen Link
                 verkauft, und das stimmt nicht. */
              rel="noopener noreferrer"
              className="rounded-full bg-fisch-yellow px-4 py-1.5 font-bold text-fisch-black hover:bg-fisch-yellow-dark"
            >
              Fanshop
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
