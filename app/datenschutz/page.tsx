import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung des SV Fisch 1964 e.V.",
};

const abschnitte = [
  {
    titel: "1. Verantwortlicher",
    inhalt: `Verantwortlich für die Datenverarbeitung auf dieser Website ist der ${siteConfig.name}, [BITTE PRÜFEN/ERGÄNZEN – Anschrift], E-Mail: ${siteConfig.contact.email}.`,
  },
  {
    titel: "2. Hosting",
    inhalt:
      "Diese Website wird bei Vercel Inc. gehostet. Beim Aufruf der Website erhebt Vercel automatisch technische Zugriffsdaten (Server-Logs), u. a. IP-Adresse, Browsertyp, Datum und Uhrzeit des Zugriffs. [BITTE PRÜFEN/ERGÄNZEN – ggf. Auftragsverarbeitungsvertrag benennen, Serverstandort prüfen].",
  },
  {
    titel: "3. Cookies & Einwilligung",
    inhalt:
      "Beim ersten Besuch dieser Website wird über einen Cookie-Banner um Einwilligung für nicht notwendige Cookies gebeten. Technisch notwendige Cookies (z. B. zur Speicherung deiner Cookie-Auswahl) werden ohne gesonderte Einwilligung gesetzt, Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.",
  },
  {
    titel: "4. Kontakt-, Sponsoring- und Mitgliedsformulare",
    inhalt:
      "Wenn du eines unserer Formulare nutzt, werden die von dir eingegebenen Daten (z. B. Name, E-Mail-Adresse, Nachricht) zum Zweck der Bearbeitung deiner Anfrage per E-Mail an den Verein übermittelt und dort verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. f DSGVO. Der Versand erfolgt über den E-Mail-Dienstleister Resend (bzw. einen vergleichbaren SMTP-Dienst). [BITTE PRÜFEN/ERGÄNZEN – Auftragsverarbeitungsvertrag mit dem Mail-Provider abschließen und hier benennen].",
  },
  {
    titel: "5. Newsletter",
    inhalt:
      "Bei Anmeldung zum Newsletter wird deine E-Mail-Adresse zum Zweck des Versands von Vereinsneuigkeiten verwendet. [BITTE PRÜFEN/ERGÄNZEN – Double-Opt-in-Verfahren, eingesetzten Newsletter-Dienst und Widerrufsmöglichkeit ergänzen].",
  },
  {
    titel: "6. Eingebundene Karte (OpenStreetMap)",
    inhalt:
      "Auf der Kontaktseite binden wir eine Karte von OpenStreetMap ein. Beim Laden der Karte wird deine IP-Adresse an Server der OpenStreetMap Foundation übertragen. Weitere Informationen: https://wiki.osmfoundation.org/wiki/Privacy_Policy.",
  },
  {
    titel: "7. Social-Media-Links",
    inhalt:
      "Wir verlinken auf unsere Profile bei Instagram und Facebook. Es handelt sich um reine Links, keine eingebundenen Plugins – erst mit Klick auf den Link verlässt du unsere Seite und es gelten die Datenschutzbestimmungen des jeweiligen Anbieters.",
  },
  {
    titel: "8. Deine Rechte",
    inhalt:
      "Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch gegen die Verarbeitung deiner personenbezogenen Daten. Wende dich hierfür an die oben genannte Kontaktadresse. Zudem besteht ein Beschwerderecht bei der zuständigen Aufsichtsbehörde. [BITTE PRÜFEN/ERGÄNZEN – zuständige Aufsichtsbehörde benennen].",
  },
  {
    titel: "9. SSL-/TLS-Verschlüsselung",
    inhalt:
      "Diese Seite nutzt aus Sicherheitsgründen eine SSL-/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennst du am „https://“ in der Adresszeile deines Browsers.",
  },
];

export default function DatenschutzPage() {
  return (
    <>
      <PageHeader title="Datenschutzerklärung" />
      <div className="container-fisch max-w-2xl py-16 sm:py-20">
        <div className="mb-10 border border-fisch-yellow-dark bg-fisch-yellow/25 p-5 text-sm text-fisch-ink">
          <strong>[BITTE PRÜFEN/ERGÄNZEN]</strong> – Diese
          Datenschutzerklärung ist ein Platzhalter-Gerüst und ersetzt keine
          Rechtsberatung. Bitte vor Veröffentlichung durch eine sachkundige
          Stelle prüfen und an die tatsächlich eingesetzten Dienste
          anpassen.
        </div>
        <div className="flex flex-col gap-8">
          {abschnitte.map((a) => (
            <section key={a.titel}>
              <h2 className="font-display text-xl font-bold text-fisch-black">{a.titel}</h2>
              <p className="mt-2 leading-relaxed text-fisch-muted">{a.inhalt}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
