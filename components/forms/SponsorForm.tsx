"use client";

import { useFormSubmit } from "@/lib/useFormSubmit";
import { TextField, TextAreaField, Honeypot } from "@/components/forms/FormField";
import { SuccessAlert, ErrorAlert } from "@/components/forms/FormAlert";
import { siteConfig } from "@/lib/config";

export default function SponsorForm() {
  const { status, errorMessage, handleSubmit } = useFormSubmit("/api/sponsor");

  if (status === "success") {
    return (
      <SuccessAlert>
        Danke für dein Interesse! Wir melden uns zeitnah bei dir, um die
        Details zu besprechen.
      </SuccessAlert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Firmenname" name="firma" required autoComplete="organization" />
        <TextField label="Ansprechpartner/in" name="ansprechpartner" required autoComplete="name" />
        <TextField label="E-Mail" name="email" type="email" required autoComplete="email" />
        <TextField label="Telefon" name="telefon" type="tel" autoComplete="tel" />
      </div>
      <TextField
        label="Wunschpaket (optional)"
        name="paket"
        placeholder="z. B. Bandenwerbung, Trikotsponsoring, Co-Sponsoring …"
      />
      <TextAreaField
        label="Nachricht"
        name="nachricht"
        required
        placeholder="Erzählt uns kurz, wie ihr euch ein Engagement vorstellt."
      />
      {status === "error" && (
        <ErrorAlert>
          {errorMessage ?? "Das hat leider nicht geklappt."} Alternativ
          erreicht ihr uns direkt per{" "}
          <a href={`mailto:${siteConfig.contact.email}`} className="underline">
            E-Mail
          </a>
          .
        </ErrorAlert>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="self-start rounded-full bg-fisch-yellow px-6 py-3 text-sm font-bold text-fisch-black transition-colors hover:bg-fisch-yellow-dark disabled:opacity-60"
      >
        {status === "loading" ? "Wird gesendet …" : "Anfrage senden"}
      </button>
      <p className="text-xs text-text-leise">
        Lieber direkt schreiben? Formular umgehen und eine Mail an{" "}
        <a href={`mailto:${siteConfig.contact.email}`} className="underline">
          {siteConfig.contact.email}
        </a>{" "}
        senden.
      </p>
    </form>
  );
}
