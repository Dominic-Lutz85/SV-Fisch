import { notFound } from "next/navigation";
import Erfolgstreppe from "@/components/Erfolgstreppe";
import {
  ChronikBaelle,
  ChronikLetzterBall,
  ChronikWachsend,
  ChronikKlammer,
} from "@/components/vorschau/ChronikVarianten";
import {
  FuehrungBleibt,
  FuehrungWeg,
  FuehrungUnterteilt,
  FuehrungSpur,
} from "@/components/vorschau/LinienFuehrung";

/* ERKUNDUNG, KEIN PRODUKTIONSCODE. Nur das Chronikband, ohne Umgebung. */

export const dynamic = "force-dynamic";

export default async function ChronikBuehne({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { v } = await searchParams;

  const fassungen: Record<string, React.ReactNode> = {
    baelle: <ChronikBaelle />,
    letzter: <ChronikLetzterBall />,
    wachsend: <ChronikWachsend />,
    klammer: <ChronikKlammer />,
    bleibt: <FuehrungBleibt />,
    weg: <FuehrungWeg />,
    unterteilt: <FuehrungUnterteilt />,
    spur: <FuehrungSpur />,
  };

  return (
    <>
      <style>{`
        body > footer { display: none !important; }
        body > header { display: none !important; }
        [role="dialog"] { display: none !important; }
      `}</style>
      {/* Dunkler Grund oben und unten, damit die Kanten sichtbar sind. */}
      <div className="h-10 bg-fisch-black" />
      {fassungen[v ?? ""] ?? <Erfolgstreppe />}
      <div className="h-10 bg-fisch-black" />
    </>
  );
}
