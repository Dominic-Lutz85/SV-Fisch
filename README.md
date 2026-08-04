# SV Fisch 1964 e.V. — Vereinswebsite

Neue Website des SV Fisch 1964 e.V. (Fußball & Gymnastik), gebaut mit
Next.js (App Router), TypeScript, Tailwind CSS und Framer Motion.

## Inhaltsverzeichnis

- [Schnellstart](#schnellstart)
- [Inhalte pflegen (ohne Programmierkenntnisse)](#inhalte-pflegen-ohne-programmierkenntnisse)
- [Bilder & Logos austauschen](#bilder--logos-austauschen)
- [ENV-Variablen & Mailversand](#env-variablen--mailversand)
- [Deployment auf Vercel](#deployment-auf-vercel)
- [Vor dem Go-Live prüfen](#vor-dem-go-live-prüfen-wichtig)
- [Projektstruktur](#projektstruktur)

## Schnellstart

Voraussetzung: Node.js 20+

```bash
npm install
npm run dev
```

Die Seite läuft dann unter `http://localhost:3000`.

Produktions-Build lokal testen:

```bash
npm run build
npm run start
```

## Inhalte pflegen (ohne Programmierkenntnisse)

Alle veränderlichen Inhalte liegen als einfache JSON- bzw. Markdown-Dateien
im Ordner `content/`. Zum Ändern reicht ein Texteditor – kein
Programmieraufwand nötig. Nach dem Speichern automatisch übernehmen lassen
(lokal: Seite lädt neu; live: neu deployen, siehe unten).

| Datei | Steuert |
|---|---|
| `content/vorstand.json` | Vorstandsmitglieder (Name, Rolle, Kontakt) |
| `content/sponsoren.json` | Sponsorenwand (Name, Stufe, Logo-Datei, Link) |
| `content/kader.json` | Kader der 1. Mannschaft |
| `content/kader-bambini.json` | Bambini-Kader |
| `content/tabelle.json` | Tabelle der 1. Mannschaft |
| `content/spielplan.json` | Spielplan/Ergebnisse der 1. Mannschaft |
| `content/spielplan-bambini.json` | Spielplan der Bambini |
| `content/termine.json` | Kalender-Termine (Spiele, Versammlungen, Feste) |
| `content/galerie.json` | Galerie-Alben und Bildpfade |
| `content/news/*.md` | Meldungen unter „Aktuelles" – **eine Datei pro Meldung** |
| `lib/config.ts` | Vereinsname, Kontaktdaten, Social-Media-Links, Fanshop-Link, Mitgliederzahlen |

### Neue Meldung unter „Aktuelles" veröffentlichen

Neue Datei in `content/news/` anlegen (Dateiname = URL-Slug), z. B.
`content/news/neuer-trainer.md`:

```markdown
---
title: "Neuer Trainer für die erste Mannschaft"
slug: "neuer-trainer"
date: "2026-09-01"
kategorie: "Fußball"
teaser: "Kurzer Anrisstext, der auf der Übersichtsseite angezeigt wird."
teaserbild: "/news/neuer-trainer.png"
---

Hier der ausführliche Text der Meldung. Markdown wird unterstützt
(Überschriften mit `##`, **fett**, Listen, Links).
```

Das Teaserbild (`teaserbild`) muss als Datei unter `public` liegen (siehe
nächster Abschnitt). Diese Fläche ist genau die News-Sektion direkt auf der
Startseite ("Neues aus dem Verein") sowie die komplette `/aktuelles`-Seite –
jede neue Markdown-Datei erscheint dort automatisch mit Text und Bild, ganz
ohne Code-Änderung.

### Fanshop-Link und Social-Media-Links ändern

Beides liegt zentral in `lib/config.ts`:

```ts
fanshopUrl: process.env.NEXT_PUBLIC_FANSHOP_URL || "https://www.spreadshirt.de/",
social: {
  instagram: "https://instagram.com/...",
  facebook: "https://facebook.com/...",
  ...
}
```

Einfach die URL ersetzen (oder testweise per `NEXT_PUBLIC_FANSHOP_URL` in den
Vercel-Umgebungsvariablen überschreiben, ohne Code zu ändern).

## Bilder & Logos austauschen

**Alle Fotos und Sponsoren-Logos sind bewusst als echte Dateien unter
`public/` angelegt** (nicht als Code-generierte Platzhalter) – damit ein
Foto später einfach durch eine Datei mit demselben Namen ersetzt werden
kann, ganz ohne Code-Änderung:

| Bereich | Pfad | Format |
|---|---|---|
| Vereinswappen | `public/logo.svg` | SVG |
| Startseiten-Hero | `public/hero/home-hero.png` | 1600×900 |
| News-Teaserbilder | `public/news/<slug>.png` | 1200×800 |
| Galerie | `public/gallery/<album>/<n>.png` | 1200×900 |
| Sponsoren-Logos | `public/sponsoren/<slug>.png` | 400×200 |
| Beitrittserklärung (PDF) | `public/downloads/beitrittserklaerung.pdf` | A4 |

Aktuell sind dort **abstrakte Platzhalterbilder** in den Vereinsfarben
hinterlegt (kein Stock-Fotomaterial). Zum Austauschen: eigenes Foto unter
exakt demselben Dateinamen/-pfad speichern und die alte Datei überschreiben.
Nutzt ihr ein anderes Dateiformat (z. B. `.jpg` statt `.png`), müsst ihr
zusätzlich den Dateinamen in der jeweiligen `content/*.json`- bzw.
`content/news/*.md`-Datei anpassen (eine Textzeile).

Das aktuelle Wappen (`public/logo.svg`) ist eine von Claude nachgebaute
Annäherung an das eingesendete Vereinswappen (kein pixelgenauer Import
möglich, da nur ein Bild im Chat geteilt wurde, keine Originaldatei). Bitte
bei Gelegenheit durch die echte Wappendatei ersetzen – Formate `.svg` oder
`.png` funktionieren beide unter dem Pfad `public/logo.svg` bzw. mit
angepasstem Verweis in `app/layout.tsx` (`icons`), `app/icon.svg`,
`app/apple-icon.tsx` und `app/opengraph-image.tsx`.

## ENV-Variablen & Mailversand

Die drei Formulare (Kontakt, Sponsor werden, Mitglied werden) sowie die
Newsletter-Anmeldung versenden E-Mails über
[Resend](https://resend.com). Ohne konfigurierten API-Key werden
Formulareingaben nur ins Server-Log geschrieben (praktisch für lokale
Entwicklung), es geht nichts verloren, aber es wird auch keine echte Mail
verschickt.

`.env.local` (lokal) bzw. Vercel-Projekteinstellungen → Environment
Variables (live):

```bash
# Pflicht für echten Mailversand
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# Wohin Formulareingaben gesendet werden
CONTACT_TO_EMAIL=info@sv-fisch.de

# Absenderadresse – muss in Resend verifiziert sein (eigene Domain empfohlen)
MAIL_FROM="SV Fisch Website <formular@sv-fisch.de>"

# Optional: Fanshop-Link ohne Code-Änderung überschreiben
NEXT_PUBLIC_FANSHOP_URL=https://www.spreadshirt.de/dein-shop
```

Alternative zu Resend: In `lib/mail.ts` lässt sich `sendMail()` leicht auf
`nodemailer` mit eigenem SMTP-Server umstellen – die Formulare und
API-Routes ändern sich dabei nicht.

## Deployment auf Vercel

1. Repository zu GitHub/GitLab pushen (falls noch nicht geschehen).
2. In [vercel.com](https://vercel.com) „New Project" → Repository
   auswählen. Next.js wird automatisch erkannt.
3. Unter „Environment Variables" die oben genannten Variablen eintragen.
4. Deployen. Danach in `lib/config.ts` `url: "https://www.sv-fisch.de"`
   final auf die echte Domain prüfen (steuert u. a. Sitemap und
   Open-Graph-Bilder).

## Vor dem Go-Live prüfen (wichtig)

Im Code mit `[BITTE PRÜFEN/ERGÄNZEN]` markierte Stellen vor
Veröffentlichung ausfüllen bzw. durch eine sachkundige Stelle prüfen
lassen:

- `app/impressum/page.tsx` – Anschrift, Vertretungsberechtigte,
  Registernummer
- `app/datenschutz/page.tsx` – eingesetzte Dienste vollständig benennen,
  Auftragsverarbeitungsverträge
- `app/verein/satzung/page.tsx` – echte, von der Mitgliederversammlung
  beschlossene Satzung einsetzen
- `public/downloads/beitrittserklaerung.pdf` – Platzhalterdokument, echte
  Beitrittserklärung des Vereins verwenden
- `content/vorstand.json` – echte Namen und Kontaktdaten
- `lib/config.ts` – Adresse, Telefonnummer, Registergericht,
  Kartenkoordinaten (`contact.lat`/`contact.lng`)

Diese Website wurde mit Unterstützung einer KI erstellt und liefert **keine
Rechtsberatung** – Impressum, Datenschutzerklärung und Satzung sind
Platzhalter-Gerüste.

## Projektstruktur

```
app/                   Next.js App-Router-Seiten & API-Routes
components/             Wiederverwendbare UI-Komponenten
components/forms/       Formulare (Kontakt, Sponsor, Mitglied) + Bausteine
content/                 Redaktionelle Inhalte (JSON/Markdown)
lib/                     Content-Loader, Konfiguration, Hilfsfunktionen
public/                   Statische Dateien: Logo, Bilder, Downloads
scripts/                  Einmal-Skripte, die die Platzhalterbilder/-PDF erzeugt haben
```

## Tech-Stack

- Next.js 16 (App Router, React Server Components)
- TypeScript
- Tailwind CSS v4
- Framer Motion (dezente Scroll-/Hover-Animationen)
- Resend (Formular-Mailversand)
- Zod (Formular-Validierung serverseitig)
- react-markdown (News-Artikel aus Markdown)
