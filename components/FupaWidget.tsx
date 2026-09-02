"use client";

import { useEffect, useRef } from "react";

import ExterneEinbettung from "@/components/ExterneEinbettung";

/*
 * Einbindung eines FuPa-Widgets (Tabelle, Spielplan, Liveticker).
 *
 * FuPa liefert zwei Teile: einen leeren Container mit einer Kennung und ein
 * Skript, das diese Kennung sucht und den Inhalt hineinschreibt. Die Kennung
 * entsteht im Widget-Builder unter widget.fupa.net und steckt fest im
 * gespeicherten Widget, dort hängen auch Mannschaft, Farben und Spaltenauswahl
 * dran. Wer die Darstellung ändern will, ändert sie also dort und nicht hier.
 *
 * Warum das Skript nicht einfach im HTML steht:
 *
 * 1. Zustimmung. Das Skript lädt von widget-api.fupa.net, dabei geht die
 *    IP-Adresse der Besucher dorthin. Es darf deshalb erst nach der
 *    Einwilligung angefordert werden, siehe lib/consent.ts. Ein Skript-Tag im
 *    ausgelieferten HTML führt sich sofort aus, Verstecken hilft dagegen nicht.
 * 2. Reihenfolge. Das Skript sucht beim Ausführen nach dem Container. Steht es
 *    vor ihm im Dokument, findet es nichts. Deshalb wird es erst angehängt,
 *    wenn der Container nachweislich im Dokument steht.
 * 3. Mehrere Widgets. Ein bereits geladenes Skript wird vom Browser nicht
 *    erneut ausgeführt. Damit ein zweites Widget auf derselben Seite ebenfalls
 *    gefüllt wird, wird das Skript-Element entfernt und neu gesetzt.
 */

const SKRIPT_URL = "https://widget-api.fupa.net/vendor/widget.js?v1";

interface FupaWidgetProps {
  /** Kennung aus dem Widget-Builder, z. B. "fp-widget_root-3ImOg9e9ZE7oYqJGP3IxRrUlYCt" */
  containerId: string;
  /** Was hier steht, bevor jemand zustimmt, z. B. "Tabelle der Kreisliga B" */
  beschreibung: string;
  /**
   * Auf welchen Reiter des Widgets gesprungen werden soll, z. B. "Liveticker".
   * Ohne Angabe bleibt der Reiter stehen, den FuPa selbst zuerst zeigt.
   */
  reiter?: string;
  className?: string;
}

/*
 * Sprung auf einen bestimmten Reiter.
 *
 * FuPa zeichnet oben im Widget eine Leiste mit Tabelle, Kader,
 * Spielerstatistik, Spielplan und Liveticker. Diese Reiter sind divs mit der
 * Klasse fp-widget-tab, ohne Adresse und ohne eigenen Zustand in der URL. Von
 * aussen ansteuern kann man sie deshalb nur, indem man den richtigen anklickt,
 * sobald er im Dokument steht.
 *
 * Nachgeprueft, nicht vermutet: Der Klick schaltet wirklich um, die Klasse
 * fp-widget-tab-active wandert mit und der Inhalt wird ausgetauscht.
 *
 * Wenn FuPa die Beschriftung eines Tages umbenennt, findet der Beobachter
 * nichts und gibt nach der Frist auf. Dann steht dort die gewoehnliche
 * Ansicht des Widgets, also immer noch etwas Brauchbares, statt einer leeren
 * Seite. Das ist der Grund fuer die Frist: ein Beobachter, der ewig lauscht,
 * haengt sonst still an jeder Seite.
 */
const FRIST_MS = 15000;

function reiterAnklicken(wurzel: HTMLElement, gesucht: string): () => void {
  let erledigt = false;

  const versuchen = () => {
    if (erledigt) return;
    const treffer = [...wurzel.querySelectorAll<HTMLElement>(".fp-widget-tab")].find(
      (r) => r.textContent?.trim().toLowerCase() === gesucht.toLowerCase()
    );
    if (!treffer) return;
    erledigt = true;
    if (!treffer.className.includes("active")) treffer.click();
    beobachter.disconnect();
    clearTimeout(uhr);
  };

  const beobachter = new MutationObserver(versuchen);
  const uhr = setTimeout(() => beobachter.disconnect(), FRIST_MS);

  beobachter.observe(wurzel, { childList: true, subtree: true });
  versuchen(); // falls das Widget schon steht

  return () => {
    erledigt = true;
    beobachter.disconnect();
    clearTimeout(uhr);
  };
}

function WidgetInhalt({
  containerId,
  reiter,
}: {
  containerId: string;
  reiter?: string;
}) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Ein eventuell vorhandenes Skript entfernen, damit es erneut ausgeführt wird.
    document
      .querySelectorAll(`script[src="${SKRIPT_URL}"]`)
      .forEach((s) => s.remove());

    const skript = document.createElement("script");
    skript.src = SKRIPT_URL;
    skript.async = true;
    document.body.appendChild(skript);

    const aufraeumen = reiter
      ? reiterAnklicken(container.current, reiter)
      : undefined;

    return () => {
      skript.remove();
      aufraeumen?.();
    };
  }, [containerId, reiter]);

  return (
    <div ref={container} id={containerId}>
      {/*
        Der Link ist die Fassung ohne Skript und bleibt stehen, bis FuPa den
        Container überschreibt. Wer kein JavaScript hat oder wartet, kommt so
        trotzdem an die Tabelle.
      */}
      <a
        href="https://www.fupa.net/club/sv-fisch"
        target="_blank"
        rel="noopener"
        className="text-sm font-semibold text-text underline underline-offset-2"
      >
        SV Fisch auf FuPa
      </a>
    </div>
  );
}

export default function FupaWidget({
  containerId,
  beschreibung,
  reiter,
  className,
}: FupaWidgetProps) {
  return (
    <ExterneEinbettung
      anbieter="fupa.net"
      beschreibung={beschreibung}
      className={className}
    >
      <WidgetInhalt containerId={containerId} reiter={reiter} />
    </ExterneEinbettung>
  );
}
