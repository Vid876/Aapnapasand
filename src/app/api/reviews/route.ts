import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { Review } from "@/models/Review";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const productIdSchema = z
  .string()
  .regex(/^[0-9a-f]{24}$/i, "Invalid product");

const reviewSchema = z.object({
  productId: productIdSchema,
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});

function purchasedProductFilter(userId: string, productId: string) {
  return {
    user: userId,
    "items.product": productId,
    $or: [
      { status: "delivered" },
      {
        paymentStatus: "paid",
        status: { $nin: ["cancelled", "returned"] },
      },
    ],
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { canReview: false, reason: "login_required" },
        { status: 401 }
      );
    }

    const productIdResult = productIdSchema.safeParse(
      request.nextUrl.searchParams.get("productId")
    );
    if (!productIdResult.success) {
      return NextResponse.json(
        { canReview: false, error: "Invalid product" },
        { status: 400 }
      );
    }

    await connectDB();
    const [purchase, existingReview] = await Promise.all([
      Order.exists(
        purchasedProductFilter(session.user.id, productIdResult.data)
      ),
      Review.exists({
        product: productIdResult.data,
        user: session.user.id,
      }),
    ]);

    return NextResponse.json({
      canReview: Boolean(purchase) && !existingReview,
      hasPurchased: Boolean(purchase),
      alreadyReviewed: Boolean(existingReview),
    });
  } catch (error) {
    console.error("Review eligibility error:", error);
    return NextResponse.json(
      { canReview: false, error: "Unable to check review eligibility" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please login to leave a review" }, { status: 401 });
    }

    const body = await request.json();
    const data = reviewSchema.parse(body);

    await connectDB();

    const [product, purchase, existing] = await Promise.all([
      Product.findById(data.productId).select("_id"),
      Order.exists(purchasedProductFilter(session.user.id, data.productId)),
      Review.exists({
        product: data.productId,
        user: session.user.id,
      }),
    ]);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!purchase) {
      return NextResponse.json(
        { error: "Only verified purchasers can review this product" },
        { status: 403 }
      );
    }

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
