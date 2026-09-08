import type { CSSProperties } from "react";

/*
 * ERKUNDUNG, KEIN PRODUKTIONSCODE.
 *
 * Vier Materialien fuer den Abschnitt "Spiele und Tabelle". Kein Motiv, kein
 * Muster, kein Bild. Der Abschnitt trennt sich allein durch seine Flaeche.
 *
 * ALLE VIER SIND AN ECHTEN SEITEN GEMESSEN, am 08.09.2026, indem die
 * Startseite als ein Bild aufgenommen und die linke Spalte Zeile fuer Zeile
 * ausgelesen wurde. Keine Schaetzung, keine Erinnerung:
 *
 *   Eintracht Frankfurt   wechselt zwischen rgb(18,18,18) und rgb(0,0,0),
 *                         ohne jede Trennlinie. Ein hervorgehobener Block
 *                         liegt auf rgb(42,42,42). Also drei Ebenen mit
 *                         sehr kleinen Stufen.
 *   Manchester City       dunkler Kopfbereich rgb(0,12,28), danach eine
 *                         weisse Flaeche rgb(255,255,255) ueber 3796 Pixel,
 *                         dann ein blaues Band, dann dunkler Fuss.
 *   Mainz 05              weiss, dann ein Abschnitt in dunklem Vereinsrot
 *                         rgb(174,15,10), dann Vereinsrot rgb(227,6,19).
 *   BVB                   gelbes Kopfband, danach durchgehend rgb(0,0,0).
 *
 * Unsere Stufe von #0a0a0a auf #1f1f1f sind 21 Helligkeitsstufen. Eintracht
 * arbeitet mit 18. Wir liegen also genau in dem Bereich, den eine dunkle
 * Vereinsseite tatsaechlich benutzt.
 *
 * WARUM DIE KARTEN MITWANDERN MUESSEN, und das faellt einem erst beim Bauen
 * auf: Fixtures und TeamTableMini stehen selbst auf bg-flaeche-hoch. Hebt man
 * nur den Abschnitt auf dieselbe Farbe, verschwinden die Karten darin und es
 * bleibt nur ihre Rahmenlinie. Deshalb setzen die Richtungen die Variable
 * --color-flaeche-hoch am Abschnitt neu, statt an den Komponenten zu drehen.
 * Das ist kein Trick, sondern der Zweck von Farbtoken.
 */

export type MaterialId = "ist" | "stufe" | "kasten" | "hell" | "gelb";

export interface Material {
  id: MaterialId;
  /* Klassen fuer das section-Element. */
  abschnitt: string;
  /* Variablen und Farben, die an den Abschnitt gehen. */
  stil?: CSSProperties;
  /* Liegt der Inhalt auf hellem Grund? Steuert Ueberschrift und Knoepfe. */
  hell?: boolean;
  /* Legt den Inhalt in einen eigenen Kasten statt ueber die volle Breite. */
  kasten?: boolean;
  /* Stil fuer diesen Kasten, falls es einen gibt. */
  kastenStil?: CSSProperties;
}

/*
 * WARUM DIE FARBE ALS INLINE-STIL UND NICHT ALS KLASSE KOMMT, und das ist
 * eine Falle, in die ich beim ersten Versuch gelaufen bin:
 *
 * Eine CSS-Variable gilt auch fuer das Element, an dem sie gesetzt wird.
 * Steht am Abschnitt die Klasse bg-flaeche-hoch UND die Neusetzung von
 * --color-flaeche-hoch auf #2c2c2c, dann faerbt sich der Abschnitt selbst
 * auf #2c2c2c mit, und die Karten darin sind wieder genauso hell wie er.
 * Die Stufe waere weg, und zwar unsichtbar, weil beides gleichzeitig
 * passiert.
 *
 * Der Abschnitt bekommt seine Farbe deshalb direkt, die Variable gilt nur
 * noch fuer alles darunter.
 */

export const MATERIALIEN: Record<MaterialId, Material> = {
  /*
   * Der Stand von heute, als Vergleichspunkt: schwarz wie die Seite, dazu
   * eine Haarlinie oben und unten. Die Linie macht die ganze Trennung, die
   * Flaeche macht keine.
   */
  ist: {
    id: "ist",
    abschnitt: "border-y border-linie bg-flaeche text-text",
  },

  /*
   * A EINE STUFE, nach Eintracht Frankfurt.
   *
   * Der Abschnitt geht eine Stufe hoch, auf #1f1f1f, und die Rahmenlinien
   * fallen weg. Wo die Flaeche wechselt, braucht es keine Linie mehr: Zwei
   * Materialien nebeneinander sind bereits eine Kante. Eintracht macht das
   * ueber die ganze Startseite so, ohne eine einzige Trennlinie.
   *
   * Die Karten gehen auf #2c2c2c mit, sonst verschwinden sie im Abschnitt.
   * Damit hat die Seite an dieser Stelle drei Ebenen: Seite 10, Abschnitt
   * 31, Karten 44. Eintracht hat 0, 18 und 42.
   */
  stufe: {
    id: "stufe",
    abschnitt: "text-text",
    stil: {
      backgroundColor: "#1f1f1f",
      ["--color-flaeche-hoch" as string]: "#2c2c2c",
    },
  },

  /*
   * B EIN KASTEN.
   *
   * Kein Band ueber die volle Breite. Der Abschnitt bleibt schwarz wie die
   * Seite, und der ganze Inhalt liegt in EINEM Kasten, der vom Seitenrand
   * abrueckt. Getrennt wird durch Hoehe statt durch Flaeche.
   *
   * Der Unterschied zu A ist nicht die Farbe, sondern die Kante: Bei A laeuft
   * die Flaeche bis zum Bildschirmrand und der Abschnitt ist ein Band. Hier
   * hoert sie vorher auf und der Abschnitt ist ein Gegenstand. Das aendert,
   * wie die Seite gelesen wird, und zwar mehr als jede Farbe.
   *
   * Karten wieder eine Stufe hoeher, aus demselben Grund wie bei A.
   */
  kasten: {
    id: "kasten",
    abschnitt: "bg-flaeche text-text",
    kasten: true,
    kastenStil: {
      backgroundColor: "#1f1f1f",
      ["--color-flaeche-hoch" as string]: "#2c2c2c",
    },
  },

  /*
   * C HELL UMGEKEHRT, nach Manchester City.
   *
   * Die groesste Trennung, die es gibt: Der Abschnitt wird hell. Bei
   * Manchester City sind das 3796 Pixel reines Weiss zwischen dunklem
   * Kopfbereich und dunklem Fuss.
   *
   * DIE KARTEN BLEIBEN DUNKEL, und das ist Absicht und keine Sparmassnahme.
   * In components/Fixtures.tsx steht seit dem Farbumbau, warum die frueher
   * vorhandene helle Fassung entfallen ist: Sie wurde nirgends benutzt, also
   * nicht gepflegt, und irgendwann stand im Ergebniskasten heller Text auf
   * hellem Grund bei 1,21 zu 1. Ein Zweig, den niemand sieht, wird nicht
   * gepflegt. Diese Richtung holt ihn NICHT zurueck: Dunkle Karten auf
   * hellem Grund sind ein eigener, gaengiger Look und kosten keine zweite
   * Fassung.
   *
   * Ueberschrift, Fliesstext und Knoepfe drehen mit. Die Dachzeile hat dafuer
   * bereits einen Schalter, on="hell".
   */
  hell: {
    id: "hell",
    abschnitt: "bg-fisch-white text-fisch-ink",
    hell: true,
  },

  /*
   * D VEREINSGELB, nach Mainz 05.
   *
   * Mainz stellt einen ganzen Abschnitt in die Vereinsfarbe, gemessen
   * rgb(174,15,10) und rgb(227,6,19). Fuer uns waere das Vereinsgelb.
   *
   * DAS RISIKO STEHT AUF DERSELBEN SEITE und muss im Zusammenhang beurteilt
   * werden, nicht am einzelnen Abschnitt: Ueber den Nachrichten liegt bereits
   * das gelbe Chronikband. Zwei gelbe Flaechen auf einer Startseite koennen
   * eine Klammer sein oder ein Durcheinander. Deshalb zeigt die Buehne den
   * Abschnitt NIE allein, sondern immer mit dem Chronikband darueber.
   */
  gelb: {
    id: "gelb",
    abschnitt: "bg-fisch-yellow text-fisch-black",
    hell: true,
  },
};
