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
  const fussballLinks = mainNav.find((i) => i.label === "Fußball")?.children ?? [];

  return (
    <footer className="mt-24 bg-fisch-black text-fisch-white">
      <div className="container-fisch grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="" width={44} height={44} className="h-11 w-11" />
            <span className="font-display text-lg font-bold">{siteConfig.shortName}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fisch-white/70">
            {siteConfig.claim}
          </p>
          <address className="mt-4 text-sm not-italic text-fisch-white/70">
            {siteConfig.contact.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <SocialIcons className="mt-5" />
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-fisch-yellow">
            Der Verein
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {vereinLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-fisch-white/80 hover:text-fisch-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-fisch-yellow">
            Fußball & mehr
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {fussballLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-fisch-white/80 hover:text-fisch-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/darts" className="text-fisch-white/80 hover:text-fisch-white">
                Darts
              </Link>
            </li>
            <li>
              <Link href="/gymnastik" className="text-fisch-white/80 hover:text-fisch-white">
                Gymnastik
              </Link>
            </li>
            <li>
              <Link href="/galerie" className="text-fisch-white/80 hover:text-fisch-white">
                Galerie
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-fisch-yellow">
            Newsletter
          </h3>
          <p className="mt-4 text-sm text-fisch-white/70">
            Spielergebnisse, Termine und Vereinsneuigkeiten – direkt ins Postfach.
          </p>
          <NewsletterForm />
        </div>
      </div>

      {sponsoren.length > 0 && (
        <div className="border-t border-white/10 py-10">
          <div className="container-fisch">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wider text-fisch-white/50">
              Unsere Sponsoren
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {sponsoren.map((s) => (
                <a
                  key={s.name}
                  href={s.url && s.url !== "#" ? s.url : undefined}
                  target={s.url && s.url !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  aria-label={s.name}
                >
                  <Image
                    src={s.logo}
                    alt={`Logo ${s.name} [Platzhalter – Datei ersetzen]`}
                    width={100}
                    height={50}
                    className="h-10 w-auto rounded bg-fisch-white/5 object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-white/10">
        <div className="container-fisch flex flex-col items-center justify-between gap-4 py-6 text-xs text-fisch-white/60 sm:flex-row">
          <p>
            © {jahr} {siteConfig.name} · Alle Rechte vorbehalten
          </p>
          <nav aria-label="Rechtliches" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/impressum" className="hover:text-fisch-white">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-fisch-white">
              Datenschutz
            </Link>
            <Link href="/verein/sponsoren" className="hover:text-fisch-white">
              Links & Partner
            </Link>
            <a
              href={siteConfig.fanshopUrl}
              target="_blank"
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
