import type { Metadata } from "next";
import { Download } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getVorstand } from "@/lib/content";
import { satzung, SATZUNG_STAND, SATZUNG_PDF } from "@/content/satzung";

export const metadata: Metadata = {
  title: "Satzung",
  description:
    "Die Satzung des Sportvereins Fisch 1964 e.V. im Wortlaut, Stand 25.11.2022, dazu als PDF zum Herunterladen.",
};

/**
 * Die Nummer aus "§ 7 – Mitgliederversammlung" wird zur Sprungmarke. Ueber
 * den Titel als Ganzes zu gehen brauchte eine Umschrift von Paragraphenzeichen
 * und Umlauten, und heraus kaeme eine Adresse, die niemand tippt. "#p7" ist
 * kurz genug, um sie jemandem am Telefon zu nennen.
 */
function marke(titel: string) {
  return `p${titel.match(/\d+/)?.[0] ?? titel}`;
}

export default function SatzungPage() {
  /*
   * Wer Fragen zur Satzung hat, soll nicht raten muessen, an wen. Der
   * Zustaendige steht in content/vorstand.json und wird ueber seine Rolle
   * gefunden, damit diese Seite keine zweite Namensliste fuehrt: Wechselt das
   * Amt, wechselt es an einer Stelle. Faellt der Eintrag weg, verschwindet der
   * Hinweis, statt auf jemanden zu zeigen, den es nicht mehr gibt.
   */
  const ansprechpartner = getVorstand().find(
    (m) => m.rolle.includes("Satzung") && m.name.trim() !== ""
  );

  return (
    <>
      <PageHeader
        eyebrow="Der Verein"
        title="Satzung"
        description="Die Satzung regelt Zweck, Mitgliedschaft und Organe des Sportvereins Fisch 1964 e.V. Hier steht sie im beschlossenen Wortlaut."
      />
      <div className="container-fisch max-w-3xl py-16 sm:py-20">
        <div className="mb-12 flex flex-col gap-4 border border-linie bg-flaeche-hoch p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-leise">
            Beschlossene Fassung, Stand{" "}
            <strong className="font-semibold text-text">{SATZUNG_STAND}</strong>
          </p>
          <a
            href={SATZUNG_PDF}
            className="inline-flex shrink-0 items-center gap-2 bg-fisch-yellow px-4 py-2.5 text-sm font-bold text-fisch-black hover:bg-fisch-yellow-dark"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Satzung als PDF
          </a>
        </div>

        <nav aria-label="Die Paragraphen der Satzung" className="mb-12">
          <ol className="flex flex-col gap-1.5 border-l-2 border-fisch-yellow pl-5">
            {satzung.map((p) => (
              <li key={p.titel}>
                <a
                  href={`#${marke(p.titel)}`}
                  className="text-sm text-text-leise hover:text-text"
                >
                  {p.titel}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col gap-10">
          {satzung.map((p) => (
            <section key={p.titel} id={marke(p.titel)} className="scroll-mt-28">
              <h2 className="font-display text-xl font-bold text-text">
                {p.titel}
              </h2>
              <div className="mt-3 flex flex-col gap-3">
                {p.absaetze.map((absatz, i) =>
                  typeof absatz === "string" ? (
                    <p key={i} className="leading-relaxed text-text-leise">
                      {absatz}
                    </p>
                  ) : (
                    <ol
                      key={i}
                      className="ml-5 flex list-decimal flex-col gap-1.5 leading-relaxed text-text-leise marker:text-text"
                    >
                      {absatz.liste.map((punkt) => (
                        <li key={punkt} className="pl-1">
                          {punkt}
                        </li>
                      ))}
                    </ol>
                  )
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-linie pt-6 text-sm text-text-leise">
          <p>
            Fisch, den {SATZUNG_STAND}. Maßgeblich ist die von der
            Mitgliederversammlung beschlossene Fassung, die hier wortgleich
            wiedergegeben ist.
          </p>
          {ansprechpartner && (
            <p className="mt-3">
              Fragen zur Satzung beantwortet{" "}
              <strong className="font-semibold text-text">
                {ansprechpartner.name}
              </strong>
              {ansprechpartner.email && (
                <>
                  ,{" "}
                  <a
                    href={`mailto:${ansprechpartner.email}`}
                    className="underline"
                  >
                    {ansprechpartner.email}
                  </a>
                </>
              )}
              .
            </p>
          )}
        </div>
      </div>
    </>
  );
}
