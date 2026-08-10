import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Prüft, ob sich ein Datumsstring sauber parsen lässt. In den
 * Content-Dateien landet gelegentlich ein nicht-ISO-Format (z. B.
 * "Sonntag 23.08.2026 um 14:00" statt "2026-08-23T14:00:00") – das würde
 * `Intl.DateTimeFormat`/`toISOString` sonst mit einem Absturz der ganzen
 * Seite quittieren, statt nur die betroffene Zeile falsch anzuzeigen.
 */
function parseDatum(iso: string): Date | null {
  const datum = new Date(iso);
  return Number.isNaN(datum.getTime()) ? null : datum;
}

export function formatDatum(iso: string, options?: Intl.DateTimeFormatOptions): string {
  const datum = parseDatum(iso);
  if (!datum) return iso;
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  }).format(datum);
}

export function formatDatumLang(iso: string): string {
  const datum = parseDatum(iso);
  if (!datum) return iso;
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(datum);
}

export function formatUhrzeit(iso: string): string {
  const datum = parseDatum(iso);
  if (!datum) return "";
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(datum);
}

/**
 * Normalisiert Bildpfade aus den Content-Dateien zu einem gültigen
 * `next/image`-src. Redaktionelle Einträge verweisen manchmal auf
 * "public/…", "/public/…" statt "/…" — das hier fängt die üblichen
 * Tippfehler ab, statt dass die Seite deswegen abstürzt.
 */
export function normalizeAssetPath(path: string | undefined): string | undefined {
  if (!path) return path;
  const trimmed = path.trim();
  if (/^https?:\/\//.test(trimmed)) return trimmed;
  const withoutPublicPrefix = trimmed.replace(/^\/?public\//, "");
  return withoutPublicPrefix.startsWith("/")
    ? withoutPublicPrefix
    : `/${withoutPublicPrefix}`;
}
