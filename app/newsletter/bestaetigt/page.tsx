import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "@/components/PageHeader";

/*
 * Wo jemand landet, der in der Bestaetigungsmail auf den Link geklickt hat.
 *
 * WARUM DAFUER EINE EIGENE SEITE DA IST: Brevo braucht eine Adresse, auf die
 * es nach dem Klick weiterleitet. Ohne eine eigene waere das die Startseite,
 * und dort merkt niemand, dass gerade etwas passiert ist. Der Klick auf den
 * Bestaetigungslink ist der Moment, in dem die Anmeldung wirklich gilt, und
 * genau das soll dastehen.
 */

export const metadata: Metadata = {
  title: "Newsletter bestätigt",
  description: "Die Anmeldung zum Newsletter des SV Fisch 1964 e.V. ist bestätigt.",
  robots: { index: false, follow: true },
};

export default function NewsletterBestaetigtPage() {
  return (
    <>
      <PageHeader eyebrow="Newsletter" title="Ihr seid dabei" />
      <div className="container-fisch py-16 sm:py-20">
        <div className="max-w-xl">
          <p className="text-lg text-text">
            Die Anmeldung ist bestätigt. Ab jetzt bekommt ihr Spielergebnisse,
            Termine und Vereinsnachrichten direkt ins Postfach.
          </p>
          <p className="mt-4 text-text-leise">
            Abmelden geht jederzeit über den Link am Ende jeder Nachricht, ohne
            Angabe von Gründen und ohne Rückfrage.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full bg-fisch-yellow px-5 py-2.5 text-sm font-bold text-fisch-black hover:bg-fisch-yellow-dark"
            >
              Zur Startseite
            </Link>
            <Link
              href="/aktuelles"
              className="rounded-full border border-linie px-5 py-2.5 text-sm font-bold text-text hover:border-fisch-yellow hover:text-fisch-yellow"
            >
              Neuigkeiten lesen
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
