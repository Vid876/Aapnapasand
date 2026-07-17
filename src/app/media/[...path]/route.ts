import https from "node:https";
import { readFile } from "node:fs/promises";
import nodePath from "node:path";
import { NextRequest, NextResponse } from "next/server";

const DESKTOP_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150.0 Safari/537.36";

function readFromCdn(filename: string): Promise<{ body: Buffer; contentType: string } | null> {
  return new Promise((resolve) => {
    const request = https.request(
      {
        hostname: "88.222.243.190",
        port: 443,
        path: `/uploads/${filename}`,
        servername: "www.bohoblockprinted.com",
        headers: {
          Host: "www.bohoblockprinted.com",
          Accept: "*/*",
          "User-Agent": DESKTOP_USER_AGENT,
        },
        timeout: 8000,
        rejectUnauthorized: false,
      },
      (response) => {
        if (response.statusCode !== 200) {
          response.resume();
          resolve(null);
          return;
        }
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () =>
          resolve({
            body: Buffer.concat(chunks),
            contentType: response.headers["content-type"] || "application/octet-stream",
          })
        );
      }
    );
    request.on("error", () => resolve(null));
    request.on("timeout", () => {
      request.destroy();
      resolve(null);
    });
    request.end();
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const filename = pathSegments.join("/");
  if (!filename || filename.includes("..")) {
    return NextResponse.json({ error: "Invalid media path" }, { status: 400 });
  }

  // Uploaded files live alongside the deployed Next app. Reading them directly
  // avoids the mobile-UA 404 returned by the hosting layer for /uploads URLs.
  const uploadsRoot = nodePath.resolve(process.cwd(), "public", "uploads");
  const filePath = nodePath.resolve(uploadsRoot, filename);
  if (filePath.startsWith(`${uploadsRoot}${nodePath.sep}`)) {
    try {
      const body = await readFile(filePath);
      const extension = nodePath.extname(filePath).toLowerCase();
      const contentType =
        extension === ".png"
          ? "image/png"
          : extension === ".webp"
            ? "image/webp"
            : extension === ".avif"
              ? "image/avif"
              : "image/jpeg";
      return new NextResponse(body, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // Fall back to the public URL for deployments that mount uploads elsewhere.
    }
  }

  try {
    const upstream = await readFromCdn(filename);
    if (upstream) {
      return new NextResponse(new Uint8Array(upstream.body), {
        headers: {
          "Content-Type": upstream.contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Media unavailable" }, { status: 502 });
  }
}
