"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");

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
      if (!res.ok) throw new Error("Anfrage fehlgeschlagen");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="mt-4 rounded-md bg-fisch-white/10 px-3 py-2.5 text-sm text-fisch-yellow">
        Danke! Bitte bestätige deine Anmeldung über den Link, den wir dir
        zuschicken.
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
      <div className="flex overflow-hidden rounded-md border border-white/20 focus-within:border-fisch-yellow">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent px-3 py-2.5 text-sm text-fisch-white placeholder:text-fisch-white/40 focus:outline-none"
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
          Das hat leider nicht geklappt. Bitte später erneut versuchen.
        </p>
      )}
    </form>
  );
}
