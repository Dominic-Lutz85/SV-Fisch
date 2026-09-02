import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/*
 * Symbol für den Startbildschirm auf Apple-Geräten.
 *
 * Hier stand vorher ein grosses "F" in Georgia auf einem gelben Kreis. Das war
 * weder das Vereinszeichen noch die Vereinsschrift, sondern ein Platzhalter.
 *
 * Jetzt wird dieselbe Datei benutzt, aus der auch das Tab-Symbol entsteht
 * (app/icon.svg, das echte vereinfachte Vereinswappen). Dadurch koennen die
 * beiden nicht auseinanderlaufen: wer das Wappen austauscht, tauscht es an
 * einer Stelle aus.
 *
 * Die SVG-Datei wird als Datenadresse eingebettet, weil der Bildgenerator zur
 * Laufzeit keine Dateien vom Server nachladen kann.
 */

export default function AppleIcon() {
  const svg = fs.readFileSync(
    path.join(process.cwd(), "app", "icon.svg"),
    "utf-8"
  );
  const datenadresse =
    "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F3DA0B",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={datenadresse} alt="" width={180} height={180} />
      </div>
    ),
    { ...size }
  );
}
