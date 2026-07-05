const { spawn } = require("node:child_process");
const path = require("node:path");

const port = process.env.PORT || "3000";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const nextBin = path.join(__dirname, "node_modules", "next", "dist", "bin", "next");

const child = spawn(
  process.execPath,
  [nextBin, "start", "--hostname", hostname, "--port", port],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: port,
      HOSTNAME: hostname,
    },
  }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code || 0);
});
