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
      {/*
        Spiele und Tordifferenz stehen mit dabei, nicht nur die Punkte.
        Anlass: Am 02.09.2026 lagen FC Könen und SV Fisch beide bei 12 Punkten.
        Ohne Tordifferenz ist dann nicht zu erkennen, warum der eine vor dem
        anderen steht, und eine Tabelle, die ihre eigene Reihenfolge nicht
        erklärt, sieht falsch aus. Man City zeigt in seiner Tabelle dieselben
        Spalten.
      */}
      <div
        aria-hidden="true"
        className="mb-1.5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-fisch-white/50"
      >
        <span className="w-5 shrink-0" aria-hidden="true" />
        <span className="flex-1">Team</span>
        <span className="w-6 shrink-0 text-right">Sp</span>
        <span className="w-8 shrink-0 text-right">Diff</span>
        <span className="w-7 shrink-0 text-right">Pkt</span>
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
            {/*
              Die Spaltenköpfe stehen zwar darüber, sind aber nur optisch
              zugeordnet. Diese Liste ist keine echte Tabelle, also verbindet
              ein Vorleseprogramm die Zahlen mit nichts und liest "4, +10, 12".
              Deshalb trägt jede Zahl ihre eigene Beschriftung.
            */}
            <span
              className="w-6 shrink-0 text-right text-fisch-white/70"
              aria-label={`${zeile.spiele} Spiele`}
            >
              {zeile.spiele}
            </span>
            <span
              className="w-8 shrink-0 text-right text-fisch-white/70"
              aria-label={`Tordifferenz ${zeile.differenz}`}
            >
              {zeile.differenz > 0 ? `+${zeile.differenz}` : zeile.differenz}
            </span>
            <span
              className="w-7 shrink-0 text-right font-bold text-fisch-white"
              aria-label={`${zeile.punkte} Punkte`}
            >
              {zeile.punkte}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
