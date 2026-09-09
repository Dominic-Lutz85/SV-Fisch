import { NextResponse } from "next/server";

/*
 * Anmeldung fuer die Redaktionsoberflaeche unter /admin.
 *
 * WARUM DAS HIER SELBST GEBAUT IST UND NICHT ALS FREMDER DIENST LAEUFT:
 *
 * Sveltia CMS braucht fuer die Anmeldung mehrerer Leute einen kleinen
 * Vermittler zwischen Browser und GitHub. Der offizielle Weg dafuer ist ein
 * Cloudflare Worker (sveltia-cms-auth). Das waere ein zweiter Anbieter, ein
 * zweites Konto und ein zweiter Ort, an dem ein Geheimnis liegt, fuer
 * ungefaehr hundert Zeilen Code.
 *
 * Der Verein hat schon einen Server: diese Seite. Also laeuft die Anmeldung
 * hier. Das spart dem Verein ein Konto und macht die Kette kuerzer.
 *
 * WAS HIER PASSIERT, in drei Schritten:
 *
 *   1. Der Browser ruft /api/cms-auth auf. Wir wuerfeln eine Zufallszahl,
 *      legen sie in ein Cookie und schicken den Browser zu GitHub.
 *   2. GitHub fragt den Menschen, ob er das erlauben will, und schickt ihn
 *      mit einem einmaligen Code zurueck an /api/cms-auth/callback.
 *   3. Dort tauschen wir den Code gegen einen Zugangsschluessel und reichen
 *      ihn an das Fenster weiter, das die Anmeldung geoeffnet hat.
 *
 * Das Protokoll ist nicht erfunden, sondern aus dem Quelltext des offiziellen
 * Authenticators gelesen (github.com/sveltia/sveltia-cms-auth, src/index.js),
 * einschliesslich der Zufallszahl im Cookie und der genauen Form der
 * Nachricht am Ende. Wer hier etwas aendert, sieht vorher dort nach.
 */

/*
 * Was wir bei GitHub duerfen wollen.
 *
 * "repo" ist noetig, weil das CMS Dateien im Projekt schreibt, "user" damit
 * neben der Aenderung steht, wer sie gemacht hat. Genau diese beiden setzt
 * auch der offizielle Authenticator als Vorgabe. Weniger geht nicht: ohne
 * "repo" kann niemand speichern.
 */
const BERECHTIGUNGEN = "repo,user";

/*
 * Wie lange die Zufallszahl gilt. Zehn Minuten sind reichlich fuer eine
 * Anmeldung und kurz genug, dass ein liegengebliebenes Cookie nichts nuetzt.
 */
const COOKIE_SEKUNDEN = 600;

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  /*
   * Beides zusammen pruefen, obwohl hier nur die ID gebraucht wird. Sonst
   * laeuft die Anmeldung an, der Mensch erlaubt bei GitHub den Zugriff, und
   * erst im Rueckweg faellt auf, dass das Geheimnis fehlt. Der Fehler soll
   * kommen, bevor jemand etwas bestaetigt hat.
   */
  if (!clientId || !clientSecret) {
    return new NextResponse(
      "Die Anmeldung ist noch nicht eingerichtet: In den Einstellungen der " +
        "Seite fehlen GITHUB_CLIENT_ID und GITHUB_CLIENT_SECRET.",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider") ?? "github";

  if (provider !== "github") {
    return new NextResponse(
      `Diese Anmeldung kann nur GitHub, nicht "${provider}".`,
      { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  /*
   * Zufallszahl gegen einen fremden Anstoss der Anmeldung. Sie geht einmal
   * an GitHub und einmal ins Cookie; wenn beide im Rueckweg nicht
   * uebereinstimmen, hat die Anmeldung nicht hier begonnen.
   */
  const zufall = crypto.randomUUID().replaceAll("-", "");

  const params = new URLSearchParams({
    client_id: clientId,
    scope: BERECHTIGUNGEN,
    state: zufall,
  });

  const antwort = NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`,
    302
  );

  /*
   * SameSite=Lax ist noetig, nicht Geschmack: GitHub schickt den Browser
   * per Weiterleitung zurueck, und bei "Strict" wuerde das Cookie dabei
   * nicht mitgeschickt. Dann schluege die Pruefung im Rueckweg immer fehl.
   */
  antwort.cookies.set("cms-csrf", zufall, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_SEKUNDEN,
  });

  return antwort;
}
