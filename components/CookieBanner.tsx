"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { useConsent, setConsent } from "@/lib/consent";
import { useImBrowser } from "@/lib/useImBrowser";

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

  const visible = imBrowser && stored === null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="false"
          aria-label="Cookie-Einstellungen"
          className="fixed inset-x-0 bottom-0 z-[70] border-t border-linie bg-flaeche-hoch backdrop-blur px-4 py-5 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] sm:px-6"
        >
          <div className="container-fisch flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm text-text">
              Wir verwenden Cookies, um diese Website nutzerfreundlich zu
              gestalten und Formulare sowie eingebettete Inhalte (z. B. Karte)
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
