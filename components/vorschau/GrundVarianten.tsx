import Image from "next/image";

/*
 * ERKUNDUNG, KEIN PRODUKTIONSCODE.
 *
 * Sechs Gruende fuer den Abschnitt "Spiele und Tabelle". Jede Richtung ist
 * nur der Hintergrund, der Inhalt darueber bleibt in allen Faellen gleich.
 *
 * REFERENZEN, am 08.09.2026 selbst aufgerufen und als Bild abgelegt unter
 * scratchpad/zeigen/ref2:
 *
 *   WC 2026 Data Portraits   wc26.bogachev.fr, Awwwards. Sehr dunkler
 *                            Grund, ein einziger weicher Lichtschein oben,
 *                            sonst nichts. Die Inhalte tragen alles.
 *   The Performance Lab      theperformancelab.ca, Awwwards. Riesige
 *                            Konturschrift laeuft angeschnitten durch den
 *                            Abschnitt: "UNLOCK NEXT LEVEL PERFORMANCE".
 *   The Immortals            theimmortals.world, Awwwards. Radikal leer.
 *                            Eine Flaeche, eine Zahl, eine Zeile.
 *   BVB, Union, Mainz 05,    alle am selben Tag angesehen. KEINE dieser
 *   Eintracht, Ajax, ManCity Seiten legt ein grosses, blasses Motiv hinter
 *                            einen zweispaltigen Abschnitt. Sie trennen
 *                            Abschnitte durch Flaeche und Abstand.
 *
 * WAS GEMESSEN IST, im Vergleich zum jetzigen Zustand bei 1920 Pixeln, in
 * einem textfreien Streifen links unten im Abschnitt:
 *
 *   Grund jetzt        Mittel 17,9  Streuung 15,99  hellster Punkt 61
 *   Kopfbereich        Mittel 17,5  Streuung 14,04  hellster Punkt 47
 *   Nachrichten        Mittel 10,2  Streuung  3,87  hellster Punkt 85
 *
 * Das Stadion ist also nicht unruhiger als das Halbtonraster im
 * Kopfbereich, aber es ist HELLER (61 gegen 47) und es ist figuerlich.
 * Das Auge versucht ein Bild zu lesen und findet keines. Genau davor
 * warnt der eigene Kommentar in Hero.tsx seit dem 07.09.2026: "entweder
 * deutlich zeigen oder weglassen, die Mitte kostet nur". Das Stadion ist
 * diese Mitte.
 */

export type GrundId = "ist" | "leer" | "flutlicht" | "wort" | "linien" | "raster" | "flaeche";

/* --------------------------------------------------------------- */

/** Der Stand von heute, als Vergleichspunkt im Umschalter. */
function Ist() {
  return (
    <Image
      src="/fischspieler.png"
      alt=""
      width={1600}
      height={486}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 hidden w-full opacity-[0.26] sm:block"
    />
  );
}

/*
 * 1 LEER, nach The Immortals.
 *
 * Kein Grund. Die Trennung macht allein die Haarlinie oben und unten und
 * der Abstand. Das ist die konsequenteste der sechs Richtungen und die
 * einzige, die gar nichts kostet.
 *
 * DER HAKEN, und der gehoert ins Memo: Der Abschnitt darueber ist
 * ebenfalls schwarz. Ohne Grund sehen beide gleich aus, und die Seite
 * verliert einen Rhythmuswechsel, den sie heute hat.
 */
function Leer() {
  return null;
}

/*
 * 2 FLUTLICHT, nach WC 2026 Data Portraits.
 *
 * Ein einziger weicher Lichtschein, kein Motiv. Er sitzt oben links hinter
 * der Ueberschrift, weil dort der Blick anfaengt, und faellt zur Mitte hin
 * ab. Dazu ein zweiter, kleinerer und kaelterer unten rechts, damit die
 * Flaeche nicht nach einer Seite kippt.
 *
 * Warum das zu einem Sportplatz passt und nicht nur modisch ist: Ein
 * Flutlichtmast wirft genau so, ein breiter Kegel von oben aussen. Es ist
 * dieselbe Idee wie das Stadion, nur ohne die Zeichnung.
 *
 * Reines CSS. Kein Bild, kein Netzverkehr, kein Seitenverhaeltnis, das bei
 * einem Tausch nachgezogen werden muss.
 */
function Flutlicht() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: [
          "radial-gradient(70% 90% at 12% -10%, rgb(243 218 11 / 0.16), rgb(243 218 11 / 0) 62%)",
          "radial-gradient(45% 60% at 88% 108%, rgb(243 218 11 / 0.07), rgb(243 218 11 / 0) 70%)",
        ].join(","),
      }}
    />
  );
}

/*
 * 3 GEISTERWORT, nach The Performance Lab.
 *
 * Die Schrift ist der Grund. "KREISLIGA B" in Konturschrift, so gross,
 * dass es unten aus dem Abschnitt laeuft, und deshalb angeschnitten.
 *
 * Warum ausgerechnet dieses Wort: Es ist das, was der Abschnitt erzaehlt,
 * und es ist neu. Der Verein spielt erstmals Kreisliga B. Ein Grund, der
 * etwas sagt, ist besser als einer, der etwas darstellt.
 *
 * NUR KONTUR, keine Fuellung. Eine gefuellte Schrift dieser Groesse waere
 * eine Flaeche und wuerde mit dem Text darueber um Aufmerksamkeit
 * streiten. Die Kontur ist eine Linie und bleibt dadurch Hintergrund.
 *
 * aria-hidden, denn "KREISLIGA B" steht bereits im Text darueber. Ein
 * Vorleseprogramm soll es nicht zweimal sagen.
 */
function Geisterwort() {
  return (
    <p
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-[0.22em] hidden select-none whitespace-nowrap text-center font-display text-[19vw] font-extrabold leading-none tracking-tighter sm:block"
      style={{
        color: "transparent",
        WebkitTextStroke: "1.5px rgb(243 218 11 / 0.20)",
      }}
    >
      KREISLIGA B
    </p>
  );
}

/*
 * 4 SPIELFELDLINIEN, eigene Richtung.
 *
 * Der Platz als Zeichnung, nicht als Bild: Mittellinie, Anstosskreis,
 * Strafraum, Torraum, in duennen Linien. Angeschnitten, so wie eine
 * Bauzeichnung angeschnitten ist.
 *
 * Die Masse sind ECHT und nicht geschaetzt, nach Regel 1 der Spielregeln:
 * Feld 105 mal 68 Meter, Anstosskreis 9,15 Meter Radius, Strafraum 40,32
 * mal 16,5, Torraum 18,32 mal 5,5, Elfmeterpunkt bei 11 Metern, Eckbogen
 * 1 Meter. Der Massstab des Bildes ist also der Platz selbst.
 *
 * vectorEffect non-scaling-stroke haelt die Linien bei jeder Fenstergroesse
 * gleich duenn. Ohne das werden sie beim Skalieren mitfett und das Feld
 * sieht bei 1920 Pixeln anders aus als bei 1280.
 */
function Spielfeldlinien() {
  /*
   * strokeWidth 1 und nicht 0,35, und das ist der Fehler, der beim ersten
   * Versuch fast durchging: Mit vectorEffect non-scaling-stroke zaehlt die
   * Breite in GERAETEPUNKTEN und nicht mehr in Meilen des viewBox. 0,35
   * ist damit ein Drittel Bildpunkt, also unter der Aufloesung. Im
   * Uebersichtsblatt war die Zeichnung praktisch nicht zu sehen.
   *
   * Deckkraft 0,28 ist die Obergrenze und gerechnet: Eine Linie in
   * rgb(243 218 11 / 0.28) auf #0a0a0a ergibt rgb(75,68,10), und das sind
   * 4,95 zu 1 gegen die leise Schrift #b8b8b8. Bei 0,35 faellt der Wert
   * unter die geforderten 4,5.
   */
  const linie = { stroke: "rgb(243 218 11 / 0.28)", strokeWidth: 1, fill: "none", vectorEffect: "non-scaling-stroke" as const };
  return (
    <svg
      aria-hidden="true"
      /*
        AUSSCHNITT STATT GANZES FELD, und das ist nachgemessen.
        Der erste Versuch zeigte das komplette Feld mit viewBox 0 0 105 68.
        Bei einem Abschnitt von 1920 mal 679 Pixeln, also 2,83 zu 1, gegen
        ein Feld von 1,54 zu 1 blieb davon ein Mittelstreifen uebrig, in
        dem die Aussenlinien und die Strafraumkanten als senkrechte
        Striche standen. Das sah nach Rechtecken aus, nicht nach einem
        Platz.

        Jetzt der mittlere Ausschnitt, 53 der 105 Meter. Damit fuellt der
        Anstosskreis den Abschnitt fast genau in der Hoehe: Er misst 18,30
        Meter, sichtbar sind bei diesem Massstab rund 18,8. Einen
        Anstosskreis mit Mittellinie erkennt jeder sofort, auch
        angeschnitten.
      */
      viewBox="26 0 53 68"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
    >
      {/* Aussenlinien */}
      <rect x="0.5" y="0.5" width="104" height="67" {...linie} />
      {/* Mittellinie und Anstosskreis */}
      <line x1="52.5" y1="0.5" x2="52.5" y2="67.5" {...linie} />
      <circle cx="52.5" cy="34" r="9.15" {...linie} />
      <circle cx="52.5" cy="34" r="0.4" fill="rgb(243 218 11 / 0.28)" stroke="none" />
      {/* Strafraeume 40,32 mal 16,5 */}
      <rect x="0.5" y="13.84" width="16.5" height="40.32" {...linie} />
      <rect x="88" y="13.84" width="16.5" height="40.32" {...linie} />
      {/* Torraeume 18,32 mal 5,5 */}
      <rect x="0.5" y="24.84" width="5.5" height="18.32" {...linie} />
      <rect x="99" y="24.84" width="5.5" height="18.32" {...linie} />
      {/* Elfmeterpunkte bei 11 Metern */}
      <circle cx="11.5" cy="34" r="0.4" fill="rgb(243 218 11 / 0.28)" stroke="none" />
      <circle cx="93.5" cy="34" r="0.4" fill="rgb(243 218 11 / 0.28)" stroke="none" />
      {/* Eckboegen, Radius 1 Meter */}
      <path d="M 0.5 1.5 A 1 1 0 0 0 1.5 0.5" {...linie} />
      <path d="M 103.5 0.5 A 1 1 0 0 0 104.5 1.5" {...linie} />
      <path d="M 104.5 66.5 A 1 1 0 0 0 103.5 67.5" {...linie} />
      <path d="M 1.5 67.5 A 1 1 0 0 0 0.5 66.5" {...linie} />
    </svg>
  );
}

/*
 * 5 HALBTONRASTER, weitergefuehrt.
 *
 * Kein neues Vokabular: dasselbe Punktraster wie im Kopfbereich, nur
 * groeber (10 statt 6 Pixel Gitter) und von unten rechts nach oben links
 * ausgeblendet.
 *
 * Das ist die sparsamste Richtung. Sie erfindet nichts, sie fuehrt weiter,
 * was die Seite schon hat, und bindet den Abschnitt damit an den
 * Kopfbereich. Wer eine Seite ruhiger machen will, hat mit einer
 * Wiederholung fast immer mehr Erfolg als mit einem neuen Motiv.
 */
function Halbtonraster() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden sm:block"
      style={{
        backgroundImage:
          "radial-gradient(1.6px 1.6px at 1px 1px, rgb(243 218 11) 99%, transparent 100%), radial-gradient(1.6px 1.6px at 6px 6px, rgb(243 218 11) 99%, transparent 100%)",
        backgroundSize: "10px 10px",
        opacity: 0.22,
        maskImage: "linear-gradient(to top left, rgb(0 0 0 / 1) 0%, rgb(0 0 0 / 0) 68%)",
        WebkitMaskImage: "linear-gradient(to top left, rgb(0 0 0 / 1) 0%, rgb(0 0 0 / 0) 68%)",
      }}
    />
  );
}

/*
 * 6 EIGENE FLAECHE, nach BVB, Eintracht und Manchester City.
 *
 * Gar kein Motiv. Der Abschnitt bekommt eine eigene Materialflaeche,
 * flaeche-hoch (#1f1f1f) statt flaeche (#0a0a0a), und trennt sich damit
 * durch das Material statt durch Schmuck. Dazu eine schmale Lichtkante
 * oben, damit die Flaeche nicht nur heller, sondern gewollt aussieht.
 *
 * Das ist der Weg, den ALLE angesehenen Vereinsseiten gehen. Er ist
 * unspektakulaer und dafuer nie im Weg. Wer diese Richtung waehlt,
 * entscheidet, dass der Abschnitt keine Buehne braucht.
 */
function EigeneFlaeche() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-flaeche-hoch" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, rgb(243 218 11 / 0) 0%, rgb(243 218 11 / 0.45) 30%, rgb(243 218 11 / 0.45) 70%, rgb(243 218 11 / 0) 100%)",
        }}
      />
    </>
  );
}

export function Grund({ id }: { id: GrundId }) {
  switch (id) {
    case "ist":
      return <Ist />;
    case "leer":
      return <Leer />;
    case "flutlicht":
      return <Flutlicht />;
    case "wort":
      return <Geisterwort />;
    case "linien":
      return <Spielfeldlinien />;
    case "raster":
      return <Halbtonraster />;
    case "flaeche":
      return <EigeneFlaeche />;
  }
}
