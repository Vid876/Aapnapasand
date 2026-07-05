import { NextResponse } from "next/server";
import { getPublicCategories } from "@/lib/category-data";
import { publicJson } from "@/lib/api-response";

export async function GET() {
  try {
    const categories = await getPublicCategories();
    return publicJson({ categories }, 300);
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
