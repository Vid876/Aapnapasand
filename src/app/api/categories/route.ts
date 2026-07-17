import { NextResponse } from "next/server";
import { getPublicCategories } from "@/lib/category-data";
import { noStoreJson } from "@/lib/api-response";

export async function GET() {
  try {
    const categories = await getPublicCategories();
    return noStoreJson({ categories });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
