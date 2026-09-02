import Link from "next/link";
import { cn } from "@/lib/utils";
import type { TabellenZeile } from "@/types/content";

/**
 * Kompakte Tabellen-Vorschau für die Startseite (dunkler Hintergrund).
 * Zeigt die Top-Plätze; steht der SV Fisch nicht darunter, wird die
 * eigene Zeile zusätzlich angehängt, damit man den Stand immer sieht.
 */
export default function TeamTableMini({ zeilen }: { zeilen: TabellenZeile[] }) {
  const topN = zeilen.slice(0, 5);
  const eigene = zeilen.find((z) => z.hervorgehoben);
  const zeigen =
    eigene && !topN.some((z) => z.platz === eigene.platz)
      ? [...topN, eigene]
      : topN;

  return (
    <div className="bg-white/5 p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-fisch-white">Tabelle</h3>
        <Link
          href="/fussball/tabelle"
          className="text-xs font-semibold text-fisch-yellow hover:underline"
        >
          Komplett ansehen
        </Link>
      </div>
      <ul className="flex flex-col divide-y divide-white/10">
        {zeigen.map((zeile) => (
          <li
            key={zeile.platz}
            className={cn(
              "flex items-center gap-3 py-2.5 text-sm",
              zeile.hervorgehoben && "font-bold text-fisch-yellow"
            )}
          >
            <span className="w-5 shrink-0 text-white/50">{zeile.platz}.</span>
            <span className="flex-1 truncate text-fisch-white/90">{zeile.team}</span>
            <span className="w-6 shrink-0 text-right text-fisch-white/90">
              {zeile.punkte}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
