@AGENTS.md

## Nie ein Problem ohne Lösungsvorschlag melden

Wenn beim Arbeiten an dieser Seite etwas auffällt, das nicht stimmt, gehört zu
jedem Befund direkt ein konkreter Vorschlag dazu, wie er zu beheben wäre.

Nicht "die Tabelle ist veraltet", sondern "die Tabelle steht auf Spieltag 1, ich
würde sie an das FuPa-Widget hängen, dann pflegt sie sich selbst".

Gibt es mehrere Wege, alle kurz nennen und **einen davon empfehlen**, statt die
Wahl kommentarlos abzugeben. Steht die Lösung noch nicht fest, ist das auch ein
Vorschlag: sagen, was zuerst gemessen oder nachgesehen werden müsste, um sie zu
finden.

Ein Befund ohne Vorschlag verschiebt die Arbeit nur, und wer ihn später liest,
hat den Zusammenhang nicht mehr im Kopf.

## Diese Seite ist eine Arbeitsprobe

Sie soll optisch und technisch so gut sein, dass ein möglicher Auftraggeber
daraus schließt, dass Dominic ihm auch eine Website bauen kann. In der Fußzeile
steht "Design & Umsetzung: Dominic Lutz", damit ist die Seite eine Visitenkarte
und kein Nebenprodukt.

Was das für die Arbeit hier heißt:

**Sichtbare Platzhalter sind Ausschlusskriterien, keine Schönheitsfehler.** Wer
eine Website vergeben will, liest die Texte. Steht dort "[BITTE PRÜFEN/ERGÄNZEN]"
oder "[Name eintragen]", ruft er nicht an. Solche Stellen haben deshalb Vorrang
vor jeder Gestaltungsidee.

**Impressum und Datenschutz sind das erste, was geprüft wird.** Sie müssen
vollständig und richtig sein, nicht nur vorhanden.

**Zahlen schlagen Behauptungen.** Ladezeit, Kontraste, Struktur, Barrierefreiheit
kann jeder in einer Minute selbst messen. Deshalb wird hier gemessen statt
geschätzt, und die Messwerte gehören in die Commit-Nachricht.

**Nichts einbauen, das man nicht erklären kann.** Jede Besonderheit muss einer
Nachfrage standhalten. Wo eine Entscheidung von der offensichtlichen Lösung
abweicht, steht die Begründung als Kommentar daneben.

## Bilder: nie ein Verweis ohne Datei

`npm run build` startet `scripts/pruefe-bilder.mjs` und bricht ab, wenn ein
Bildverweis ins Leere geht. Der Wächter ist da, weil genau das monatelang
unbemerkt lief: In einem dunklen Layout sieht man ein fehlendes Bild nicht,
hinter dem Bildplatz liegt eine schwarze Fläche auf schwarzem Grund. Sichtbar
war es nur als 400 in der Netzwerkliste.

Für Fotos, die der Verein erst noch liefern muss, gibt es
`components/Vereinsbild.tsx`. Es prüft beim Bauen, ob die Datei da ist, und
zeichnet sonst eine gestaltete Leerstelle mit dem fehlenden Pfad. Kein fremdes
Foto unter eine falsche Bildbeschreibung setzen, auch wenn es gerade passt.

## Tote Zweige sofort ausbauen

Wenn eine Umschaltung im Quelltext nur noch eine Stellung kennt, gehört sie
raus, bevor etwas anderes gemacht wird. In der Spielliste stand nach dem Umbau
auf Dunkel noch eine Umschaltung hell/dunkel. In dem Zweig, den niemand mehr
ansah, stand heller Text auf heller Fläche, 1,21 zu 1, mit einem Kommentar
darüber, der 18,3 behauptete. Gefunden wurde das beim Ausbauen, nicht beim
Messen.

## Überschriftebenen sind Eigenschaften

Bausteine, die eine Überschrift zeichnen und an mehreren Stellen vorkommen
(`NewsCard`, `SponsorWall`), nehmen die Ebene als Eigenschaft mit `h3` als
Vorgabe. Fest eingebaut ist sie höchstens an einem Einsatzort richtig, und eine
übersprungene Ebene sieht man auf dem Bildschirm nie.

## Nach jeder sichtbaren Änderung messen

Zwei Läufe, sie finden verschiedene Sachen:

1. Eigener Durchlauf über jeden Textknoten mit Kontrastrechnung, plus die Probe
   auf Flächen, die auf gleichfarbigem Grund liegen. Farben über ein Canvas
   auflösen, ein einfacher Parser verliest sich an `oklab()`.
2. Lighthouse über **alle** Seitentypen, nicht über die eine, an der gerade
   gearbeitet wurde. Beim letzten Mal saßen zwei von drei Funden auf Seiten,
   die niemand im Verdacht hatte.
