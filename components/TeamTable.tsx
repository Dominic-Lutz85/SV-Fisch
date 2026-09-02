import { cn } from "@/lib/utils";
import type { TabellenZeile } from "@/types/content";

export default function TeamTable({ zeilen }: { zeilen: TabellenZeile[] }) {
  return (
    <div className="overflow-x-auto border border-linie">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="bg-flaeche-hoch-2 text-text">
            <th className="px-3 py-3 text-left font-semibold">#</th>
            <th className="px-3 py-3 text-left font-semibold">Team</th>
            <th className="px-3 py-3 text-center font-semibold">Sp</th>
            <th className="px-3 py-3 text-center font-semibold">S</th>
            <th className="px-3 py-3 text-center font-semibold">U</th>
            <th className="px-3 py-3 text-center font-semibold">N</th>
            <th className="px-3 py-3 text-center font-semibold">Tore</th>
            <th className="px-3 py-3 text-center font-semibold">Diff</th>
            <th className="px-3 py-3 text-center font-semibold">Pkt</th>
          </tr>
        </thead>
        <tbody>
          {zeilen.map((row) => (
            <tr
              key={row.platz}
              className={cn(
                "border-t border-linie",
                row.hervorgehoben && "bg-fisch-yellow/30 font-semibold"
              )}
            >
              <td className="px-3 py-3">{row.platz}</td>
              <td className="px-3 py-3">{row.team}</td>
              <td className="px-3 py-3 text-center">{row.spiele}</td>
              <td className="px-3 py-3 text-center">{row.siege}</td>
              <td className="px-3 py-3 text-center">{row.unentschieden}</td>
              <td className="px-3 py-3 text-center">{row.niederlagen}</td>
              <td className="px-3 py-3 text-center">{row.tore}</td>
              <td className="px-3 py-3 text-center">
                {row.differenz > 0 ? `+${row.differenz}` : row.differenz}
              </td>
              <td className="px-3 py-3 text-center font-bold">{row.punkte}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
