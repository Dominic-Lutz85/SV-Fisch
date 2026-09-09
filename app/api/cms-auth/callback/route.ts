import { NextResponse } from "next/server";

/*
 * Der Rueckweg von GitHub. Beginn und Begruendung stehen in
 * app/api/cms-auth/route.ts.
 *
 * Hier passiert der heikle Teil: Aus dem einmaligen Code von GitHub wird ein
 * Zugangsschluessel, und der muss zurueck an das Fenster, das die Anmeldung
 * geoeffnet hat. Das geht nur ueber eine Seite mit einem kleinen Skript,
 * weil der Schluessel niemals in einer Adresse stehen darf: Adressen landen
 * im Verlauf des Browsers und in Serverprotokollen.
 */

/* Nur diese Herkunft darf den Schluessel bekommen. */
const ERLAUBTE_HERKUNFT = [
  "sv-fisch.com",
  "www.sv-fisch.com",
  "localhost",
  "127.0.0.1",
];

/**
 * Die Seite, die das Ergebnis an das oeffnende Fenster meldet.
 *
 * Der Ablauf ist ein Haendedruck in drei Zuegen, und die Reihenfolge ist
 * nicht verhandelbar, weil das CMS sie so erwartet (nachgelesen im Quelltext
 * des offiziellen Authenticators):
 *
 *   1. Diese Seite ruft "authorizing:github" in den Raum.
 *   2. Das CMS hoert das und antwortet mit demselben Wort. Erst dadurch
 *      erfahren wir seine Herkunft, und zwar vom Browser selbst.
 *   3. Wir pruefen die Herkunft und schicken das Ergebnis dorthin zurueck.
 *
 * Warum der Umweg ueber Schritt 2: Die Herkunft einer Nachricht setzt der
 * Browser, nicht der Absender. Sie ist damit die einzige Angabe, die
 * niemand faelschen kann. Wuerden wir den Schluessel gleich an "*" schicken,
 * bekaeme ihn jede Seite, die dieses Fenster geoeffnet hat.
 */
function meldeErgebnis(inhalt: object, erfolgreich: boolean) {
  const zustand = erfolgreich ? "success" : "error";
  /*
   * JSON.stringify zweimal: einmal fuer die Nachricht selbst, einmal damit
   * der fertige Text sicher als JavaScript-Zeichenkette im HTML steht. Ohne
   * das zweite koennte ein Anfuehrungszeichen aus einer Fehlermeldung das
   * Skript zerlegen.
   */
  const nachricht = JSON.stringify(
    `authorization:github:${zustand}:${JSON.stringify(inhalt)}`
  );
  const erlaubte = JSON.stringify(ERLAUBTE_HERKUNFT);
  const hatSchluessel = JSON.stringify(erfolgreich);

  return new NextResponse(
    `<!doctype html><html lang="de"><head><meta charset="utf-8">
<title>Anmeldung</title></head><body>
<p style="font-family:system-ui;padding:2rem">Anmeldung abgeschlossen, dieses Fenster kann zu.</p>
<script>
(() => {
  const erlaubte = ${erlaubte};
  const hatSchluessel = ${hatSchluessel};
  const vertraut = (herkunft) => {
    try { return erlaubte.includes(new URL(herkunft).hostname); }
    catch { return false; }
  };
  window.addEventListener('message', ({ data, origin }) => {
    if (data !== 'authorizing:github') return;
    // Ein Fehler traegt kein Geheimnis und darf deshalb ueberall hin, damit
    // auf dem Anmeldebildschirm steht, was schiefging.
    if (hatSchluessel && !vertraut(origin)) return;
    window.opener?.postMessage(${nachricht}, origin);
  });
  window.opener?.postMessage('authorizing:github', '*');
})();
</script></body></html>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        /* Eine Seite, die einen Zugangsschluessel traegt, wird nicht abgelegt. */
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return meldeErgebnis(
      {
        provider: "github",
        error: "Die Anmeldung ist auf dem Server nicht eingerichtet.",
        errorCode: "MISCONFIGURED_CLIENT",
      },
      false
    );
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const zustand = searchParams.get("state");

  /*
   * Die Zufallszahl aus dem Cookie muss zu der passen, die GitHub
   * zurueckgibt. Stimmen sie nicht ueberein, hat die Anmeldung nicht auf
   * dieser Seite begonnen, und wir tauschen den Code nicht ein.
   */
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((teil) => teil.trim())
    .find((teil) => teil.startsWith("cms-csrf="))
    ?.slice("cms-csrf=".length);

  if (!code || !zustand || !cookie || cookie !== zustand) {
    return meldeErgebnis(
      {
        provider: "github",
        error:
          "Die Anmeldung ist abgelaufen oder wurde nicht hier begonnen. " +
          "Bitte das Fenster schliessen und noch einmal anmelden.",
        errorCode: "CSRF_DETECTED",
      },
      false
    );
  }

  let schluessel: string | undefined;
  let fehler: string | undefined;

  try {
    const antwort = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ code, client_id: clientId, client_secret: clientSecret }),
        signal: AbortSignal.timeout(10_000),
      }
    );
    const daten = (await antwort.json()) as {
      access_token?: string;
      error_description?: string;
      error?: string;
    };
    schluessel = daten.access_token;
    fehler = daten.error_description ?? daten.error;
  } catch {
    fehler = "GitHub hat nicht geantwortet.";
  }

  if (!schluessel) {
    return meldeErgebnis(
      {
        provider: "github",
        error: fehler ?? "Von GitHub kam kein Zugang zurueck.",
        errorCode: "AUTH_FAILURE",
      },
      false
    );
  }

  const antwort = meldeErgebnis({ provider: "github", token: schluessel }, true);
  /* Die Zufallszahl hat ihren Zweck erfuellt und wird sofort geloescht. */
  antwort.cookies.set("cms-csrf", "", { path: "/", maxAge: 0 });
  return antwort;
}
