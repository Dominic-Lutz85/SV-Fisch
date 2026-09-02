import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ExterneEinbettung from "@/components/ExterneEinbettung";
import PersonCard from "@/components/PersonCard";
import ContactForm from "@/components/forms/ContactForm";
import { getVorstand } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktiert den SV Fisch 1964 e.V. – Anfahrt, Ansprechpartner und Kontaktformular.",
};

export default function KontaktPage() {
  const ansprechpartner = getVorstand().slice(0, 3);
  const { lat, lng } = siteConfig.contact;
  const delta = 0.01;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(",");
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <>
      <PageHeader
        eyebrow="Wir freuen uns auf euch"
        title="Kontakt"
        description="Fragen zum Verein, zur Mitgliedschaft oder zu einer Kooperation? Meldet euch gerne."
      />

      <div className="container-fisch grid gap-14 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h2 className="font-display text-2xl font-bold text-fisch-black">Nachricht senden</h2>
          <div className="mt-6">
            <ContactForm />
          </div>

          <div className="mt-12 flex flex-col gap-3 border border-fisch-line bg-white p-6">
            <p className="flex items-center gap-3 text-sm text-fisch-ink">
              <MapPin className="h-5 w-5 shrink-0 text-fisch-black" aria-hidden="true" />
              {siteConfig.contact.addressLines.join(", ")}
            </p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-center gap-3 text-sm text-fisch-ink hover:text-fisch-black"
            >
              <Mail className="h-5 w-5 shrink-0 text-fisch-black" aria-hidden="true" />
              {siteConfig.contact.email}
            </a>
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="flex items-center gap-3 text-sm text-fisch-ink hover:text-fisch-black"
            >
              <Phone className="h-5 w-5 shrink-0 text-fisch-black" aria-hidden="true" />
              {siteConfig.contact.phone}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <h2 className="mb-2 font-display text-2xl font-bold text-fisch-black">Anfahrt</h2>
            <p className="mb-4 text-sm text-fisch-muted">
              {siteConfig.contact.venueName}. [BITTE PRÜFEN/ERGÄNZEN – genaue
              Anfahrtsbeschreibung, Parkmöglichkeiten].
            </p>
            {/*
              Die Karte lud vorher immer, unabhängig davon, was jemand im
              Cookie-Banner angeklickt hatte. Jetzt steht bis zur Zustimmung
              ein Platzhalter, und openstreetmap.org bekommt die IP-Adresse
              der Besucher erst danach zu sehen.
            */}
            <ExterneEinbettung
              anbieter="openstreetmap.org"
              beschreibung="Karte mit dem Weg zum Sportplatz"
              className="min-h-80"
            >
              <div className="overflow-hidden border border-fisch-line">
                <iframe
                  title="Karte: Anfahrt zum Sportplatz SV Fisch"
                  src={mapSrc}
                  className="h-80 w-full"
                  loading="lazy"
                />
              </div>
            </ExterneEinbettung>
          </div>

          <div>
            <h2 className="mb-4 font-display text-2xl font-bold text-fisch-black">
              Ansprechpartner
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {ansprechpartner.map((p) => (
                <PersonCard key={`${p.name}-${p.rolle}`} person={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
