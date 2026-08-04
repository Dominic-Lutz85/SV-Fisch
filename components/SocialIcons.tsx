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
          className="flex h-9 w-9 items-center justify-center rounded-full border border-current/20 transition-colors hover:bg-fisch-yellow hover:text-fisch-black hover:border-fisch-yellow"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
