import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  const cssDirectory = path.join(process.cwd(), ".next", "static", "css");
  const cssFiles = (await readdir(cssDirectory)).filter((file) => file.endsWith(".css"));
  const stylesheets = await Promise.all(
    cssFiles.map((file) => readFile(path.join(cssDirectory, file), "utf8"))
  );

  return new Response(stylesheets.join("\n"), {
    headers: {
      "Content-Type": "text/css; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
