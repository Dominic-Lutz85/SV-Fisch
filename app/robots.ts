import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /*
         * /admin ist die Redaktionsoberflaeche. Sie enthaelt keine Inhalte
         * fuer Besucher und soll nicht in den Suchergebnissen auftauchen.
         * Das ist KEIN Schutz: Wer die Adresse kennt, kommt hin. Geschuetzt
         * wird sie dadurch, dass ohne GitHub-Anmeldung nichts geladen und
         * nichts gespeichert werden kann.
         */
        disallow: ["/api/", "/admin"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
