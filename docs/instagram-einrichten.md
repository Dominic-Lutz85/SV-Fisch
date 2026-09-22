# Instagram im Kopfbereich einrichten

Das Bildfenster oben rechts auf der Startseite zeigt den neuesten
Instagram-Beitrag des Vereins, sobald ein Zugangsschlüssel hinterlegt ist.
Ohne Schlüssel steht dort ein festes Foto. Das ist kein Fehler, sondern
der eingebaute Rückfall (siehe `app/page.tsx`).

Diese Anleitung führt einmal durch die Einrichtung. Danach muss der
Schlüssel **alle 60 Tage erneuert** werden, dafür gibt es unten einen
eigenen Abschnitt und ein Skript.

Stand: 22.09.2026. Meta ändert die Oberfläche regelmäßig, die
Bezeichnungen können abweichen. Was sich nicht ändert, ist die
Reihenfolge: Konto prüfen, App anlegen, Konto mit der App verbinden,
**Einladung annehmen**, Schlüssel erzeugen, Schlüssel eintragen.

---

## Was NICHT gebraucht wird

**Die Zugangsdaten der Facebook-Seite des Vereins.** Das war lange anders
und ist der Grund, warum das hier liegengeblieben ist.

Seit 2024 gibt es bei Meta den Weg „Instagram API with Instagram Login",
und der kommt ohne verknüpfte Facebook-Seite aus. Diese Seite ist von
Anfang an dafür gebaut: `lib/instagram.ts` fragt `graph.instagram.com` ab
und nicht `graph.facebook.com`. Das ist genau der Unterschied zwischen den
beiden Wegen.

Facebook kommt nur noch an einer Stelle vor: Das Entwicklerkonto bei Meta
hängt an einem Facebook-Konto. Dafür reicht ein **beliebiges eigenes**
Konto, es muss nichts mit dem Verein zu tun haben.

---

## Schritt 0: Ist das Instagram-Konto ein Profikonto?

**Der häufigste Grund, warum es später nicht klappt.** Der Weg über
Instagram-Login unterstützt ausschließlich Business- und Creator-Konten,
private Konten nicht.

So zu sehen: Das Profil <https://www.instagram.com/sv.fisch/> öffnen. Steht
unter dem Namen eine Kategorie wie „Sportverein" oder „Amateursportteam",
ist es bereits ein Profikonto.

Falls nicht, in der Instagram-App umstellen: Einstellungen → Konto →
Kontotyp → Zu Profikonto wechseln. Das ist kostenlos, dauert eine Minute
und ändert für Follower nichts Sichtbares.

## Schritt 1: Entwicklerkonto

<https://developers.facebook.com> öffnen, mit dem eigenen Facebook-Konto
anmelden, einmalig als Entwickler registrieren.

## Schritt 2: App anlegen

„Meine Apps" → „App erstellen".

- Als Anwendungsfall bzw. Typ **Business** wählen.
- Name frei, zum Beispiel „SV Fisch Website". Er taucht später in der
  Berechtigungsabfrage auf, also nichts Kryptisches nehmen.

## Schritt 3: Instagram hinzufügen

Im App-Dashboard nach unten zu **„Produkt hinzufügen"**, dort
**Instagram** suchen und auf **„Einrichten"** klicken.

Danach links im Menü: **Instagram → API-Einrichtung mit Instagram-Login**.

## Schritt 4: Konto verbinden und die Einladung ANNEHMEN

Im Abschnitt „1. Konten für Tests generieren" bzw. „Instagram-Konto
hinzufügen" das Vereinskonto `sv.fisch` verbinden.

> **Das ist die Stelle, an der es am häufigsten scheitert.** Nach dem
> Verbinden verschickt Meta eine **Einladung an das Instagram-Konto**, und
> die muss dort angenommen werden, sonst bleibt alles Weitere grau. Die
> Einladung liegt in der Instagram-App unter Einstellungen →
> Website-Berechtigungen bzw. Apps und Websites.

## Schritt 5: Schlüssel erzeugen

Im selben Bereich, Abschnitt **„2. Zugriffstoken generieren"**, auf
**„Token generieren"** klicken. Die Berechtigungsabfrage bestätigen.

Benötigt wird nur die Leseberechtigung **`instagram_business_basic`**. Die
Seite holt ausschließlich Bilder, sie schreibt nichts.

Eine Prüfung durch Meta („App Review") ist dafür **nicht** nötig, solange
nur das eigene, mit der App verbundene Konto gelesen wird.

Der Schlüssel erscheint einmal auf dem Bildschirm. Er ist lang und sieht
aus wie wirres Zeug, das ist richtig so. **Kopieren.**

## Schritt 6: Eintragen, und zwar bei Vercel

Die Seite läuft auf **Vercel**, nicht auf Hostinger (geprüft am
22.09.2026: `Server: Vercel` im Antwortkopf von sv-fisch.com). Der README
beschreibt Hostinger als möglichen Weg, benutzt wird er nicht.

Bei Vercel → Projekt `sv-fisch` → Settings → Environment Variables, **zwei**
Werte anlegen:

| Name | Wert |
| --- | --- |
| `INSTAGRAM_TOKEN` | der kopierte Schlüssel |
| `INSTAGRAM_TOKEN_ERNEUERT_AM` | das heutige Datum als `JJJJ-MM-TT` |

Der zweite ist kein Beiwerk: Ohne ihn kann der Wächter beim Bauen nicht
ausrechnen, wie lange der Schlüssel noch gilt, und das Ablaufen fällt erst
auf, wenn das Fenster schon wochenlang das feste Foto zeigt.

Zum lokalen Ausprobieren dieselben zwei Zeilen in `.env.local`. Diese Datei
ist in `.gitignore` und gehört **niemals** ins Repository.

## Schritt 7: Neu bauen lassen

Umgebungsvariablen greifen erst beim nächsten Bau. Bei Vercel unter
Deployments den letzten Eintrag → „Redeploy".

Danach steht im Kopfbereich statt des Elferturnier-Fotos der neueste
Beitrag, und das Fenster führt auf genau diesen Beitrag statt auf das
Profil.

---

## Alle 60 Tage: erneuern

Der Schlüssel gilt 60 Tage und lässt sich ab dem zweiten Tag beliebig oft
verlängern. Läuft er ab, hilft kein Verlängern mehr, dann geht es bei
Schritt 5 von vorne los.

```bash
node scripts/instagram-token.mjs
```

Das Skript liest den alten Schlüssel aus `.env.local`, holt bei Meta einen
neuen und schreibt auf den Bildschirm, was bei Vercel einzutragen ist. Es
legt den neuen Schlüssel **nirgends ab**, denn ein Geheimnis, das ein
Skript in eine Datei schreibt, landet irgendwann im Repository.

Sinnvoll ist, das **alle 30 Tage** zu tun statt alle 60. Dann bleibt nach
einem Fehlschlag noch ein ganzer Monat Luft.

---

## Wenn nichts erscheint

Der Reihe nach prüfen, die Liste ist nach Häufigkeit sortiert:

1. **Einladung nicht angenommen** (Schritt 4). Mit Abstand der häufigste
   Fall.
2. **Kein Profikonto** (Schritt 0). Wurde das Konto nachträglich wieder
   auf privat gestellt, hört der Schlüssel sofort auf zu wirken.
3. **Nicht neu gebaut** (Schritt 7). Die alte Fassung liegt weiter im
   Zwischenspeicher.
4. **Schlüssel abgelaufen.** `node scripts/instagram-token.mjs` sagt es
   im Klartext.
5. **Der neueste Beitrag ist ein Reel oder eine Mehrbildfolge, die Meta
   ohne `media_url` ausliefert.** `neuesterBeitrag()` geht dann die
   letzten fünf Beiträge durch und nimmt den ersten brauchbaren, siehe
   `lib/instagram.ts`. Erscheint gar nichts, war keiner der letzten fünf
   brauchbar.

Der Bau sagt in jedem Fall, woran er ist:

```
Instagram: kein Schluessel hinterlegt, Abschnitt bleibt aus. Das ist kein Fehler.
```
