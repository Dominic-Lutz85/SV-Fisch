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
    inhalt: [
      "Für den Versand unseres Newsletters nutzen wir den Dienst Brevo der Sendinblue GmbH bzw. Brevo SA, 106 boulevard Haussmann, 75008 Paris, Frankreich. Die Verarbeitung findet auf Servern innerhalb der Europäischen Union statt, mit Brevo besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO.",
      "Die Anmeldung erfolgt im Double-Opt-in-Verfahren: Nach Eingabe der E-Mail-Adresse senden wir eine Bestätigungsmail. Erst mit dem Klick auf den darin enthaltenen Link wird die Adresse in den Verteiler aufgenommen. Zum Nachweis der Einwilligung speichern wir Zeitpunkt der Anmeldung und der Bestätigung.",
      "Rechtsgrundlage ist die Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Diese Einwilligung kann jederzeit für die Zukunft widerrufen werden, ohne Angabe von Gründen: über den Abmeldelink am Ende jeder Nachricht oder formlos an " + siteConfig.contact.email + ". Nach dem Widerruf wird die Adresse aus dem Verteiler gelöscht.",
      "[BITTE PRÜFEN/ERGÄNZEN – Diesen Abschnitt vor dem ersten Versand durch den Vorstand rechtlich prüfen lassen. Der Auftragsverarbeitungsvertrag muss im Brevo-Konto abgeschlossen und abgelegt sein.]",
    ],
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
        <div className="mb-10 border border-fisch-yellow-dark bg-fisch-yellow/25 p-5 text-sm text-text">
          <strong>[BITTE PRÜFEN/ERGÄNZEN]</strong> – Diese
          Datenschutzerklärung ist ein Platzhalter-Gerüst und ersetzt keine
          Rechtsberatung. Bitte vor Veröffentlichung durch eine sachkundige
          Stelle prüfen und an die tatsächlich eingesetzten Dienste
          anpassen.
        </div>
        <div className="flex flex-col gap-8">
          {abschnitte.map((a) => (
            <section key={a.titel}>
              <h2 className="font-display text-xl font-bold text-text">{a.titel}</h2>
              {/*
                Ein Abschnitt darf mehrere Absaetze haben.
                Vorher war "inhalt" immer eine einzige Zeichenkette. Beim
                Newsletter reicht das nicht: Dienstleister, Verfahren,
                Rechtsgrundlage und Widerruf sind vier Gedanken, und die in
                einen Block zu pressen macht einen Rechtstext unlesbar. Wer
                seine Rechte nicht findet, hat sie praktisch nicht.
              */}
              {(Array.isArray(a.inhalt) ? a.inhalt : [a.inhalt]).map((absatz) => (
                <p
                  key={absatz.slice(0, 40)}
                  className="mt-2 leading-relaxed text-text-leise"
                >
                  {absatz}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
