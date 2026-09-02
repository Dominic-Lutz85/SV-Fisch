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
}

export default function SocialIcons({ className }: SocialIconsProps) {
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
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-fisch-yellow hover:text-fisch-black"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
