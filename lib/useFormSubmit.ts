"use client";

import { useState, type FormEvent } from "react";

export type FormStatus = "idle" | "loading" | "success" | "error";

/**
 * Teilt die fetch/Status-Logik zwischen Kontakt-, Sponsoring- und
 * Mitgliedsformular. Erwartet ein Honeypot-Feld namens "website" im Formular.
 */
export function useFormSubmit(endpoint: string) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (data.website) {
      // Honeypot ausgefüllt -> vermutlich Bot, so tun als ob es geklappt hat
      setStatus("success");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Anfrage fehlgeschlagen");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Unbekannter Fehler");
    }
  }

  return { status, errorMessage, handleSubmit };
}
