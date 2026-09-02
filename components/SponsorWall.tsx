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
              {liste.map((s) => {
                const ziel = s.url && s.url !== "#" ? s.url : undefined;
                const kachel = (
                  <>
                    <Image
                      src={s.logo}
                      alt={`Logo ${s.name}`}
                      width={140}
                      height={70}
                      className="h-12 w-auto object-contain"
                    />
                    <span className="sr-only">{s.name}</span>
                  </>
                );
                const klassen =
                  "flex items-center justify-center border border-fisch-line bg-white px-6 py-5";

                /*
                  Ohne Ziel wird hier ein div gerendert und kein a.
                  Ein Anker ohne href ist für Suchmaschinen kein Link und für die
                  Tastatur kein Ziel, er sieht nur so aus. Lighthouse hat genau das
                  bemängelt ("Links are not crawlable"), weil Sponsoren ohne
                  hinterlegte Adresse ein href={undefined} bekamen.
                */
                if (!ziel) {
                  return (
                    <div key={s.name} className={klassen}>
                      {kachel}
                    </div>
                  );
                }

                return (
                  <a
                    key={s.name}
                    href={ziel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${klassen} transition-shadow hover:shadow-md`}
                  >
                    {kachel}
                  </a>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
