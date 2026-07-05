import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const port = process.env.PORT || "3000";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

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

  process.exit(code ?? 0);
});
