import { notFound } from "next/navigation";

import {
  getSpielplan,
  getKommendeSpiele,
  getNaechsterTermin,
  heuteInDeutschland,
} from "@/lib/content";
import { letzterSpielstand } from "@/lib/ergebnis";
import {
  ErgebnisbandVariante,
  ZweiSpaltenVariante,
  GrosseZifferVariante,
  AnzeigetafelVariante,
} from "@/components/vorschau/ErgebnisVarianten";
import Meldungsleiste, {
  aktiveMeldungen,
  type Meldung,
} from "@/components/vorschau/Meldungsleiste";

/*
 * ERKUNDUNG, KEIN PRODUKTIONSCODE.
 *
 * Die Buehne, die im Rahmen der Vergleichsseite laeuft. Sie zeigt den
 * echten Kopfbereich mit echten Daten, nur die Behandlung des Ergebnisses
 * wechselt.
 *
 * WARUM EIN EIGENER RAHMEN UND KEIN UMBAU IN DER VERGLEICHSSEITE: Tailwind
 * richtet sich nach der Breite des FENSTERS, nicht nach der des
 * Elternelements. Ein auf 390 Pixel verkleinerter Kasten mitten auf einer
 * 1920 Pixel breiten Seite zeigt weiterhin das Bildschirmlayout. Nur ein
 * eigener Rahmen hat seine eigene Fensterbreite.
 */

export const dynamic = "force-dynamic";

/*
 * Beispielmeldungen fuer den Aushang. Sie stehen hier und nicht in
 * content/, weil noch nichts entschieden ist. Kommt der Aushang, ziehen sie
 * nach content/meldungen.json um und bekommen dort einen Waechter, der
 * abgelaufene Eintraege meldet.
 */
const BEISPIEL_MELDUNGEN: Meldung[] = [
  {
    id: "absage",
    stufe: "dringend",
    text: "Das Spiel am Sonntag fällt aus, der Platz ist gesperrt.",
    von: "2026-01-01",
    bis: "2099-12-31",
    link: { text: "Zum Spielplan", ziel: "/fussball/spielplan" },
  },
  {
    id: "helfer",
    stufe: "hinweis",
    text: "Fürs Sommerfest am 19. September werden noch Helfer gesucht.",
    von: "2026-01-01",
    bis: "2099-12-31",
    link: { text: "Melden", ziel: "/kontakt" },
  },
];

export default async function ErgebnisBuehne({
  searchParams,
}: {
  searchParams: Promise<{ v?: string; d?: string; m?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { v, d, m } = await searchParams;

  /*
   * Zwei Datenlagen, und beide gehoeren in den Vergleich.
   *
   * "fertig" ist der Sonntagabend: Das letzte Spiel hat ein Ergebnis, es
   * ist nichts offen. "offen" ist der Stand von heute: Am 06.09. wurde
   * gespielt, im Spielplan steht dazu noch nichts, das letzte belegte
   * Ergebnis ist das vom 30.08.
   *
   * Wer nur die schoene Lage anschaut, waehlt eine Gestaltung, die genau
   * an dem Tag zusammenfaellt, an dem sie gebraucht wird.
   */
  const heute = d === "fertig" ? "2026-09-01" : heuteInDeutschland();

  const spielplan = getSpielplan();
  const stand = letzterSpielstand(spielplan, heute);
  const naechstesSpiel = getKommendeSpiele(spielplan, 1, heute)[0];
  const naechsterTermin = getNaechsterTermin();

  const gemeinsam = { stand, naechstesSpiel, naechsterTermin };

  const richtungen: Record<string, React.ReactNode> = {
    a: <ErgebnisbandVariante {...gemeinsam} spielplan={spielplan} />,
    b: <ZweiSpaltenVariante {...gemeinsam} />,
    c: <GrosseZifferVariante {...gemeinsam} />,
    d: <AnzeigetafelVariante {...gemeinsam} />,
  };

  return (
    <>
      <style>{`
        body > footer { display: none !important; }
        body > header { display: none !important; }
        [role="dialog"] { display: none !important; }
      `}</style>

      {/* aus, eins oder an: der Aushang kostet Hoehe, und eine Meldung
          kostet etwas anderes als zwei. Beides muss man sehen koennen. */}
      {m !== "aus" && m !== undefined && (
        <Meldungsleiste
          meldungen={aktiveMeldungen(BEISPIEL_MELDUNGEN, heute).slice(
            0,
            m === "eins" ? 1 : 2
          )}
        />
      )}

      {richtungen[v ?? "b"] ?? richtungen.b}
    </>
  );
}
