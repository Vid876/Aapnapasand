import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase().split(":")[0];

  if (request.nextUrl.pathname === "/_next/static/css/86c2f2a3ff93beaa.css") {
    const url = request.nextUrl.clone();
    url.pathname = "/compat.css";
    return NextResponse.rewrite(url);
  }

  if (host === "bohoblockprinted.com") {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    url.hostname = "www.bohoblockprinted.com";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/_next/static/css/86c2f2a3ff93beaa.css",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
