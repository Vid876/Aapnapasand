import { NextRequest, NextResponse } from "next/server";
import { noStoreJson } from "@/lib/api-response";
import { connectDB } from "@/lib/db";
import { PRODUCT_IMAGE_FILTER } from "@/lib/image-utils";
import "@/models/Category";
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

    const [
      reviews,
      relatedProducts,
      categoryReviewProduct,
      globalReviewProduct,
    ] = await Promise.all([
      Review.find({
        product: product._id,
        isApproved: true,
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Product.find({
        category: product.category,
        _id: { $ne: product._id },
        isActive: true,
        ...PRODUCT_IMAGE_FILTER,
      })
        .limit(4)
        .lean(),
      Product.findOne({
        _id: { $ne: product._id },
        category: product.category,
        isActive: true,
        "sourceReviews.0": { $exists: true },
      })
        .select("name slug sourceReviews reviewCount")
        .sort({ reviewCount: -1, createdAt: -1 })
        .lean(),
      Product.findOne({
        _id: { $ne: product._id },
        isActive: true,
        "sourceReviews.0": { $exists: true },
      })
        .select("name slug sourceReviews reviewCount")
        .sort({ reviewCount: -1, createdAt: -1 })
        .lean(),
    ]);

    const fallbackReviewProduct =
      categoryReviewProduct || globalReviewProduct;
    const shopReviews = fallbackReviewProduct
      ? (fallbackReviewProduct.sourceReviews || []).slice(0, 3).map((review) => ({
          ...review,
          productName: fallbackReviewProduct.name,
          productSlug: fallbackReviewProduct.slug,
        }))
      : [];

    return noStoreJson({
      product,
      reviews,
      relatedProducts,
      shopReviews,
    });
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
