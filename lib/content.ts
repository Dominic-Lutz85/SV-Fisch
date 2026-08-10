import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import vorstandData from "@/content/vorstand.json";
import sponsorenData from "@/content/sponsoren.json";
import kaderData from "@/content/kader.json";
import kaderBambiniData from "@/content/kader-bambini.json";
import tabelleData from "@/content/tabelle.json";
import spielplanData from "@/content/spielplan.json";
import spielplanBambiniData from "@/content/spielplan-bambini.json";
import termineData from "@/content/termine.json";
import galerieData from "@/content/galerie.json";

import type {
  VorstandsMitglied,
  Sponsor,
  Spieler,
  TabellenZeile,
  Spiel,
  Termin,
  NewsArtikel,
  NewsFrontmatter,
  GalerieAlbum,
} from "@/types/content";
import { normalizeAssetPath } from "@/lib/utils";

const NEWS_DIR = path.join(process.cwd(), "content", "news");

export function getVorstand(): VorstandsMitglied[] {
  return vorstandData as VorstandsMitglied[];
}

export function getSponsoren(): Sponsor[] {
  return (sponsorenData as Sponsor[]).map((s) => ({
    ...s,
    logo: normalizeAssetPath(s.logo)!,
  }));
}

export function getKader(): Spieler[] {
  return kaderData as Spieler[];
}

export function getKaderBambini(): Spieler[] {
  return kaderBambiniData as Spieler[];
}

export function getTabelle(): TabellenZeile[] {
  return [...(tabelleData as TabellenZeile[])].sort((a, b) => a.platz - b.platz);
}

export function getSpielplan(): Spiel[] {
  return [...(spielplanData as Spiel[])].sort(
    (a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime()
  );
}

export function getSpielplanBambini(): Spiel[] {
  return [...(spielplanBambiniData as Spiel[])].sort(
    (a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime()
  );
}

export function getKommendeSpiele(spiele: Spiel[], anzahl = 3): Spiel[] {
  return spiele.filter((s) => !s.gespielt).slice(0, anzahl);
}

export function getLetzteErgebnisse(spiele: Spiel[], anzahl = 3): Spiel[] {
  return [...spiele]
    .filter((s) => s.gespielt)
    .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())
    .slice(0, anzahl);
}

export function getTermine(): Termin[] {
  return [...(termineData as Termin[])].sort(
    (a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime()
  );
}

export function getNaechsterTermin(): Termin | undefined {
  const jetzt = Date.now();
  return getTermine().find((t) => new Date(t.datum).getTime() >= jetzt);
}

export function getGalerie(): GalerieAlbum[] {
  return (galerieData as GalerieAlbum[]).map((album) => ({
    ...album,
    cover: normalizeAssetPath(album.cover)!,
    bilder: album.bilder.map((bild) => ({
      ...bild,
      src: normalizeAssetPath(bild.src)!,
    })),
  }));
}

export function getAllNews(): NewsArtikel[] {
  if (!fs.existsSync(NEWS_DIR)) return [];

  const dateien = fs.readdirSync(NEWS_DIR).filter((f) => f.endsWith(".md"));

  const artikel = dateien.map((dateiname) => {
    const rohtext = fs.readFileSync(path.join(NEWS_DIR, dateiname), "utf8");
    const { data, content } = matter(rohtext);
    const frontmatter = data as NewsFrontmatter;
    return {
      ...frontmatter,
      teaserbild: normalizeAssetPath(frontmatter.teaserbild),
      content,
    };
  });

  return artikel.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getNewsBySlug(slug: string): NewsArtikel | undefined {
  return getAllNews().find((a) => a.slug === slug);
}

export function getNewsByKategorie(
  kategorie?: string
): NewsArtikel[] {
  const alle = getAllNews();
  if (!kategorie || kategorie === "Alle") return alle;
  return alle.filter((a) => a.kategorie === kategorie);
}
