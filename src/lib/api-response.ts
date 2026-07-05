import { NextResponse } from "next/server";

export function publicJson<T>(data: T, maxAge = 60) {
  const response = NextResponse.json(data);
  response.headers.set(
    "Cache-Control",
    `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 5}`
  );
  return response;
}

export function noStoreJson<T>(data: T, init?: ResponseInit) {
  const response = NextResponse.json(data, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
