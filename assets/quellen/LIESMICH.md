# Quellbilder

Hier liegen Bilder so, wie sie angeliefert wurden. Sie werden **nicht**
ausgeliefert, `public/` bekommt nur die verarbeitete Fassung.

## fussballschuhe-original.png

Angeliefert am 08.09.2026 von Dominic, 1215 x 1295 Pixel, mit Alphakanal.

Daraus wurde `public/fussballschuhe.png` (153 x 320, 11 KB):

1. Auf den Inhalt beschnitten, damit der Aufhängering genau am oberen
   Bildrand sitzt. Sonst müsste die Lage an der Linie über Prozentwerte
   ausgerechnet werden.
2. Von rgb(248, 224, 0) auf das Vereinsgelb rgb(243, 218, 11) umgefärbt.
   Das geht nur, weil die Zeichnung einfarbig ist. Der Unterschied wäre
   direkt neben der gelben Linie sichtbar gewesen.
3. Auf 320 Pixel Höhe verkleinert, also das Doppelte der Anzeigehöhe von
   160.

**Reihenfolge beachten, falls das jemand wiederholt:** erst skalieren,
dann umfärben. Beim Skalieren entstehen an den Kanten Mischpixel mit
abweichender Farbe, die sonst als blasser Saum stehen bleiben.

## fussballer-original.png

Angeliefert am 08.09.2026, 1983 x 793 Pixel, mit Alphakanal, 91,2
Prozent transparent, 8,8 Prozent gelb, 0 Prozent schwarz.

Daraus wird `public/fischspieler.png` (1400 x 638, 251 KB): beschnitten
auf 1740 x 793, auf 1400 Pixel Breite verkleinert, einfarbig auf das
Vereinsgelb rgb(243, 218, 11) gesetzt.

**Ersetzt die frühere Fassung vom selben Tag.** Die hatte dieselbe Idee,
zeigte den Spieler aber viel loser aufgelöst: Beim Einbau als Grund war
die Figur kaum als Spieler zu erkennen, man sah vor allem Partikel. Der
Dateiname in `public/` ist absichtlich gleich geblieben, damit nur ein
Bild ausgeliefert wird und kein totes zweites im Verzeichnis liegt.

Die Zeichnung enthielt einige wenige rote Pixel (0,00 Prozent, also ein
paar Dutzend). Sie verschwinden durch das einfarbige Setzen von selbst
und brauchten keine eigene Behandlung.
