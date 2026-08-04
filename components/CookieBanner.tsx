"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "sv-fisch-cookie-consent";

type Consent = "all" | "essential";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot() {
  return "all"; // serverseitig immer als "bereits entschieden" behandeln, kein Banner im initialen HTML
}

function setConsent(consent: Consent) {
  window.localStorage.setItem(STORAGE_KEY, consent);
  window.dispatchEvent(new CustomEvent("sv-fisch-consent-change", { detail: consent }));
  listeners.forEach((listener) => listener());
}

export default function CookieBanner() {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const visible = stored === null;

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
          className="fixed inset-x-0 bottom-0 z-[70] border-t border-fisch-line bg-fisch-white/97 backdrop-blur px-4 py-5 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] sm:px-6"
        >
          <div className="container-fisch flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm text-fisch-ink">
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
                className="rounded-full border border-fisch-black px-4 py-2 text-sm font-semibold text-fisch-black hover:bg-fisch-black hover:text-fisch-white"
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
