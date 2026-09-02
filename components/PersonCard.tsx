import { Mail, Phone } from "lucide-react";
import type { VorstandsMitglied } from "@/types/content";

export default function PersonCard({ person }: { person: VorstandsMitglied }) {
  const initialen = person.name
    .replace(/[[\]]/g, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3 border border-fisch-line bg-white p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-fisch-yellow font-display text-lg font-bold text-fisch-black">
        {initialen || "SV"}
      </div>
      <div>
        <p className="font-display font-bold text-fisch-black">{person.name}</p>
        <p className="text-sm text-fisch-muted">{person.rolle}</p>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        {person.email && (
          <a
            href={`mailto:${person.email}`}
            className="inline-flex items-center justify-center gap-1.5 text-fisch-black hover:text-fisch-gold"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            {person.email}
          </a>
        )}
        {person.telefon && (
          <a
            href={`tel:${person.telefon}`}
            className="inline-flex items-center justify-center gap-1.5 text-fisch-black hover:text-fisch-gold"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {person.telefon}
          </a>
        )}
      </div>
    </div>
  );
}
