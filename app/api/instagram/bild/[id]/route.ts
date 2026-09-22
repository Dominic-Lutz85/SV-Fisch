/*
 * Der Bildweiterreicher.
 *
 * Instagram-Bilder liegen auf Metas Servern (scontent-*.cdninstagram.com).
 * Stuende so eine Adresse direkt im <img> der Startseite, ginge die
 * IP-Adresse jedes Besuchers dorthin, und die Seite braeuchte dafuer eine
 * Einwilligung. Sie laedt heute keinen einzigen fremden Host, und das soll
 * so bleiben.
 *
 * Also holt der Server das Bild und liefert es unter unserem eigenen Namen
 * aus. Der Besucher spricht nur mit sv-fisch.com.
 *
 * KEINE ADRESSE ALS PARAMETER, sondern nur eine Kennung. Naehme die Route
 * eine Adresse entgegen, waere sie ein offener Weiterreicher: Jeder koennte
 * ihr irgendeine Adresse geben, und die Vereinsseite holt deren Inhalt und
 * liefert ihn unter ihrem Namen aus. Die Adresse kommt deshalb aus Metas
 * eigener Antwort auf genau diese Kennung, siehe bildQuelleVon().
 */
import { bildQuelleVon } from "@/lib/instagram";

/*
 * Einen Tag im Browser und in Vercels Zwischenspeicher. Ein Bild zu einem
 * Beitrag aendert sich nicht mehr, nur die ADRESSE bei Meta laeuft
 * irgendwann ab. Deshalb kein "immutable": Nach einem Tag fragt der Browser
 * neu, der Server holt dann die aktuelle Adresse.
 *
 * stale-while-revalidate haelt das alte Bild waehrenddessen am Leben, damit
 * niemand auf Meta warten muss.
 */
const CACHE = "public, max-age=86400, stale-while-revalidate=604800";

export async function GET(
  _anfrage: Request,
  ctx: RouteContext<"/api/instagram/bild/[id]">
) {
  const { id } = await ctx.params;

  const quelle = await bildQuelleVon(id);
  if (!quelle) {
    return new Response("Kein Bild zu dieser Kennung", { status: 404 });
  }

  /*
   * Eigener AbortController statt AbortSignal.timeout(): Der laesst seinen
   * Timer offen. In einer kurzlebigen Serverfunktion faellt das nicht auf,
   * in scripts/instagram-token.mjs hat genau das Node mit einer
   * libuv-Assertion abbrechen lassen. Gleiche Bauart ueberall, dann gibt es
   * keine Stelle, an der es doch schiefgeht.
   */
  const abbruch = new AbortController();
  const wecker = setTimeout(() => abbruch.abort(), 8000);

  try {
    const antwort = await fetch(quelle, { signal: abbruch.signal });
    if (!antwort.ok || !antwort.body) {
      return new Response("Meta hat das Bild nicht geliefert", { status: 502 });
    }

    const typ = antwort.headers.get("content-type") ?? "image/jpeg";
    if (!typ.startsWith("image/")) {
      return new Response("Das ist kein Bild", { status: 502 });
    }

    /*
     * Der Datenstrom wird durchgereicht, nicht in den Speicher geladen. Ein
     * Instagram-Bild ist zwar klein, aber eine Serverfunktion, die erst
     * alles einsammelt, braucht den Platz und die Zeit ohne Not.
     */
    return new Response(antwort.body, {
      headers: { "Content-Type": typ, "Cache-Control": CACHE },
    });
  } catch {
    return new Response("Meta war nicht erreichbar", { status: 504 });
  } finally {
    clearTimeout(wecker);
  }
}
