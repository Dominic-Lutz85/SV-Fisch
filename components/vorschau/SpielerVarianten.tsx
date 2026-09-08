import Image from "next/image";

/*
 * ERKUNDUNG, KEIN PRODUKTIONSCODE.
 *
 * Vier Lagen fuer den Spieler im Abschnitt "Spiele und Tabelle".
 *
 * ZUR DATEI: 1939 mal 811 angeliefert, mit Alphakanal, 90,6 Prozent
 * transparent, 9,4 Prozent gelb, 0 Prozent schwarz. Also sauber
 * freigestellt, der schwarze Grund der Vorschau war nur die Seite
 * dahinter. Beschnitten 1474 mal 782, verarbeitet auf 1400 mal 743 und
 * von rgb(248,232,0) auf das Vereinsgelb rgb(243,218,11) umgefaerbt.
 *
 * ZUM ABSCHNITT, gemessen am 08.09.2026 bei 1920 Pixeln:
 *
 *   Abschnitt        1920 mal 679
 *   Spiele-Spalte    x 352..948,  endet bei y=533
 *   Tabelle          x 972..1568, endet bei y=582
 *   darunter frei    97 Pixel
 *
 * Der Spieler tritt nach RECHTS, die Partikelspur zieht nach links. Das
 * ist bei jeder Lage unten mitgedacht: Ein Motiv, das aus dem Bild
 * heraus laeuft, braucht Platz in Laufrichtung, sonst stoesst es an.
 */

/* ------------------------------------------------------------------ */
/* 1  Grosser Grund                                                    */
/* ------------------------------------------------------------------ */
/*
 * Der Spieler liegt riesig hinter dem ganzen Abschnitt, angeschnitten
 * links, und ist stark zurueckgenommen. Er wird damit zur Textur der
 * Flaeche statt zum Bild darin.
 *
 * Deckkraft 14 Prozent ist nachgerechnet und nicht geschaetzt: Das
 * Vereinsgelb hat eine relative Helligkeit von 0,70, der Grund #0a0a0a
 * liegt bei 0,004. Bei 14 Prozent kommt das Gelb auf rund 0,10, also
 * gut 2 zu 1 gegen den Grund. Das ist sichtbar, aber schwach genug,
 * dass die Schrift darauf ihre 4,5 zu 1 behaelt.
 *
 * Das ist die Lage mit dem groessten Risiko: Ein Motiv hinter Text ist
 * genau das, was im Kopfbereich schon einmal entfernt wurde, weil es
 * "kaum zu sehen war und dafuer den Text schlechter lesbar machte".
 */
export function SpielerGrund() {
  return (
    <Image
      src="/fischspieler.png"
      alt=""
      width={1600}
      height={486}
      aria-hidden="true"
      className="pointer-events-none absolute -left-40 bottom-0 hidden w-[1100px] max-w-none opacity-[0.14] sm:block"
    />
  );
}

/* ------------------------------------------------------------------ */
/* 2  Rechts unten, angeschnitten                                      */
/* ------------------------------------------------------------------ */
/*
 * Der Spieler laeuft unten rechts aus dem Abschnitt heraus, in voller
 * Deckkraft. Er belegt die 97 freien Pixel und ueberlappt die Tabelle
 * darueber nicht, weil er unter deren Unterkante bei y=582 beginnt.
 *
 * Angeschnitten heisst hier wirklich angeschnitten: Der Ball und der
 * vordere Fuss liegen ausserhalb. Das ist Absicht, ein Motiv, das an
 * der Kante endet, wirkt wie abgeschnitten, eines das darueber hinaus
 * laeuft wie in Bewegung.
 *
 * 300 PIXEL BREIT UND NICHT 560: Im ersten Durchgang war er 560 breit,
 * also 297 hoch, und lag damit ab y=422 auf der Tabellenkarte, deren
 * Unterkante bei 582 liegt. 160 Pixel Ueberlappung mit einer Tabelle,
 * die Zahlen traegt. Bei 300 Pixeln Breite ist er 159 hoch und bleibt
 * unter der Karte.
 *
 * Damit ist er allerdings deutlich kleiner als gedacht, und das ist der
 * ehrliche Befund zu dieser Lage: Rechts unten ist schlicht wenig Platz,
 * weil die Tabelle bis 46 Pixel ueber den Abschnittsrand reicht.
 */
export function SpielerRechtsUnten() {
  return (
    <Image
      src="/fischspieler.png"
      alt=""
      width={1600}
      height={486}
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-8 -right-16 hidden w-[300px] max-w-none opacity-90 sm:block"
    />
  );
}

/* ------------------------------------------------------------------ */
/* 3  Halb im Bild, unten mittig                                       */
/* ------------------------------------------------------------------ */
/*
 * HIESS IM ERSTEN DURCHGANG "BAND AM FUSS" UND WAR FALSCH BESCHRIEBEN.
 * Gedacht war ein Fries ueber die volle Breite. Ein einzelner Spieler
 * ist aber kein Muster: Im Vergleichsbogen sass er als einzelnes Motiv
 * rechts der Mitte, links davon war nichts, und von einem Band, das
 * durchlaeuft, konnte keine Rede sein. Fuer ein echtes Band braeuchte
 * es eine Wiederholung, und dafuer taugt eine Figur nicht.
 *
 * Was uebrig bleibt, ist trotzdem brauchbar und steht deshalb hier:
 * der Spieler halb im Bild, unten mittig, gross und zurueckgenommen.
 * Sichtbar sind Beine, Ball und Spur, der Oberkoerper liegt unterhalb
 * des Randes. Die Bewegung steckt ohnehin in den Beinen.
 */
export function SpielerBand() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[190px] overflow-hidden sm:block">
      <Image
        src="/fischspieler.png"
        alt=""
        width={1600}
        height={486}
        aria-hidden="true"
        className="absolute -bottom-24 left-1/2 w-[900px] max-w-none -translate-x-1/2 opacity-40"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4  Links unter den Spielen                                          */
/* ------------------------------------------------------------------ */
/*
 * Die zurueckhaltendste Lage: Der Spieler steht in der Luecke, die die
 * Spiele-Spalte laesst. Sie endet bei y=533, die Tabelle daneben erst
 * bei 582, darunter kommen 97 freie Pixel. Das sind zusammen 146 Pixel
 * Hoehe und 596 Pixel Breite, in die er ohne Ueberlappung passt.
 *
 * Er fuellt damit genau das Loch, das ein Zweispalter mit
 * unterschiedlich hohen Spalten immer hinterlaesst. Genau dieses Loch
 * ist am 02.09.2026 schon einmal Anlass gewesen, die Ueberschrift aus
 * der linken Spalte nach oben zu holen.
 */
export function SpielerLuecke() {
  return (
    <Image
      src="/fischspieler.png"
      alt=""
      width={1600}
      height={486}
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-4 left-[352px] hidden w-[420px] max-w-none opacity-80 sm:block"
    />
  );
}

export const SPIELER_LAGEN = [
  {
    id: "ohne",
    name: "Jetzt live",
    satz:
      "Ohne Spieler. Der Abschnitt ist 679 Pixel hoch, unter dem Inhalt bleiben 97 Pixel leer, links unter den Spielen weitere 49.",
  },
  {
    id: "grund",
    name: "1 · Großer Grund",
    satz:
      "Riesig hinter dem ganzen Abschnitt, angeschnitten links, 14 Prozent Deckkraft. Wird zur Textur der Fläche statt zum Bild darin.",
  },
  {
    id: "rechts",
    name: "2 · Rechts unten",
    satz:
      "Läuft unten rechts aus dem Abschnitt heraus, volle Deckkraft. Muss klein bleiben (300 statt 560 Pixel), sonst liegt er auf der Tabelle.",
  },
  {
    id: "band",
    name: "3 · Halb im Bild",
    satz:
      "Unten mittig, groß und halb außerhalb: Beine, Ball und Spur. Hieß erst „Band am Fuß“, das war falsch, eine einzelne Figur ergibt kein durchlaufendes Band.",
  },
  {
    id: "luecke",
    name: "4 · In der Lücke",
    satz:
      "Genau in das Loch, das die kürzere linke Spalte lässt: 596 mal 146 Pixel, ohne Überlappung.",
  },
] as const;
