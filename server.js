const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const next = require("next");

const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOST || process.env.NEXT_HOST || "0.0.0.0";
const buildIdPath = path.join(__dirname, ".next", "BUILD_ID");

if (!fs.existsSync(buildIdPath)) {
  console.error(
    ".next build not found. Run `npm install && npm run build` before starting the Hostinger app."
  );
  process.exit(1);
}

const app = next({
  dev: false,
  hostname,
  port,
});

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer((req, res) => {
        handle(req, res);
      })
      .listen(port, hostname, () => {
        console.log(`BOHOBLOCKPRINTED ready on http://${hostname}:${port}`);
      });
  })
  .catch((error) => {
    console.error("Failed to start BOHOBLOCKPRINTED:", error);
    process.exit(1);
  });
