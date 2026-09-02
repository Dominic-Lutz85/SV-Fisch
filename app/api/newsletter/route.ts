import { NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/lib/config";
import { sendMail } from "@/lib/mail";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bitte eine gültige E-Mail angeben." }, { status: 400 });
  }

  try {
    await sendMail({
      subject: "Neue Newsletter-Anmeldung",
      text: `Neue Anmeldung für den Vereins-Newsletter: ${parsed.data.email}`,
      html: `<p>Neue Anmeldung für den Vereins-Newsletter: <strong>${parsed.data.email}</strong></p>`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/newsletter]", error);
    return NextResponse.json(
      {
        // Weg für den Absender, statt ihn mit einer Störung stehen zu lassen.
        error: `Die Anmeldung hat gerade nicht geklappt. Schreibt uns bitte direkt an ${siteConfig.contact.email}.`,
      },
      { status: 502 }
    );
  }
}
