"use client";

import { useSyncExternalStore } from "react";

const nichtsTun = () => () => {};
const imBrowser = () => true;
const aufDemServer = () => false;

/**
 * Liefert false, solange auf dem Server gerendert wird, und true, sobald es im
 * Browser läuft.
 *
 * Gebraucht überall dort, wo etwas ausdrücklich NICHT im ausgelieferten HTML
 * stehen soll: ein Portal (es braucht document), oder ein Hinweisbalken, der
 * sonst kurz aufblitzt, bevor gelesen werden kann, ob er schon weggeklickt war.
 *
 * Bewusst über useSyncExternalStore und nicht über einen Effect, der Zustand
 * setzt. React liest beim Rendern auf dem Server den dritten Parameter und im
 * Browser den zweiten, das ist derselbe Zweck ohne zusätzliches Rendern. Ein
 * Effect, der nur setState aufruft, wird von der Lint-Regel
 * react-hooks/set-state-in-effect zu Recht bemängelt.
 */
export function useImBrowser(): boolean {
  return useSyncExternalStore(nichtsTun, imBrowser, aufDemServer);
}
