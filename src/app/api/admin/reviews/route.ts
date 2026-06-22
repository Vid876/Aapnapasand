import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review } from "@/models/Review";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const reviews = await Review.find()
      .populate("product", "name slug images")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Admin reviews fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
