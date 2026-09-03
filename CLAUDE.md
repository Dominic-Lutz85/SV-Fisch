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

## Drei Wächter laufen am Bau, alle drei sind gegengeprüft

`npm run build` bricht ab, wenn einer davon anschlägt:

- **`pruefe:bilder`** (vorher): ein Bildverweis ohne Datei. Im dunklen Layout
  sieht man ein fehlendes Bild nicht, es ist schwarze Fläche auf schwarzem
  Grund. Sichtbar war es nur als 400 in der Netzwerkliste.
- **`pruefe:sitemap`** (vorher): `app/sitemap.ts` pflegt seine Liste von Hand
  und passt nicht mehr zu den Seiten unter `app/`, in beide Richtungen.
- **`pruefe:verlinkung`** (nachher): eine Seite ist in keinem ausgelieferten
  HTML verlinkt. Sie prüft das gebaute Ergebnis unter `.next/server/app`, nicht
  den Quelltext. Grund steht in der Datei.

Wer einen weiteren Wächter dazulegt, prüft ihn **vorher in beide Richtungen**:
ein eingebauter Verstoß muss ihn rot machen, der saubere Stand grün. Ein
Wächter, dessen Rotwerden man nie gesehen hat, bewacht nichts.

## Das Hauptmenü verlinkt nichts

`MainMenu` hängt per Portal am `body` und entsteht erst im Browser. Im
ausgelieferten HTML steht es **nicht**. Eine Seite, die nur dort verlinkt ist,
existiert für Suchmaschinen und für jeden ohne JavaScript nicht. Genau so waren
`/kontakt` und `/elfer-turnier` monatelang unsichtbar.

Jede neue Seite braucht deshalb zusätzlich einen festen Verweis aus etwas, das
der Server ausliefert, in der Regel `components/Footer.tsx`. `pruefe:verlinkung`
achtet darauf, aber der Gedanke gehört an den Anfang und nicht ans Ende.

## Server nach Client, nicht umgekehrt

`MainMenu` läuft im Browser, `PraesentiertVon` liest beim Bauen Dateien vom
Datenträger. Das Menü kann den Sponsorblock deshalb nicht selbst einbinden.
`Header` erzeugt ihn und reicht ihn als Eigenschaft hinein.

Dabei die Falle im Kopf behalten: Fest verdrahtetes JSX, das über diese Grenze
gereicht wird, kommt drüben als gewöhnliches Feld an, und React verlangt für
Felder Schlüssel. Wer hier etwas ergänzt, prüft die Konsole auf
"unique key"-Warnungen, siehe die Begründung in `app/page.tsx`.

## Eine Eigenschaft, eine Quelle

`PraesentiertVon` hatte `sm:items-end` fest eingebaut, während jeder Aufrufer
zusätzlich seine eigene Ausrichtung mitgab. Zwei Klassen derselben CSS-
Eigenschaft in einer Liste entscheidet **nicht** die Reihenfolge im Attribut,
sondern die im Stylesheet. Das Ergebnis ist damit geraten statt bestimmt.

Wenn ein Baustein an mehreren Stellen anders aussehen soll, gehört der Wert an
die Aufrufstelle und nirgendwo sonst hin. Gleiches gilt für Größen: `groesse`
steht beim Aufruf, weil dieselbe Marke neben einer Überschrift groß und im Menü
kleiner steht und beides Absicht ist.

## Sponsorendaten: nachsehen statt annehmen

`content/sponsoren.json` ist die einzige Quelle für Name, Stufe, Logo, Maße und
Adresse. Beim Ergänzen gilt:

- **Jede Adresse vor dem Eintragen aufrufen** und gegen die Firma auf dem Logo
  prüfen. Eine plausibel klingende Domain ist kein Beleg.
- **Die Schreibweise von der Firma übernehmen**, nicht vom Logo ablesen. So
  wurde aus "Edelobst-Brennerei Roland Lutz" das eigene "Edelobstbrennerei" und
  aus "Höllen Design" das durchgehend verwendete "Hoellen Design".
- **`breite` und `hoehe` sind die echten Maße der Datei.** Wer ein Logo
  austauscht, trägt die neuen mit ein, sonst wird es verzerrt.
- **Ohne bekannte Adresse kein `url`.** Die Kachel wird dann ein `div` statt
  eines Ankers. Ein `a` ohne `href` ist kein Link, es sieht nur so aus.
- **Fremde Logos nie umfärben.** Wer eine helle Fassung braucht, fragt beim
  Sponsor nach; sonst kommt das Logo auf eine helle Platte. Das gilt auch für
  `grayscale`: entfärben ist umfärben. Nur eine Fassung, die der Sponsor selbst
  so liefert, darf so gezeigt werden.
- **`beschreibung` ist Pflicht und stammt von der Firma.** Ein Satz, was sie
  macht, wörtlich sinngemäß von ihrer Internetseite. Nicht ausgedacht, nicht
  vom Logo abgelesen. Der Sinn der Sponsorenwand ist, dass sie ein Verzeichnis
  der Betriebe im Ort ist und nicht eine Reihe Aufkleber; das trägt nur, wenn
  die Angaben stimmen.
- **`rel="sponsored"` gehört an jeden Sponsorenlink**, denn es sind bezahlte
  Platzierungen. Es gehört NICHT an den Fanshop, der dem Verein selbst gehört.
  Bei einem Suchen-und-Ersetzen über `rel` jeden Treffer einzeln ansehen: das
  Attribut ist eine Aussage über die Wirklichkeit, keine Formatierung.
