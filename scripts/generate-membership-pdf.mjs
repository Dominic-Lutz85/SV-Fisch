// Einmal-Skript: erzeugt eine einfache, druckbare Platzhalter-PDF
// (Beitrittserklärung) ganz ohne externes PDF-Package.
import { writeFileSync } from "node:fs";

const lines = [
  { text: "SV Fisch 1964 e.V. — Beitrittserklärung", size: 16, gap: 34, bold: true },
  { text: "[BITTE PRÜFEN/ERGÄNZEN] – Platzhalterdokument, vor Verwendung rechtlich prüfen.", size: 9, gap: 26 },
  { text: "Hiermit erkläre ich meinen Beitritt zum SV Fisch 1964 e.V.", size: 11, gap: 30 },
  { text: "Vorname, Nachname:  ______________________________________________", size: 11, gap: 22 },
  { text: "Geburtsdatum:  ______________________________________________", size: 11, gap: 22 },
  { text: "Straße, Hausnummer:  ______________________________________________", size: 11, gap: 22 },
  { text: "PLZ, Ort:  ______________________________________________", size: 11, gap: 22 },
  { text: "Telefon:  ______________________________________________", size: 11, gap: 22 },
  { text: "E-Mail:  ______________________________________________", size: 11, gap: 34 },
  { text: "Abteilung (bitte ankreuzen):", size: 11, gap: 20 },
  { text: "[ ]  Fußball        [ ]  Gymnastik        [ ]  Fördermitgliedschaft", size: 11, gap: 34 },
  { text: "Mitgliedsbeitrag: [BITTE PRÜFEN/ERGÄNZEN] EUR pro [Monat/Jahr]", size: 11, gap: 34 },
  { text: "SEPA-Lastschriftmandat", size: 12, gap: 22, bold: true },
  { text: "IBAN:  ______________________________________________", size: 11, gap: 22 },
  { text: "Kontoinhaber/in:  ______________________________________________", size: 11, gap: 34 },
  { text: "Ort, Datum:  ______________________________________________", size: 11, gap: 22 },
  { text: "Unterschrift:  ______________________________________________", size: 11, gap: 34 },
  { text: "Bitte senden an: [Vereinsadresse eintragen] oder per Mail an info@sv-fisch.de", size: 10, gap: 26 },
  { text: "[BITTE PRÜFEN/ERGÄNZEN] – Dieses Dokument muss vor dem Einsatz durch den", size: 9, gap: 14 },
  { text: "Vorstand geprüft werden (Datenschutzhinweise, Widerrufsrecht, Satzungsbezug).", size: 9, gap: 14 },
];

function pdfEscape(text) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

// WinAnsi/Latin-1 passt für deutsche Umlaute direkt auf die Byte-Werte.
function toLatin1Buffer(str) {
  return Buffer.from(str, "latin1");
}

let y = 780;
const contentParts = ["BT"];
for (const line of lines) {
  const font = line.bold ? "/F2" : "/F1";
  contentParts.push(`${font} ${line.size} Tf`);
  contentParts.push(`1 0 0 1 50 ${y} Tm`);
  contentParts.push(`(${pdfEscape(line.text)}) Tj`);
  y -= line.gap;
}
contentParts.push("ET");
const streamText = contentParts.join("\n");
const streamBuf = toLatin1Buffer(streamText);

const objects = [];
objects.push(`<< /Type /Catalog /Pages 2 0 R >>`);
objects.push(`<< /Type /Pages /Kids [3 0 R] /Count 1 >>`);
objects.push(
  `<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /MediaBox [0 0 595 842] /Contents 6 0 R >>`
);
objects.push(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`);
objects.push(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`);

const header = Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "latin1");
const parts = [header];
const offsets = [];
let cursor = header.length;

function pushObj(num, bodyBuf) {
  const prefix = Buffer.from(`${num} 0 obj\n`, "latin1");
  const suffix = Buffer.from("\nendobj\n", "latin1");
  offsets[num] = cursor;
  parts.push(prefix, bodyBuf, suffix);
  cursor += prefix.length + bodyBuf.length + suffix.length;
}

pushObj(1, Buffer.from(objects[0], "latin1"));
pushObj(2, Buffer.from(objects[1], "latin1"));
pushObj(3, Buffer.from(objects[2], "latin1"));
pushObj(4, Buffer.from(objects[3], "latin1"));
pushObj(5, Buffer.from(objects[4], "latin1"));

const streamObjBody = Buffer.concat([
  Buffer.from(`<< /Length ${streamBuf.length} >>\nstream\n`, "latin1"),
  streamBuf,
  Buffer.from("\nendstream", "latin1"),
]);
pushObj(6, streamObjBody);

const xrefStart = cursor;
let xref = `xref\n0 7\n0000000000 65535 f \n`;
for (let i = 1; i <= 6; i++) {
  xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
}
const trailer = `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

parts.push(Buffer.from(xref + trailer, "latin1"));

const pdf = Buffer.concat(parts);
const outPath = process.cwd() + "/public/downloads/beitrittserklaerung.pdf";
writeFileSync(outPath, pdf);
console.log("geschrieben:", outPath, pdf.length, "bytes");
