import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            borderTop: "16px solid #F3DA0B",
            borderBottom: "16px solid #F3DA0B",
          }}
        />
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "#F3DA0B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: 140,
            color: "#0A0A0A",
            marginBottom: 32,
          }}
        >
          F
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            color: "#F6F6F6",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#F3DA0B",
            fontFamily: "Arial, sans-serif",
            marginTop: 12,
          }}
        >
          Fußball &amp; Gymnastik seit {siteConfig.founded}
        </div>
      </div>
    ),
    { ...size }
  );
}
