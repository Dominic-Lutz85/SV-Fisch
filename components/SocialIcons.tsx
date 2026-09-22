import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  TikTokIcon,
} from "@/components/icons/SocialGlyphs";

interface SocialIconsProps {
  className?: string;
  /*
   * Auf welchem Grund die Zeichen stehen.
   *
   * "dunkel" ist der bisherige Fall, Fusszeile und Menue: helle Zeichen, beim
   * Darueberfahren eine gelbe Flaeche mit schwarzem Zeichen.
   *
   * "gelb" ist seit dem 22.09.2026 die Kopfleiste. Dort waere dieselbe
   * Behandlung falsch: Eine gelbe Flaeche auf gelbem Grund ist keine, und die
   * Zeichen selbst muessen schwarz sein, weil auf Vereinsgelb Schwarz gilt.
   * Die Regel steht bei --color-fisch-yellow-dark in globals.css.
   */
  grund?: "dunkel" | "gelb";
}

export default function SocialIcons({
  className,
  grund = "dunkel",
}: SocialIconsProps) {
  const links = [
    { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: siteConfig.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: siteConfig.social.youtube, label: "YouTube", Icon: YoutubeIcon },
    { href: siteConfig.social.tiktok, label: "TikTok", Icon: TikTokIcon },
  ].filter((l) => l.href);

  if (links.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${siteConfig.shortName} auf ${label}`}
          /*
            Kein Rahmen mehr. Ein Rahmen ist ein Aufmerksamkeits-Signal und gehört
            an das, was Aufmerksamkeit verdient. Im Vergleich rahmt Ajax seine
            zwei wichtigsten Knöpfe ein (Fanshop, Tickets), hier waren die zwei
            unwichtigsten Elemente der Leiste die einzigen mit Rahmen.
          */
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
            grund === "gelb"
              ? "text-fisch-black hover:bg-fisch-black/10"
              : "hover:bg-fisch-yellow hover:text-fisch-black"
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
