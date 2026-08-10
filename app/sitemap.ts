import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getAllNews } from "@/lib/content";

const staticRoutes = [
  "",
  "/verein/vorstand",
  "/verein/sponsoren",
  "/verein/mitglied-werden",
  "/verein/satzung",
  "/fussball/kader",
  "/fussball/tabelle",
  "/fussball/spielplan",
  "/fussball/bambini",
  "/fussball/bambini/spielplan",
  "/darts",
  "/gymnastik",
  "/aktuelles",
  "/kalender",
  "/elfer-turnier",
  "/galerie",
  "/kontakt",
  "/impressum",
  "/datenschutz",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const newsEntries: MetadataRoute.Sitemap = getAllNews().map((artikel) => ({
    url: `${siteConfig.url}/aktuelles/${artikel.slug}`,
    lastModified: new Date(artikel.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...newsEntries];
}
