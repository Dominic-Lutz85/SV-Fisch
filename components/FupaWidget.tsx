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
  className?: string;
}

function WidgetInhalt({ containerId }: { containerId: string }) {
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

    return () => {
      skript.remove();
    };
  }, [containerId]);

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
        className="text-sm font-semibold text-fisch-black underline underline-offset-2"
      >
        SV Fisch auf FuPa
      </a>
    </div>
  );
}

export default function FupaWidget({
  containerId,
  beschreibung,
  className,
}: FupaWidgetProps) {
  return (
    <ExterneEinbettung
      anbieter="fupa.net"
      beschreibung={beschreibung}
      className={className}
    >
      <WidgetInhalt containerId={containerId} />
    </ExterneEinbettung>
  );
}
