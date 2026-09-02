import Image from "next/image";
import type { Sponsor } from "@/types/content";

const stufenReihenfolge: Sponsor["stufe"][] = ["Hauptsponsor", "Co-Sponsor"];

/*
 * Die Ueberschrift steht getrennt vom Wert, weil der Wert an einem einzelnen
 * Sponsor haengt und die Ueberschrift ueber einer Gruppe steht. "Co-Sponsor"
 * ist der eine, "Co-Sponsoren" sind die acht.
 */
const stufenTitel: Record<Sponsor["stufe"], string> = {
  Hauptsponsor: "Hauptsponsor",
  "Co-Sponsor": "Co-Sponsoren",
};

/*
 * Warum die Logos auf einer hellen Platte stehen und nicht direkt auf dem
 * dunklen Grund:
 *
 * Von den neun echten Logos sind fünf schwarze oder dunkelgraue Schrift ohne
 * eigenen Hintergrund. Auf #1f1f1f wären sie so gut wie unsichtbar. Ein Logo
 * umzufärben kommt nicht in Frage, die Marke gehört dem Sponsor und nicht uns.
 * Also bekommt jedes eine helle Fläche, so wie es Vereine mit dunkler Seite
 * durchweg machen. Die hilft nebenbei auch den farbigen: das Sparkassen-Rot
 * und das Blau von Höllen stehen auf Hell ruhiger als auf Fast-Schwarz.
 *
 * Die Kachel hat eine feste Größe und das Logo wird hineingerechnet. Ohne das
 * bestimmt das Seitenverhältnis die Breite, und ein flaches Logo wie
 * Roth Munch (220 zu 46) wird dreimal so breit wie ein hohes wie
 * Brocker Holzbau (288 zu 167). Die Reihe sieht dann aus wie hingeworfen.
 */

/* Der Hauptsponsor bekommt mehr Platz, dafür ist er der Hauptsponsor. */
const kachelGroesse: Record<Sponsor["stufe"], string> = {
  Hauptsponsor: "h-28 w-52 sm:h-32 sm:w-64",
  "Co-Sponsor": "h-20 w-36 sm:h-24 sm:w-44",
};

/*
 * Die Ebene der Stufenueberschrift ist eine Eigenschaft, aus demselben Grund
 * wie bei NewsCard: auf der Startseite steht darueber ein h2 ("Sponsoren &
 * Foerderer"), auf /verein/sponsoren nicht. Dort sprang die Gliederung von h1
 * direkt auf h3. Lighthouse hat das gemeldet, im Bild sieht man es nicht.
 */
export default function SponsorWall({
  sponsoren,
  ebene: Stufentitel = "h3",
}: {
  sponsoren: Sponsor[];
  /** h2 auf Seiten ohne eigene Zwischenueberschrift, sonst h3 */
  ebene?: "h2" | "h3";
}) {
  return (
    <div className="flex flex-col gap-10">
      {stufenReihenfolge.map((stufe) => {
        const liste = sponsoren.filter((s) => s.stufe === stufe);
        if (liste.length === 0) return null;
        return (
          <div key={stufe}>
            <Stufentitel className="mb-4 text-xs font-bold uppercase tracking-wider text-text-leise">
              {stufenTitel[stufe]}
            </Stufentitel>
            <div className="flex flex-wrap gap-4">
              {liste.map((s) => {
                const ziel = s.url && s.url !== "#" ? s.url : undefined;
                const kachel = (
                  <>
                    <Image
                      src={s.logo}
                      alt={`Logo ${s.name}`}
                      width={s.breite}
                      height={s.hoehe}
                      /*
                        h-full w-full und nicht max-h-full w-auto. Mit max und
                        auto rendert der Browser jedes Logo in seiner
                        Dateigroesse und schneidet nur oben ab: eine kleine
                        Datei bleibt klein, eine grosse wird gedeckelt. In der
                        Reihe stand dann Sparkasse Trier (156 breit) neben
                        Hoellen Design (314 breit) und sah halb so wichtig aus.
                        object-contain rechnet jedes Logo in dieselbe Kachel,
                        haelt das Seitenverhaeltnis und gibt allen dasselbe
                        optische Gewicht.
                      */
                      className="h-full w-full object-contain"
                    />
                    <span className="sr-only">{s.name}</span>
                  </>
                );
                const klassen = `flex items-center justify-center border border-linie bg-fisch-white p-4 ${kachelGroesse[stufe]}`;

                /*
                  Ohne Ziel wird hier ein div gerendert und kein a.
                  Ein Anker ohne href ist für Suchmaschinen kein Link und für die
                  Tastatur kein Ziel, er sieht nur so aus. Lighthouse hat genau das
                  bemängelt ("Links are not crawlable"), weil Sponsoren ohne
                  hinterlegte Adresse ein href={undefined} bekamen.
                */
                if (!ziel) {
                  return (
                    <div key={s.name} className={klassen}>
                      {kachel}
                    </div>
                  );
                }

                return (
                  <a
                    key={s.name}
                    href={ziel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${klassen} transition-shadow hover:shadow-[0_0_0_2px_var(--color-fisch-yellow)]`}
                  >
                    {kachel}
                  </a>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
