import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Die Seite ist unter zwei Adressen erreichbar (sv-fisch.com und
   * www.sv-fisch.com). Ohne Weiterleitung wertet Google das als zwei
   * getrennte Seiten mit dem gleichen Inhalt und sucht sich selbst eine
   * aus. Deshalb ist sv-fisch.com die eine gueltige Adresse, www wird
   * dauerhaft (308, von Google wie 301 behandelt) dorthin geschickt.
   *
   * Muss beim Umzug auf eine andere Domain hier UND in lib/config.ts
   * angepasst werden.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sv-fisch.com" }],
        destination: "https://sv-fisch.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
