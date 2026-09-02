"use client";

import { useState } from "react";
import Link from "next/link";

import { useConsent, setConsent } from "@/lib/consent";
import { useImBrowser } from "@/lib/useImBrowser";

/*
 * Der Hinweis fährt von unten ein und beim Wegklicken wieder hinaus.
 *
 * Das lief vorher über framer-motion, wegen genau dieser einen Bewegung. Die
 * Bibliothek lag damit in dem Bündel, das auf JEDER Seite geladen wird, auch
 * auf denen, die nie eine Bewegung zeigen. Lighthouse hat davon 41 von 70 KiB
 * als ungenutzt gemeldet.
 *
 * Ersetzt durch zwei CSS-Animationen und dasselbe Zwei-Zustands-Muster, das
 * MainMenu schon benutzt:
 *   "gewuenscht" ist, ob der Hinweis stehen SOLL (kommt aus der Einwilligung),
 *   "haengt"     ist, ob er noch im Dokument HAENGT, damit er sein eigenes
 *                Hinausfahren ueberlebt.
 * Ohne den zweiten Zustand nimmt React das Element im selben Moment aus dem
 * Baum, in dem die Entscheidung faellt, und man sieht gar keine Bewegung.
 *
 * Die Regel fuer "Bewegung reduzieren" in globals.css setzt beide Animationen
 * sofort auf den Endzustand, deshalb braucht es hier keine eigene Abfrage.
 */

export default function CookieBanner() {
  const stored = useConsent();

  /*
   * Der Banner erscheint erst nach dem ersten Rendern im Browser. Sonst stünde
   * er im ausgelieferten HTML und wäre für einen kurzen Moment auch bei
   * Besuchern zu sehen, die längst entschieden haben. Die Entscheidung selbst
   * liegt in lib/consent.ts, damit eingebettete Inhalte dieselbe Quelle lesen.
   *
   * Bewusst über useSyncExternalStore und nicht über einen Effect, der Zustand
   * setzt: React liest beim Rendern auf dem Server den dritten Parameter und
   * im Browser den zweiten. Das ist derselbe Zweck ohne zusätzliches Rendern.
   */
  const imBrowser = useImBrowser();

  const gewuenscht = imBrowser && stored === null;
  const [haengt, setHaengt] = useState(false);

  // Beim Rendern statt im Effect, siehe MainMenu: so gibt es kein zweites
  // Rendern und die Fläche ist im selben Durchgang da.
  if (gewuenscht && !haengt) setHaengt(true);

  if (!haengt) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie-Einstellungen"
      onAnimationEnd={() => {
        // Erst wenn das Hinausfahren durch ist, darf das Element weg.
        if (!gewuenscht) setHaengt(false);
      }}
      className={`fixed inset-x-0 bottom-0 z-[70] border-t border-linie bg-flaeche-hoch px-4 py-5 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] backdrop-blur sm:px-6 ${
        gewuenscht ? "animate-leiste-ein" : "animate-leiste-aus"
      }`}
    >
      <div className="container-fisch flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-text">
          Wir verwenden Cookies, um diese Website nutzerfreundlich zu gestalten
          und Formulare sowie eingebettete Inhalte (z. B. Karte)
          bereitzustellen. Mehr dazu in unserer{" "}
          <Link
            href="/datenschutz"
            className="font-semibold underline underline-offset-2"
          >
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setConsent("essential")}
            className="rounded-full border border-text px-4 py-2 text-sm font-semibold text-text hover:bg-fisch-black hover:text-text"
          >
            Nur notwendige
          </button>
          <button
            type="button"
            onClick={() => setConsent("all")}
            className="rounded-full bg-fisch-yellow px-4 py-2 text-sm font-bold text-fisch-black hover:bg-fisch-yellow-dark"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
