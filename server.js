/**
 * Eigenständiger Node-Server für Hostinger (Passenger-basiertes "Node.js App"-
 * Hosting). Wird NUR dort gebraucht – auf Vercel läuft die Seite serverlos
 * und ignoriert diese Datei komplett.
 *
 * Hostinger/Passenger erwartet eine konkrete Startdatei, die einen HTTP-
 * Server auf process.env.PORT startet; "next start" allein reicht dafür
 * nicht, da Passenger keinen eigenen npm-Befehl ausführt.
 */
const { createServer } = require("node:http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`> SV Fisch Website läuft auf Port ${port}`);
  });
});
