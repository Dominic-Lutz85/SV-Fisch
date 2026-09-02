import type { SVGProps } from "react";

/**
 * Schlanke, selbst gezeichnete Social-Icons.
 * lucide-react führt seit v1 keine Marken-/Social-Icons mehr (Trademark-Gründe),
 * daher hier bewusst ohne Zusatz-Package gelöst.
 */

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      {/*
        Das "f" war als Linie gezeichnet statt als Fläche. Bei 16 Pixeln lief die
        dünne Kontur mit dem Kreis zusammen, auf dem Bildschirm war eine Weltkugel
        zu sehen und kein Facebook-Zeichen. Als gefüllte Form ist es eindeutig.
      */}
      <circle cx="12" cy="12" r="9" />
      <path
        d="M13.8 21V13h2.2l.4-2.8h-2.6V8.4c0-.8.3-1.4 1.5-1.4h1.2V4.5c-.6-.1-1.4-.2-2.2-.2-2.3 0-3.8 1.4-3.8 3.9v2h-2.5V13h2.5v8"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="M10.5 9.5v5l4.3-2.5-4.3-2.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M14 4v10.2a3.3 3.3 0 1 1-3.3-3.3c.3 0 .5 0 .8.1" />
      <path d="M14 4c.2 2 1.7 3.6 3.6 3.9" />
    </svg>
  );
}
