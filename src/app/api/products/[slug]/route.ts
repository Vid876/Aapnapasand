import { NextRequest, NextResponse } from "next/server";
import { publicJson } from "@/lib/api-response";
import { connectDB } from "@/lib/db";
import { PRODUCT_IMAGE_FILTER } from "@/lib/image-utils";
import { Product } from "@/models/Product";
import { Review } from "@/models/Review";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const product = await Product.findOne({ slug, isActive: true, ...PRODUCT_IMAGE_FILTER })
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const reviews = await Review.find({
      product: product._id,
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
      ...PRODUCT_IMAGE_FILTER,
    })
      .limit(4)
      .lean();

    return publicJson({ product, reviews, relatedProducts }, 120);
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
