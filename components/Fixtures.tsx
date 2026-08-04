import { formatDatum } from "@/lib/utils";
import type { Spiel } from "@/types/content";
import { cn } from "@/lib/utils";

export default function Fixtures({
  spiele,
  compact = false,
}: {
  spiele: Spiel[];
  compact?: boolean;
}) {
  if (spiele.length === 0) {
    return (
      <p className="text-sm text-fisch-muted">
        Aktuell sind keine Spiele hinterlegt.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-fisch-line">
      {spiele.map((spiel) => {
        const istFisch = (t: string) => t.toLowerCase().includes("fisch");
        return (
          <li
            key={`${spiel.datum}-${spiel.heim}-${spiel.auswaerts}`}
            className={cn(
              "flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between",
              compact && "py-3"
            )}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-fisch-muted">
                {spiel.wettbewerb} · {formatDatum(spiel.datum)}
                {!compact && `, ${spiel.uhrzeit} Uhr`}
              </span>
              <span className="font-semibold text-fisch-black">
                <span className={istFisch(spiel.heim) ? "font-bold" : ""}>
                  {spiel.heim}
                </span>{" "}
                <span className="text-fisch-muted">vs.</span>{" "}
                <span className={istFisch(spiel.auswaerts) ? "font-bold" : ""}>
                  {spiel.auswaerts}
                </span>
              </span>
              {!compact && spiel.spielstaette && (
                <span className="text-xs text-fisch-muted">{spiel.spielstaette}</span>
              )}
            </div>
            <div className="shrink-0">
              {spiel.gespielt ? (
                <span className="inline-block rounded-full bg-fisch-black px-3 py-1.5 text-sm font-bold text-fisch-white">
                  {spiel.ergebnis}
                </span>
              ) : (
                <span className="inline-block rounded-full border border-fisch-yellow-dark bg-fisch-yellow/40 px-3 py-1.5 text-sm font-bold text-fisch-black">
                  {spiel.ort === "Heim" ? "Heimspiel" : "Auswärts"}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
