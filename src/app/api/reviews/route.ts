import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { Review } from "@/models/Review";
import { Product } from "@/models/Product";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please login to leave a review" }, { status: 401 });
    }

    const body = await request.json();
    const data = reviewSchema.parse(body);

    await connectDB();

    const product = await Product.findById(data.productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existing = await Review.findOne({
      product: data.productId,
      user: session.user.id,
    });

    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 });
    }

    await Review.create({
      product: data.productId,
      user: session.user.id,
      userName: session.user.name || "Customer",
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      isApproved: false,
    });

    return NextResponse.json(
      { message: "Review submitted! It will appear after approval." },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Review submit error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
