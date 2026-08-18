import { connectDB } from "@/lib/db";
import { PRODUCT_IMAGE_FILTER } from "@/lib/image-utils";
import { toPublicProductRating } from "@/lib/public-rating";
import "@/models/Category";
import { Product } from "@/models/Product";
import { Review } from "@/models/Review";
import type { Product as ProductType, Review as ReviewType } from "@/types";

export type PublicProductPayload = {
  product: ProductType;
  reviews: ReviewType[];
  relatedProducts: ProductType[];
};

export async function getPublicProductPayload(slug: string): Promise<PublicProductPayload | null> {
  await connectDB();
  const product = await Product.findOne({ slug, isActive: true, ...PRODUCT_IMAGE_FILTER })
    .populate("category", "name slug description image imageAlt metaTitle metaDescription ogImage seoContent")
    .lean();
  if (!product) return null;

  const [reviews, relatedProducts] = await Promise.all([
    Review.find({ product: product._id, isApproved: true, rating: { $gte: 3, $lte: 5 } }).sort({ createdAt: -1 }).lean(),
    Product.find({ category: product.category, _id: { $ne: product._id }, isActive: true, ...PRODUCT_IMAGE_FILTER })
      .populate("category", "name slug")
      .sort({ reviewCount: -1, rating: -1, createdAt: -1 })
      .limit(12)
      .lean(),
  ]);

  return JSON.parse(JSON.stringify({
    product: toPublicProductRating(product, reviews),
    reviews,
    relatedProducts: relatedProducts.map((item) => toPublicProductRating(item)),
  })) as PublicProductPayload;
}
