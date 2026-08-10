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
 * Ohne RESEND_API_KEY wird im Server-Log protokolliert statt versendet,
 * damit lokale Entwicklung ohne Mail-Provider funktioniert.
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
    console.warn(
      "[mail] RESEND_API_KEY fehlt – E-Mail wird nur geloggt, nicht versendet.",
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
