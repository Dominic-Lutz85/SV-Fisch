import { notFound } from "next/navigation";
import Erfolgstreppe from "@/components/Erfolgstreppe";
import {
  ChronikBaelle,
  ChronikLetzterBall,
  ChronikWachsend,
  ChronikKlammer,
} from "@/components/vorschau/ChronikVarianten";

/* ERKUNDUNG, KEIN PRODUKTIONSCODE. Nur das Chronikband, ohne Umgebung. */

export const dynamic = "force-dynamic";

export default async function ChronikBuehne({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { v } = await searchParams;

  return (
    <>
      <style>{`
        body > footer { display: none !important; }
        body > header { display: none !important; }
        [role="dialog"] { display: none !important; }
      `}</style>
      {/* Etwas dunkler Grund oben und unten, damit die Kanten sichtbar sind. */}
      <div className="h-10 bg-fisch-black" />
      {v === "baelle" ? (
        <ChronikBaelle />
      ) : v === "letzter" ? (
        <ChronikLetzterBall />
      ) : v === "wachsend" ? (
        <ChronikWachsend />
      ) : v === "klammer" ? (
        <ChronikKlammer />
      ) : (
        <Erfolgstreppe />
      )}
      <div className="h-10 bg-fisch-black" />
    </>
  );
}
