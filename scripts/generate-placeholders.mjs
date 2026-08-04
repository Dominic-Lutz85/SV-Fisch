// Einmal-Skript: erzeugt echte, austauschbare Platzhalter-Bilddateien in /public.
// Kein externes Bild-Package nötig – reiner Node-PNG-Encoder (zlib ist Node-Bordmittel).
// Wenn echte Vereinsfotos vorliegen: Datei am selben Pfad einfach überschreiben.
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const YELLOW = [0xf3, 0xda, 0x0b];
const BLACK = [0x0a, 0x0a, 0x0a];
const WHITE = [0xf6, 0xf6, 0xf6];

function mix(a, b, t) {
  return a.map((c, i) => Math.round(c + (b[i] - c) * t));
}

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgbBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type RGB
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 3 + 1);
    raw[rowStart] = 0; // filter type none
    rgbBuffer.copy(raw, rowStart + 1, y * width * 3, (y + 1) * width * 3);
  }
  const idatData = deflateSync(raw, { level: 9 });

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdrData),
    chunk("IDAT", idatData),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** Abstraktes Foto-Platzhalter-Muster in Vereinsfarben (diagonale Streifen + Ring). */
function photoPlaceholder(width, height) {
  const buf = Buffer.alloc(width * height * 3);
  const cx = width / 2;
  const cy = height * 0.42;
  const ringR = Math.min(width, height) * 0.16;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const stripe = ((x + y) % 46) < 5;
      let color = stripe ? mix(BLACK, YELLOW, 0.14) : BLACK;

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (Math.abs(dist - ringR) < 3) {
        color = mix(color, YELLOW, 0.65);
      }

      const i = (y * width + x) * 3;
      buf[i] = color[0];
      buf[i + 1] = color[1];
      buf[i + 2] = color[2];
    }
  }
  return buf;
}

/** Helleres Logo-Platzhalter-Muster (Karten-Look für Sponsorenwand). */
function logoPlaceholder(width, height) {
  const buf = Buffer.alloc(width * height * 3);
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) * 0.22;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let color = WHITE;
      const border = x < 4 || y < 4 || x > width - 5 || y > height - 5;
      if (border) color = BLACK;

      const dx = x - (cx - width * 0.14);
      const dy = y - cy;
      if (Math.sqrt(dx * dx + dy * dy) < r * 0.7) color = YELLOW;

      const sq = width * 0.1;
      const sx = cx + width * 0.06;
      const sy = cy - sq / 2;
      if (x > sx && x < sx + sq && y > sy && y < sy + sq) color = BLACK;

      const i = (y * width + x) * 3;
      buf[i] = color[0];
      buf[i + 1] = color[1];
      buf[i + 2] = color[2];
    }
  }
  return buf;
}

function write(path, width, height, kind) {
  const pixels = kind === "logo" ? logoPlaceholder(width, height) : photoPlaceholder(width, height);
  const png = encodePng(width, height, pixels);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, png);
  console.log("geschrieben:", path);
}

const root = process.cwd() + "/public";

// Hero
write(`${root}/hero/home-hero.png`, 1600, 900, "photo");

// News-Teaser
for (const slug of [
  "jahreshauptversammlung-2026",
  "heimsieg-gegen-am-weiher",
  "gymnastik-schnuppertag",
  "elfer-turnier-ankuendigung",
]) {
  write(`${root}/news/${slug}.png`, 1200, 800, "photo");
}

// Galerie
const alben = {
  "saison-2025-26": 4,
  vereinsfeste: 3,
  bambini: 2,
};
for (const [slug, count] of Object.entries(alben)) {
  for (let i = 1; i <= count; i++) {
    write(`${root}/gallery/${slug}/${i}.png`, 1200, 900, "photo");
  }
}

// Sponsoren-Logos
for (const slug of [
  "sparkasse",
  "it-wm",
  "hoellen",
  "getraenke-bauer",
  "autohaus-klein",
  "baeckerei-ofenfrisch",
  "metzgerei-wurstmann",
  "physio-am-sportplatz",
]) {
  write(`${root}/sponsoren/${slug}.png`, 400, 200, "logo");
}

console.log("Fertig.");
