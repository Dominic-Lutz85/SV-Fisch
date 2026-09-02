import { Resend } from "resend";
import { siteConfig } from "@/lib/config";

/**
 * Zentraler Mailversand für alle Formulare (Kontakt, Sponsoring, Mitgliedschaft, Newsletter).
 *
 * Benötigte ENV-Variablen (siehe README):
 * - RESEND_API_KEY   API-Key von https://resend.com
 * - CONTACT_TO_EMAIL Zieladresse, an die Formulareingaben gesendet werden
 * - MAIL_FROM        Absenderadresse, muss in Resend verifiziert sein
 *                     (z. B. "SV Fisch Website <formular@sv-fisch.de>")
 *
 * Ohne RESEND_API_KEY wird BEIM ENTWICKELN nur ins Server-Log geschrieben,
 * damit man ohne Mail-Anbieter arbeiten kann.
 *
 * IM BETRIEB wird stattdessen ein Fehler geworfen. Vorher meldete das Formular
 * dem Besucher Erfolg, obwohl niemand die Nachricht bekam: ein Vereinsmitglied
 * schreibt, freut sich über die Bestätigung, und es antwortet nie jemand. Eine
 * stille Falschmeldung ist schlimmer als eine sichtbare Störung, denn bei einer
 * Störung sucht der Absender einen anderen Weg.
 *
 * Wer den Schlüssel nicht setzen will, muss die Formulare ausbauen und die
 * Adressen direkt hinschreiben. Sie so stehen zu lassen ist keine Option.
 */

interface SendMailInput {
  subject: string;
  replyTo?: string;
  html: string;
  text: string;
}

export async function sendMail({ subject, replyTo, html, text }: SendMailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || siteConfig.contact.email;
  const from = process.env.MAIL_FROM || "SV Fisch Website <kasse@sv-fisch.de>";

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "RESEND_API_KEY fehlt. Das Formular meldet deshalb einen Fehler, " +
          "statt dem Absender einen Versand vorzutäuschen."
      );
    }
    console.warn(
      "[mail] RESEND_API_KEY fehlt, E-Mail wird nur geloggt. Beim Entwickeln " +
        "ist das gewollt, im Betrieb wäre es eine stille Falschmeldung.",
      { to, subject, text }
    );
    return { simulated: true };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    text,
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    throw new Error(error.message);
  }

  return { simulated: false };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
