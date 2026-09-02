import { NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/lib/config";
import { sendMail, escapeHtml } from "@/lib/mail";

const schema = z.object({
  firma: z.string().min(1).max(200),
  ansprechpartner: z.string().min(1).max(200),
  email: z.string().email(),
  telefon: z.string().max(50).optional().or(z.literal("")),
  paket: z.string().max(200).optional().or(z.literal("")),
  nachricht: z.string().min(1).max(4000),
  website: z.string().max(0).optional().or(z.literal("")), // Honeypot
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bitte alle Pflichtfelder prüfen." }, { status: 400 });
  }

  if (parsed.data.website) {
    // Honeypot ausgefüllt -> als Erfolg quittieren, aber nichts versenden
    return NextResponse.json({ ok: true });
  }

  const { firma, ansprechpartner, email, telefon, paket, nachricht } = parsed.data;

  try {
    await sendMail({
      subject: `Sponsoring-Anfrage: ${firma}`,
      replyTo: email,
      text: [
        `Firma: ${firma}`,
        `Ansprechpartner/in: ${ansprechpartner}`,
        `E-Mail: ${email}`,
        `Telefon: ${telefon || "-"}`,
        `Wunschpaket: ${paket || "-"}`,
        "",
        nachricht,
      ].join("\n"),
      html: `
        <h2>Neue Sponsoring-Anfrage</h2>
        <p><strong>Firma:</strong> ${escapeHtml(firma)}</p>
        <p><strong>Ansprechpartner/in:</strong> ${escapeHtml(ansprechpartner)}</p>
        <p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telefon:</strong> ${escapeHtml(telefon || "-")}</p>
        <p><strong>Wunschpaket:</strong> ${escapeHtml(paket || "-")}</p>
        <p><strong>Nachricht:</strong><br>${escapeHtml(nachricht).replace(/\n/g, "<br>")}</p>
      `,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/sponsor]", error);
    return NextResponse.json(
      {
        // Dem Absender einen Weg lassen, statt ihn mit einer Störung stehen
        // zu lassen. Die Adresse steht ohnehin im Impressum.
        error: `Die Nachricht konnte gerade nicht gesendet werden. Schreibt uns bitte direkt an ${siteConfig.contact.email}.`,
      },
      { status: 502 }
    );
  }
}
