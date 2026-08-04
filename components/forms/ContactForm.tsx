"use client";

import { useFormSubmit } from "@/lib/useFormSubmit";
import { TextField, TextAreaField, Honeypot } from "@/components/forms/FormField";
import { SuccessAlert, ErrorAlert } from "@/components/forms/FormAlert";
import { siteConfig } from "@/lib/config";

export default function ContactForm() {
  const { status, errorMessage, handleSubmit } = useFormSubmit("/api/contact");

  if (status === "success") {
    return (
      <SuccessAlert>
        Danke für deine Nachricht! Wir melden uns so schnell wie möglich bei
        dir zurück.
      </SuccessAlert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Name" name="name" required autoComplete="name" />
        <TextField label="E-Mail" name="email" type="email" required autoComplete="email" />
      </div>
      <TextField label="Betreff" name="betreff" required />
      <TextAreaField label="Nachricht" name="nachricht" required />
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
        {status === "loading" ? "Wird gesendet …" : "Nachricht senden"}
      </button>
    </form>
  );
}
