"use client";

import { useSyncExternalStore } from "react";

/*
 * Ein Ort für die Cookie-Entscheidung.
 *
 * Vorher lag sie ausschließlich im CookieBanner: der Banner schrieb sie nach
 * localStorage und niemand las sie wieder. Die Karte auf der Kontaktseite lud
 * openstreetmap.org unabhängig davon, was jemand angeklickt hatte. Ein Banner,
 * der eine Wahl anbietet und sie dann nicht einlöst, ist schlechter als gar
 * keiner: er behauptet etwas, das nicht stimmt.
 *
 * Wer hier etwas ergänzt: Jeder fremde Inhalt (Karten, Widgets von fupa.net
 * oder fussball.de, Videos) gehört hinter useConsent bzw. hinter die
 * Komponente ExterneEinbettung. Nichts von außen darf laden, bevor jemand
 * zugestimmt hat.
 */

export const CONSENT_STORAGE_KEY = "sv-fisch-cookie-consent";
export const CONSENT_EVENT = "sv-fisch-consent-change";

export type Consent = "all" | "essential";

const listeners = new Set<() => void>();

function melden() {
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  // Auch auf Änderungen aus einem anderen Tab hören.
  const beiSpeicher = (e: StorageEvent) => {
    if (e.key === CONSENT_STORAGE_KEY) callback();
  };
  window.addEventListener("storage", beiSpeicher);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", beiSpeicher);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

function getSnapshot(): Consent | null {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) as Consent | null;
  } catch {
    // Privater Modus oder gesperrte Speicherung: dann gilt "nicht entschieden".
    return null;
  }
}

/*
 * Serverseitig gilt bewusst "noch nicht entschieden".
 *
 * Damit steht kein fremder Inhalt im ausgelieferten HTML, sondern erst der
 * Platzhalter. Ein iframe, das schon im HTML steht, lädt beim ersten Aufbau
 * der Seite, also bevor irgendein Skript die Entscheidung nachsehen könnte.
 * Genau das war der Fehler bei der Karte.
 */
function getServerSnapshot(): Consent | null {
  return null;
}

export function useConsent(): Consent | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setConsent(consent: Consent) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, consent);
  } catch {
    // Speichern kann fehlschlagen. Die Entscheidung gilt dann nur für diesen
    // Seitenaufruf, was besser ist, als die Seite deswegen abstürzen zu lassen.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
  melden();
}
