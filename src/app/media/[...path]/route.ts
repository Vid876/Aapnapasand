import { NextRequest, NextResponse } from "next/server";

const DESKTOP_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150.0 Safari/537.36";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filename = path.join("/");
  if (!filename || filename.includes("..")) {
    return NextResponse.json({ error: "Invalid media path" }, { status: 400 });
  }

  const upstreamUrl = new URL(`/uploads/${filename}`, request.url);
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
}
