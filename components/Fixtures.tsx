import { formatDatum } from "@/lib/utils";
import type { Spiel } from "@/types/content";
import { cn } from "@/lib/utils";

export default function Fixtures({
  spiele,
  compact = false,
  variant = "light",
}: {
  spiele: Spiel[];
  compact?: boolean;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";

  if (spiele.length === 0) {
    return (
      <p className={cn("text-sm", dark ? "text-fisch-white/60" : "text-fisch-muted")}>
        Aktuell sind keine Spiele hinterlegt.
      </p>
    );
  }

  return (
    <ul
      className={cn(
        "flex flex-col divide-y",
        dark ? "divide-white/10" : "divide-fisch-line"
      )}
    >
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
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-wide",
                  dark ? "text-fisch-white/60" : "text-fisch-muted"
                )}
              >
                {spiel.wettbewerb} · {formatDatum(spiel.datum)}
                {!compact && `, ${spiel.uhrzeit} Uhr`}
              </span>
              <span
                className={cn(
                  "font-semibold",
                  dark ? "text-fisch-white" : "text-fisch-black"
                )}
              >
                <span className={istFisch(spiel.heim) ? "font-bold" : ""}>
                  {spiel.heim}
                </span>{" "}
                <span className={dark ? "text-fisch-white/50" : "text-fisch-muted"}>
                  vs.
                </span>{" "}
                <span className={istFisch(spiel.auswaerts) ? "font-bold" : ""}>
                  {spiel.auswaerts}
                </span>
              </span>
              {!compact && spiel.spielstaette && (
                <span
                  className={cn(
                    "text-xs",
                    dark ? "text-fisch-white/60" : "text-fisch-muted"
                  )}
                >
                  {spiel.spielstaette}
                </span>
              )}
            </div>
            <div className="shrink-0">
              {spiel.gespielt ? (
                <span
                  className={cn(
                    "inline-block rounded-full px-3 py-1.5 text-sm font-bold",
                    dark
                      ? "bg-fisch-white text-fisch-black"
                      : "bg-fisch-black text-fisch-white"
                  )}
                >
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
