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
