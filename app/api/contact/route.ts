import { NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/lib/config";
import { sendMail, escapeHtml } from "@/lib/mail";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  betreff: z.string().min(1).max(200),
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
    return NextResponse.json({ ok: true });
  }

  const { name, email, betreff, nachricht } = parsed.data;

  try {
    await sendMail({
      subject: `Kontaktanfrage: ${betreff}`,
      replyTo: email,
      text: [`Name: ${name}`, `E-Mail: ${email}`, `Betreff: ${betreff}`, "", nachricht].join("\n"),
      html: `
        <h2>Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Betreff:</strong> ${escapeHtml(betreff)}</p>
        <p><strong>Nachricht:</strong><br>${escapeHtml(nachricht).replace(/\n/g, "<br>")}</p>
      `,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/contact]", error);
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
