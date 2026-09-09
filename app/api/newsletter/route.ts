import { NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/lib/config";
import { sendMail } from "@/lib/mail";

/*
 * Newsletter-Anmeldung.
 *
 * WAS HIER VORHER STAND UND WARUM ES GEAENDERT WURDE:
 *
 * Bis zum 09.09.2026 hat diese Route bei jeder Anmeldung eine E-Mail an den
 * Verein geschickt, mit der Adresse im Text. Mehr passierte nicht. Es gab
 * keine Liste, keine Bestaetigung durch den Angemeldeten und keinen Weg
 * zurueck.
 *
 * Fuer einen Vereins-Newsletter fehlten damit zwei Dinge, die in Deutschland
 * nicht verhandelbar sind:
 *
 *   1. Die bestaetigte Anmeldung (Double-Opt-In). Wer eine fremde Adresse
 *      eintraegt, meldet sonst jemand anderen an. Der BGH verlangt deshalb
 *      seit 2008 eine Bestaetigungsmail, auf deren Link geklickt werden muss.
 *   2. Ein Abmeldelink in jeder Mail.
 *
 * Beides uebernimmt jetzt Brevo. Der Dienst sitzt in Paris und verarbeitet
 * in Frankreich, es gibt einen Auftragsverarbeitungsvertrag im Konto, und
 * das kostenlose Kontingent (300 Mails am Tag, 100.000 Kontakte) ist fuer
 * einen Verein reichlich.
 *
 * Der Verein bekommt weiterhin eine Nachricht, aber erst NACHDEM Brevo die
 * Anmeldung angenommen hat, und ohne dass diese Nachricht der eigentliche
 * Vorgang waere.
 */

const schema = z.object({ email: z.string().email() });

/** Die Anmeldung bei Brevo, mit Bestaetigungsmail durch Brevo selbst. */
const BREVO_DOI = "https://api.brevo.com/v3/contacts/doubleOptinConfirmation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Bitte eine gültige E-Mail angeben." },
      { status: 400 }
    );
  }

  const { email } = parsed.data;

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);

  /*
   * Solange die Zugaenge fehlen, wird NICHT still auf den alten Weg
   * zurueckgefallen.
   *
   * Das ist Absicht und der wichtigste Satz dieser Datei: Ein Rueckfall auf
   * "Mail an den Verein" saehe fuer den Angemeldeten aus wie eine
   * funktionierende Anmeldung, waere aber genau der Zustand, der hier
   * behoben werden sollte. Lieber ein ehrlicher Hinweis mit einer
   * Mailadresse als eine Anmeldung, die niemand bestaetigt hat.
   */
  if (!apiKey || !listId || !templateId) {
    console.error(
      "[api/newsletter] Brevo ist nicht eingerichtet: BREVO_API_KEY, " +
        "BREVO_LIST_ID oder BREVO_DOI_TEMPLATE_ID fehlt."
    );
    return NextResponse.json(
      {
        error:
          `Die Newsletter-Anmeldung ist gerade nicht möglich. Schreibt uns ` +
          `bitte kurz an ${siteConfig.contact.email}, dann tragen wir euch ein.`,
      },
      { status: 503 }
    );
  }

  try {
    const antwort = await fetch(BREVO_DOI, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        includeListIds: [listId],
        templateId,
        /*
         * Wohin der Klick in der Bestaetigungsmail fuehrt. Eine eigene
         * Seite, damit dort "Danke, ihr seid dabei" steht und nicht die
         * Startseite, auf der niemand merkt, dass etwas passiert ist.
         */
        redirectionUrl: `${siteConfig.url}/newsletter/bestaetigt`,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!antwort.ok) {
      const text = await antwort.text();
      console.error("[api/newsletter] Brevo antwortete", antwort.status, text);
      return NextResponse.json(
        {
          error:
            `Die Anmeldung hat gerade nicht geklappt. Schreibt uns bitte ` +
            `direkt an ${siteConfig.contact.email}.`,
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("[api/newsletter]", error);
    return NextResponse.json(
      {
        error:
          `Die Anmeldung hat gerade nicht geklappt. Schreibt uns bitte ` +
          `direkt an ${siteConfig.contact.email}.`,
      },
      { status: 502 }
    );
  }

  /*
   * Der Verein erfaehrt davon, aber nur zur Kenntnis. Schlaegt das fehl,
   * bleibt die Anmeldung trotzdem gueltig: Sie liegt bereits bei Brevo, und
   * dem Angemeldeten ist nicht damit geholfen, dass er einen Fehler sieht,
   * obwohl seine Bestaetigungsmail schon unterwegs ist.
   */
  try {
    await sendMail({
      subject: "Neue Newsletter-Anmeldung",
      text:
        `${email} hat sich für den Vereins-Newsletter angemeldet. ` +
        `Die Bestätigungsmail ist unterwegs, eingetragen wird erst nach dem Klick darauf.`,
      html:
        `<p><strong>${email}</strong> hat sich für den Vereins-Newsletter angemeldet.</p>` +
        `<p>Die Bestätigungsmail ist unterwegs. Eingetragen wird die Adresse erst, ` +
        `wenn dort auf den Link geklickt wurde.</p>`,
    });
  } catch (error) {
    console.error("[api/newsletter] Hinweis an den Verein fehlgeschlagen", error);
  }

  return NextResponse.json({
    ok: true,
    hinweis:
      "Fast geschafft: Wir haben euch eine E-Mail geschickt. Bitte klickt " +
      "darin auf den Bestätigungslink, dann seid ihr dabei.",
  });
}
