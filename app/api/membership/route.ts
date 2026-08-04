import { NextResponse } from "next/server";
import { z } from "zod";
import { sendMail, escapeHtml } from "@/lib/mail";

const schema = z.object({
  vorname: z.string().min(1).max(100),
  nachname: z.string().min(1).max(100),
  email: z.string().email(),
  telefon: z.string().max(50).optional().or(z.literal("")),
  abteilung: z.string().min(1).max(100),
  nachricht: z.string().max(4000).optional().or(z.literal("")),
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

  const { vorname, nachname, email, telefon, abteilung, nachricht } = parsed.data;

  try {
    await sendMail({
      subject: `Mitgliedsanfrage: ${vorname} ${nachname}`,
      replyTo: email,
      text: [
        `Name: ${vorname} ${nachname}`,
        `E-Mail: ${email}`,
        `Telefon: ${telefon || "-"}`,
        `Interesse an: ${abteilung}`,
        "",
        nachricht || "(keine weitere Nachricht)",
      ].join("\n"),
      html: `
        <h2>Neue Mitgliedsanfrage</h2>
        <p><strong>Name:</strong> ${escapeHtml(vorname)} ${escapeHtml(nachname)}</p>
        <p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telefon:</strong> ${escapeHtml(telefon || "-")}</p>
        <p><strong>Interesse an:</strong> ${escapeHtml(abteilung)}</p>
        <p><strong>Nachricht:</strong><br>${escapeHtml(nachricht || "-").replace(/\n/g, "<br>")}</p>
      `,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/membership]", error);
    return NextResponse.json(
      { error: "Mail konnte nicht versendet werden." },
      { status: 502 }
    );
  }
}
