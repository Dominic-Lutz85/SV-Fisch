import Image from "next/image";
import type { Sponsor } from "@/types/content";

const stufenReihenfolge: Sponsor["stufe"][] = [
  "Hauptsponsor",
  "Premiumpartner",
  "Partner",
  "Förderer",
];

export default function SponsorWall({ sponsoren }: { sponsoren: Sponsor[] }) {
  return (
    <div className="flex flex-col gap-10">
      {stufenReihenfolge.map((stufe) => {
        const liste = sponsoren.filter((s) => s.stufe === stufe);
        if (liste.length === 0) return null;
        return (
          <div key={stufe}>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-fisch-muted">
              {stufe}
            </h3>
            <div className="flex flex-wrap gap-4">
              {liste.map((s) => (
                <a
                  key={s.name}
                  href={s.url && s.url !== "#" ? s.url : undefined}
                  target={s.url && s.url !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center justify-center border border-fisch-line bg-white px-6 py-5 transition-shadow hover:shadow-md"
                >
                  <Image
                    src={s.logo}
                    alt={`Logo ${s.name} [Platzhalter – Datei ersetzen]`}
                    width={140}
                    height={70}
                    className="h-12 w-auto object-contain"
                  />
                  <span className="sr-only">{s.name}</span>
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
