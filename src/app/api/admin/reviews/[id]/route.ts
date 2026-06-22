import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Review } from "@/models/Review";
import { Product } from "@/models/Product";
import { requireAdmin } from "@/lib/admin";
import { z } from "zod";

const updateSchema = z.object({
  isApproved: z.boolean(),
});

async function updateProductRating(productId: string) {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId), isApproved: true } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateSchema.parse(body);

    await connectDB();
    const review = await Review.findByIdAndUpdate(id, data, { new: true });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await updateProductRating(review.product.toString());

    return NextResponse.json({ review });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Review update error:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    await connectDB();

    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await updateProductRating(review.product.toString());

    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Review delete error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
