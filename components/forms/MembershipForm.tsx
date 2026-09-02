"use client";

import { useFormSubmit } from "@/lib/useFormSubmit";
import { TextField, TextAreaField, Honeypot } from "@/components/forms/FormField";
import { SuccessAlert, ErrorAlert } from "@/components/forms/FormAlert";
import { siteConfig } from "@/lib/config";

export default function MembershipForm() {
  const { status, errorMessage, handleSubmit } = useFormSubmit("/api/membership");

  if (status === "success") {
    return (
      <SuccessAlert>
        Danke für dein Interesse am SV Fisch! Wir melden uns in Kürze mit den
        nächsten Schritten bei dir.
      </SuccessAlert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Vorname" name="vorname" required autoComplete="given-name" />
        <TextField label="Nachname" name="nachname" required autoComplete="family-name" />
        <TextField label="E-Mail" name="email" type="email" required autoComplete="email" />
        <TextField label="Telefon" name="telefon" type="tel" autoComplete="tel" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="abteilung" className="text-sm font-semibold text-text">
          Interesse an <span className="text-text">*</span>
        </label>
        <select
          id="abteilung"
          name="abteilung"
          required
          className="w-full border border-linie bg-flaeche-hoch px-3.5 py-2.5 text-sm text-text focus:border-text focus:outline-none"
        >
          <option value="">Bitte auswählen …</option>
          <option value="Fußball (aktiv)">Fußball (aktiv)</option>
          <option value="Bambini">Bambini</option>
          <option value="Gymnastik">Gymnastik</option>
          <option value="Fördermitgliedschaft">Fördermitgliedschaft</option>
        </select>
      </div>
      <TextAreaField
        label="Nachricht (optional)"
        name="nachricht"
        placeholder="Fragen oder Anmerkungen zu deiner Mitgliedschaft?"
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
    </form>
  );
}
