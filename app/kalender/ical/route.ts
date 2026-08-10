import { getTermine } from "@/lib/content";
import { siteConfig } from "@/lib/config";

function toICSDate(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeICS(text: string): string {
  return text.replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
}

export async function GET() {
  const termine = getTermine();

  const events = termine
    .map((t) => {
      const start = toICSDate(t.datum);
      const end = toICSDate(t.endDatum || t.datum);
      // Termin mit nicht auswertbarem Datum überspringen, statt den
      // gesamten Kalender-Export für alle anderen Termine zu zerschießen.
      if (!start || !end) return null;
      return [
        "BEGIN:VEVENT",
        `UID:${t.id}@sv-fisch.de`,
        `DTSTAMP:${toICSDate(new Date().toISOString())}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${escapeICS(t.titel)}`,
        t.ort ? `LOCATION:${escapeICS(t.ort)}` : "",
        t.beschreibung ? `DESCRIPTION:${escapeICS(t.beschreibung)}` : "",
        `CATEGORIES:${escapeICS(t.kategorie)}`,
        "END:VEVENT",
      ]
        .filter(Boolean)
        .join("\r\n");
    })
    .filter(Boolean)
    .join("\r\n");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${siteConfig.name}//Vereinskalender//DE`,
    "CALSCALE:GREGORIAN",
    events,
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="sv-fisch-termine.ics"',
    },
  });
}
