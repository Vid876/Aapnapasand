import { readFile } from "node:fs/promises";
import nodePath from "node:path";
import { NextRequest, NextResponse } from "next/server";

const DESKTOP_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150.0 Safari/537.36";

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
    const upstreamUrl = new URL(`/uploads/${filename}`, "https://www.bohoblockprinted.com");
    const upstream = await fetch(upstreamUrl, {
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "User-Agent": DESKTOP_USER_AGENT,
      },
      cache: "no-store",
    });
    if (!upstream.ok) {
      return NextResponse.json({ error: "Media not found" }, { status: upstream.status });
    }
    const headers = new Headers();
    headers.set("Content-Type", upstream.headers.get("content-type") || "application/octet-stream");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return new NextResponse(await upstream.arrayBuffer(), { headers });
  } catch {
    return NextResponse.json({ error: "Media unavailable" }, { status: 502 });
  }
}
