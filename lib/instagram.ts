/*
 * Instagram: der neueste Beitrag des Vereinskontos.
 *
 * WARUM NICHT DAS EINBETTFENSTER VON INSTAGRAM, und das ist gemessen und
 * nicht behauptet (22.09.2026, am Beitrag zum 3:0 gegen FSV Trier-Kuerenz):
 *
 *   908 Pixel hoch ist das offizielle Fenster fuer EINEN Beitrag. Der ganze
 *   Kopfbereich ist 615 Pixel hoch.
 *   5 fremde Server laedt es: www.instagram.com, static.cdninstagram.com und
 *   drei Bildserver. Diese Seite laedt sonst keinen einzigen.
 *   0 Cookies immerhin, aber die IP jedes Besuchers geht trotzdem an Meta,
 *   und schon dafuer braucht es eine Einwilligung. Im ersten Bildschirm
 *   staende also bis zum Klick ein leerer Kasten.
 *   1 Beitrag pro Fenster, einen Profil-Feed bettet Instagram gar nicht ein.
 *
 * Dazu kaeme ein weisser Kasten mit Instagram-Rahmen und halb englischer
 * Beschriftung auf einem schwarzen Kopfbereich.
 *
 * Deshalb derselbe Weg wie bei FuPa: Der Server fragt, der Besucher merkt
 * nichts davon, und das Aussehen bleibt unseres.
 */
/*
 * NUR AUF DEM SERVER. Hier steht der Zugangsschluessel im Spiel, und der
 * darf den Browser nie erreichen. Ein `import "server-only"` waere die
 * Absicherung dafuer, das Paket ist im Projekt aber nicht installiert und
 * eine Abhaengigkeit fuer eine einzelne Zeile ist zu viel. Was schuetzt:
 * INSTAGRAM_TOKEN traegt kein NEXT_PUBLIC_, also ersetzt Next den Wert in
 * Browser-Bausteinen gar nicht erst. Wer diese Datei trotzdem in eine Datei
 * mit "use client" importiert, bekommt dort ein leeres Ergebnis und keinen
 * Fehler. Also: nicht tun.
 */

/*
 * graph.instagram.com, nicht graph.facebook.com. Das ist der Unterschied
 * zwischen den beiden Wegen bei Meta: Dieser laeuft ohne verknuepfte
 * Facebook-Seite, das Konto meldet sich direkt bei Instagram an.
 */
const BASIS = "https://graph.instagram.com";

/*
 * Einzeln aufgezaehlt, denn Meta liefert nur, wonach gefragt wird.
 * thumbnail_url gibt es ausschliesslich bei Videos, media_url fehlt, wenn
 * Meta den Beitrag wegen Urheberrecht markiert hat. Beides muss der Aufrufer
 * aushalten.
 */
const FELDER = "id,caption,media_type,media_url,permalink,timestamp,thumbnail_url";

/*
 * Eine Stunde. Der Verein postet nicht im Minutentakt, und jeder Abruf zaehlt
 * auf Metas Kontingent. Bei FuPa stehen 300 Sekunden, weil dort ein Ergebnis
 * am Sonntagnachmittag zaehlt; hier nicht.
 */
const REVALIDATE = 3600;

export interface InstagramBeitrag {
  id: string;
  /** Adresse des Bildes bei Meta. Geht NIE direkt an den Browser. */
  bildQuelle: string;
  /** Der Bildtext, gekuerzt auf die erste Zeile. */
  text?: string;
  /** Adresse des Beitrags auf instagram.com. */
  permalink: string;
  /** ISO-Datum, wie von Meta geliefert (UTC). */
  datum: string;
}

interface RohBeitrag {
  id: string;
  caption?: string;
  media_type: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

async function hole(pfad: string, parameter: string): Promise<unknown | null> {
  const schluessel = process.env.INSTAGRAM_TOKEN;
  if (!schluessel) return null;

  try {
    const antwort = await fetch(
      `${BASIS}/${pfad}?${parameter}&access_token=${encodeURIComponent(schluessel)}`,
      { next: { revalidate: REVALIDATE }, signal: AbortSignal.timeout(5000) }
    );
    if (!antwort.ok) return null;
    return await antwort.json();
  } catch {
    /*
     * Bewusst stumm, wie bei FuPa. Ein Fehler hier darf den Seitenaufbau
     * nicht aufhalten. Gemeldet wird beim Bau, siehe pruefe-instagram.mjs.
     */
    return null;
  }
}

/**
 * Der erste Satz des Bildtextes, mehr passt nicht unter ein Bild.
 *
 * Instagram-Texte enden oft in einer Wand aus Hashtags. Die gehoeren nicht
 * auf die Vereinsseite: Sie sind dort wirkungslos und sehen nach kopiertem
 * Inhalt aus.
 */
function ersteZeile(text?: string): string | undefined {
  if (!text) return undefined;
  const ohneTags = text
    .split("\n")
    .map((z) => z.trim())
    .filter((z) => z && !/^#/.test(z))
    .join(" ");
  const satz = ohneTags.split(/(?<=[.!?])\s/)[0] ?? ohneTags;
  const sauber = satz.replace(/#\S+/g, "").replace(/\s+/g, " ").trim();
  if (!sauber) return undefined;
  return sauber.length > 120 ? sauber.slice(0, 117).trimEnd() + "…" : sauber;
}

function zuBeitrag(roh: RohBeitrag): InstagramBeitrag | null {
  /*
   * Bei einem Video ist media_url die Videodatei. Die gehoert nicht in ein
   * Bild, dafuer gibt es thumbnail_url. Bei Bildern und Alben gibt es kein
   * thumbnail_url, dort ist media_url richtig.
   */
  const quelle =
    roh.media_type === "VIDEO" ? roh.thumbnail_url : roh.media_url;
  if (!quelle) return null;

  return {
    id: roh.id,
    bildQuelle: quelle,
    text: ersteZeile(roh.caption),
    permalink: roh.permalink,
    datum: roh.timestamp,
  };
}

/**
 * Der neueste Beitrag mit Bild.
 *
 * Gibt null zurueck, wenn kein Schluessel hinterlegt ist, Meta nicht
 * antwortet oder der Schluessel abgelaufen ist. Drei Ursachen, eine Antwort:
 * Der Kopfbereich zeigt dann sein festes Vereinsbild. Was davon vorliegt,
 * klaert der Waechter beim Bau, nicht der Besucher.
 */
export async function neuesterBeitrag(): Promise<InstagramBeitrag | null> {
  const daten = (await hole("me/media", `fields=${FELDER}&limit=5`)) as {
    data?: RohBeitrag[];
  } | null;
  if (!daten?.data?.length) return null;

  for (const roh of daten.data) {
    const beitrag = zuBeitrag(roh);
    if (beitrag) return beitrag;
  }
  return null;
}

/**
 * Die Bildadresse zu einer Beitragskennung, fuer den Bildweiterreicher.
 *
 * WARUM DIE ROUTE NICHT EINFACH EINE ADRESSE ENTGEGENNIMMT: Dann waere sie
 * ein offener Weiterreicher. Jeder koennte ihr eine beliebige Adresse geben,
 * und die Vereinsseite holt sie und liefert sie unter ihrem eigenen Namen
 * aus. Deshalb geht nur eine Kennung hinein, und die Adresse dazu kommt aus
 * Metas eigener Antwort.
 */
export async function bildQuelleVon(id: string): Promise<string | null> {
  if (!/^\d+$/.test(id)) return null;

  const daten = (await hole(
    id,
    "fields=id,media_type,media_url,thumbnail_url"
  )) as RohBeitrag | null;
  if (!daten) return null;

  return daten.media_type === "VIDEO"
    ? (daten.thumbnail_url ?? null)
    : (daten.media_url ?? null);
}
