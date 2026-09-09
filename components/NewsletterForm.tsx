"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  /* Was der Server dazu sagt. Null heisst: eigener Ersatztext. */
  const [meldung, setMeldung] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: für Menschen unsichtbares Feld, Bots füllen es oft automatisch aus
    if (data.get("website")) {
      setStatus("success");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email") }),
      });
      /*
       * Die Meldung kommt vom Server, nicht von hier.
       *
       * Vorher stand im Fehlerfall immer "Bitte später erneut versuchen".
       * Das ist der schlechteste Satz, den man jemandem geben kann, der
       * gerade etwas wollte: Er sagt nicht, was los ist, und bietet keinen
       * Weg. Die Route kennt den Grund und nennt die Mailadresse des
       * Vereins, also wird genau das gezeigt.
       */
      const daten = (await res.json().catch(() => ({}))) as {
        error?: string;
        hinweis?: string;
      };
      if (!res.ok) {
        setMeldung(daten.error ?? null);
        setStatus("error");
        return;
      }
      setMeldung(daten.hinweis ?? null);
      setStatus("success");
      setEmail("");
    } catch {
      setMeldung(null);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="mt-4 bg-flaeche-hoch px-3 py-2.5 text-sm text-fisch-yellow">
        {meldung ??
          "Danke! Bitte bestätigt die Anmeldung über den Link, den wir euch zuschicken."}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="newsletter-website">Website</label>
        <input
          id="newsletter-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <label htmlFor="newsletter-email" className="sr-only">
        E-Mail-Adresse
      </label>
      <div className="flex overflow-hidden border border-linie focus-within:border-fisch-yellow">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent px-3 py-2.5 text-sm text-text placeholder:text-text-leise focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 bg-fisch-yellow px-4 text-sm font-bold text-fisch-black transition-colors hover:bg-fisch-yellow-dark disabled:opacity-60"
        >
          {status === "loading" ? "…" : "Anmelden"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-400">
          {meldung ?? "Das hat leider nicht geklappt. Bitte später erneut versuchen."}
        </p>
      )}
      {/*
        Der Hinweis steht am Formular und nicht im Kleingedruckten, weil er
        genau hier gebraucht wird: Wer seine Adresse eintippt, soll vorher
        sehen koennen, was damit passiert.
      */}
      <p className="text-xs text-text-leise">
        Wir schicken euch eine Bestätigungsmail. Abmelden geht jederzeit über
        den Link am Ende jeder Nachricht. Mehr dazu in der{" "}
        <a
          href="/datenschutz"
          className="underline underline-offset-2 hover:text-fisch-yellow"
        >
          Datenschutzerklärung
        </a>
        .
      </p>
    </form>
  );
}
