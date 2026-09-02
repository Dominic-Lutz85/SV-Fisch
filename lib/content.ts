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

/**
 * Heutiges Datum als "JJJJ-MM-TT" in der Ortszeit des Vereins.
 *
 * Bewusst über Intl und nicht über new Date(): Der Server kann in UTC laufen,
 * dann liegt Mitternacht zwei Stunden daneben und ein Sonntagsspiel wäre am
 * Sonntagabend noch "kommend" oder am Samstagabend schon "vergangen". Das Format
 * JJJJ-MM-TT lässt sich direkt mit dem Feld `datum` vergleichen, ohne Rechnerei.
 */
export function heuteInDeutschland(jetzt: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(jetzt);
}

/*
 * WICHTIG für alle, die hier etwas ändern: Ob ein Spiel kommend oder vergangen
 * ist, wird ausschließlich aus dem DATUM abgeleitet, nie aus dem Feld `gespielt`.
 *
 * Vorher stand hier `filter((s) => !s.gespielt)`. Damit hing die Startseite an
 * einem Haken, den jemand nach jedem Spieltag von Hand umlegen musste. Am
 * 02.09.2026 standen deshalb unter der Überschrift "Nächste Spiele" drei
 * Partien vom 16., 23. und 30. August, alle längst gespielt. Niemand hatte
 * etwas falsch eingetragen, es hatte nur niemand nachgepflegt. Ein Datum
 * veraltet nicht, ein Haken schon.
 */

export function getKommendeSpiele(
  spiele: Spiel[],
  anzahl = 3,
  heute: string = heuteInDeutschland()
): Spiel[] {
  // spiele kommt aus getSpielplan() bereits aufsteigend sortiert
  return spiele.filter((s) => s.datum >= heute).slice(0, anzahl);
}

/** Vergangene Spiele, das jüngste zuerst. Auch die ohne eingetragenes Ergebnis. */
export function getVergangeneSpiele(
  spiele: Spiel[],
  heute: string = heuteInDeutschland()
): Spiel[] {
  return spiele.filter((s) => s.datum < heute).reverse();
}

export function getLetzteErgebnisse(
  spiele: Spiel[],
  anzahl = 3,
  heute: string = heuteInDeutschland()
): Spiel[] {
  return getVergangeneSpiele(spiele, heute).slice(0, anzahl);
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

const PUBLIC_DIR = path.join(process.cwd(), "public");

/** Liegt die Datei wirklich unter /public? */
export function bildVorhanden(src: string): boolean {
  if (!src.startsWith("/")) return true; // externe Adresse, können wir nicht prüfen
  return fs.existsSync(path.join(PUBLIC_DIR, src.replace(/^\//, "")));
}

/*
 * Galerie mit Existenzprüfung.
 *
 * Anlass: In galerie.json standen die Alben "Vereinsfeste" und "Bambini in
 * Aktion" mit Bildpfaden, zu denen es keine Dateien gab. Auf der
 * veröffentlichten Seite standen dadurch graue Kästen, in denen der Alt-Text
 * zu lesen war, wörtlich "[Platzhalter – Datei ersetzen]".
 *
 * Ein fehlendes Bild wird deshalb hier ausgesiebt statt kaputt angezeigt, und
 * beim Bauen einmal gemeldet, damit es nicht still verschwindet. Ein Album ohne
 * ein einziges vorhandenes Bild fällt ganz weg: eine leere Überschrift ist
 * ehrlicher als eine Reihe kaputter Kacheln, und besser als beides ist, dass
 * derjenige, der die Bilder nachliefert, es in der Bau-Ausgabe sieht.
 */
export function getGalerie(): GalerieAlbum[] {
  const fehlend: string[] = [];

  const alben = (galerieData as GalerieAlbum[])
    .map((album) => {
      const bilder = album.bilder
        .map((bild) => ({ ...bild, src: normalizeAssetPath(bild.src)! }))
        .filter((bild) => {
          const da = bildVorhanden(bild.src);
          if (!da) fehlend.push(bild.src);
          return da;
        });

      const cover = normalizeAssetPath(album.cover)!;
      return {
        ...album,
        cover: bildVorhanden(cover) ? cover : bilder[0]?.src,
        bilder,
      };
    })
    .filter((album) => album.bilder.length > 0) as GalerieAlbum[];

  if (fehlend.length > 0) {
    console.warn(
      `[Galerie] ${fehlend.length} Bild(er) in content/galerie.json haben keine Datei unter /public und werden nicht angezeigt:` +
        fehlend.map((f) => `
  ${f}`).join("")
    );
  }

  return alben;
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
