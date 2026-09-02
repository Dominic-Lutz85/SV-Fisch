import type { Spieler } from "@/types/content";

const positionen: Spieler["position"][] = [
  "Trainer",
  "Torwart",
  "Abwehr",
  "Mittelfeld",
  "Sturm",
];

export default function SquadGrid({ spieler }: { spieler: Spieler[] }) {
  return (
    <div className="flex flex-col gap-12">
      {positionen.map((position) => {
        const gruppe = spieler.filter((s) => s.position === position);
        if (gruppe.length === 0) return null;
        return (
          <div key={position}>
            <h2 className="mb-5 font-display text-xl font-bold text-text">
              {position === "Trainer" ? "Trainerteam" : position}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {gruppe.map((spielerEintrag, i) => (
                <div
                  key={`${spielerEintrag.name}-${i}`}
                  className="flex items-center gap-3 border border-linie bg-flaeche-hoch p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fisch-black font-display text-sm font-bold text-fisch-yellow">
                    {spielerEintrag.nummer ?? "–"}
                  </span>
                  <span className="text-sm font-semibold text-text">
                    {spielerEintrag.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
