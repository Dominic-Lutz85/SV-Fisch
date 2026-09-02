/*
 * Kontrastpruefung ueber jeden sichtbaren Textknoten einer Seite.
 *
 * Zum Benutzen in die Konsole des Browsers einfuegen, oder ueber ein
 * Entwicklerwerkzeug einspielen. Ergebnis ist ein Objekt mit der Zahl der
 * geprueften Stellen und allen, die unter ihrem Ziel liegen.
 *
 * Warum diese Datei im Projekt liegt und nicht jedes Mal neu getippt wird:
 * Die Fassungen aus dem Kopf hatten zweimal denselben Fehler an
 * unterschiedlichen Stellen, und beide Male hat das Rauschen erzeugt oder
 * einen Fund vorgetaeuscht. Beide Fallen stehen unten ausgeschrieben.
 *
 * Falle 1: Farben liest man nicht, man malt sie auf.
 *   Tailwind 4 gibt Farben als oklab() aus. Setzt man die einem Canvas als
 *   fillStyle und liest den Wert zurueck, bekommt man bei oklab OHNE Deckkraft
 *   eine normale rgb-Angabe, bei oklab MIT Deckkraft aber die oklab-Zeichenkette
 *   unveraendert. Ein Parser, der die ersten drei Zahlen als Rot, Gruen, Blau
 *   nimmt, liest dann 0.78 / 0.00003 / 0.00001 und meldet Fastschwarz.
 *   Das hat einen Kontrast von 5,79 als 1,27 gemeldet.
 *   Die Loesung ist, die Farbe wirklich auf einen Bildpunkt zu malen, ueber dem
 *   bekannten Hintergrund, und den Bildpunkt auszulesen. Das loest jeden
 *   Farbraum und rechnet die Deckkraft gleich mit ein.
 *
 * Falle 2: Text nur fuer Vorlesehilfen zaehlt nicht.
 *   Ein sr-only-Kasten ist einen Pixel gross und beschnitten, aber nicht
 *   unsichtbar im Sinne von getComputedStyle. Zaehlt man ihn mit, meldet eine
 *   Sponsorenwand neun Verstoesse, die niemand je sieht, und ein echter Fund
 *   geht darin unter.
 */
(() => {
  const ctx = document.createElement("canvas").getContext("2d", {
    willReadFrequently: true,
  });
  ctx.canvas.width = 1;
  ctx.canvas.height = 1;

  /** Malt vordergrund ueber hintergrund und gibt die tatsaechliche Farbe zurueck. */
  function aufgemalt(vordergrund, hintergrund) {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = hintergrund;
    ctx.fillRect(0, 0, 1, 1);
    ctx.fillStyle = vordergrund;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  }

  function leuchtkraft(c) {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  }

  function kontrast(a, b) {
    const la = leuchtkraft(a);
    const lb = leuchtkraft(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }

  function istOpak(el) {
    const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
    return m && (m.length < 4 || +m[3] > 0.5);
  }

  /** Die naechste wirklich deckende Flaeche ueber diesem Element. */
  function hintergrundVon(el) {
    let n = el;
    while (n && n !== document.documentElement) {
      if (istOpak(n)) return getComputedStyle(n).backgroundColor;
      n = n.parentElement;
    }
    return "#0a0a0a";
  }

  function nurFuerVorlesehilfe(r, st) {
    if (r.width <= 4 || r.height <= 4) return true;
    return /inset\(50%|rect\(0/.test(st.clipPath + " " + st.clip);
  }

  const unterNorm = [];
  let geprueft = 0;
  let uebersprungen = 0;

  document.querySelectorAll("body *").forEach((el) => {
    const hatEigenenText = [...el.childNodes].some(
      (k) => k.nodeType === 3 && k.textContent.trim()
    );
    if (!hatEigenenText) return;

    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;

    const st = getComputedStyle(el);
    if (st.visibility === "hidden" || st.opacity === "0") return;

    if (nurFuerVorlesehilfe(r, st)) {
      uebersprungen++;
      return;
    }
    geprueft++;

    const grundFarbe = hintergrundVon(el);
    const grund = aufgemalt(grundFarbe, "#0a0a0a");
    const schrift = aufgemalt(st.color, grundFarbe);
    const k = kontrast(schrift, grund);

    const px = parseFloat(st.fontSize);
    const gross = px >= 24 || (px >= 18.66 && parseInt(st.fontWeight) >= 700);
    const ziel = gross ? 3 : 4.5;

    if (k < ziel) {
      unterNorm.push({
        text: el.textContent.trim().slice(0, 45),
        farbe: st.color,
        grund: grundFarbe,
        kontrast: +k.toFixed(2),
        ziel,
        groesse: px,
      });
    }
  });

  return { geprueft, uebersprungen, unterNorm };
})();
