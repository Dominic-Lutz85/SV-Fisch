// Einmal-Skript: erzeugt eine einzelne Platzhalter-Bilddatei für die neue
// Darts-Abteilungsseite. Bewusst als eigenständiges Skript, damit es NICHT
// versehentlich bereits ersetzte Fotos aus scripts/generate-placeholders.mjs
// erneut überschreibt.
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const YELLOW = [0xf3, 0xda, 0x0b];
const BLACK = [0x0a, 0x0a, 0x0a];

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
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
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
  ihdrData[8] = 8;
  ihdrData[9] = 2;
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 3 + 1);
    raw[rowStart] = 0;
    rgbBuffer.copy(raw, rowStart + 1, y * width * 3, (y + 1) * width * 3);
  }
  const idatData = deflateSync(raw, { level: 9 });
  return Buffer.concat([signature, chunk("IHDR", ihdrData), chunk("IDAT", idatData), chunk("IEND", Buffer.alloc(0))]);
}

function photoPlaceholder(width, height) {
  const buf = Buffer.alloc(width * height * 3);
  const cx = width / 2;
  const cy = height * 0.42;
  const ringR = Math.min(width, height) * 0.16;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const stripe = (x + y) % 46 < 5;
      let color = stripe ? mix(BLACK, YELLOW, 0.14) : BLACK;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (Math.abs(dist - ringR) < 3) color = mix(color, YELLOW, 0.65);
      const i = (y * width + x) * 3;
      buf[i] = color[0];
      buf[i + 1] = color[1];
      buf[i + 2] = color[2];
    }
  }
  return buf;
}

const outPath = process.cwd() + "/public/darts/uebersicht.png";
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, encodePng(1200, 900, photoPlaceholder(1200, 900)));
console.log("geschrieben:", outPath);
