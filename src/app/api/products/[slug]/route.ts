import { NextRequest, NextResponse } from "next/server";
import { noStoreJson } from "@/lib/api-response";
import { connectDB } from "@/lib/db";
import { PRODUCT_IMAGE_FILTER } from "@/lib/image-utils";
import { toPublicProductRating } from "@/lib/public-rating";
import "@/models/Category";
import { Product } from "@/models/Product";
import { Review } from "@/models/Review";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const product = await Product.findOne({
      slug,
      isActive: true,
      ...PRODUCT_IMAGE_FILTER,
    })
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const [reviews, relatedProducts] = await Promise.all([
      Review.find({
        product: product._id,
        isApproved: true,
        rating: { $gte: 3, $lte: 5 },
      })
        .sort({ createdAt: -1 })
        .lean(),
      Product.find({
        category: product.category,
        _id: { $ne: product._id },
        isActive: true,
        ...PRODUCT_IMAGE_FILTER,
      })
        .sort({ reviewCount: -1, rating: -1, createdAt: -1 })
        .limit(12)
        .lean(),
    ]);

    return noStoreJson({
      product: toPublicProductRating(product, reviews),
      reviews,
      relatedProducts: relatedProducts.map((item) =>
        toPublicProductRating(item)
      ),
    });
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
