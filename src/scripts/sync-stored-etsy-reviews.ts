import "dotenv/config";
import mongoose from "mongoose";
import productDetails from "../data/beachwearsindian-product-details.json";
import { connectDB } from "../lib/db";
import { Product } from "../models/Product";

type StoredReview = {
  sourceReviewId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: string;
};

type StoredProductDetail = {
  sourceId: string;
  reviews?: StoredReview[];
};

const LIGHT_GREY_CURTAIN_ID = "4512109999";
const SAGE_CURTAIN_IMAGE =
  "https://i.etsystatic.com/60711515/r/il/8a50d9/8076948843/il_794xN.8076948843_1g7x.jpg";

async function run() {
  await connectDB();
  const details = productDetails as StoredProductDetail[];
  const operations = details.map((detail) => {
    const reviews = (detail.reviews || [])
      .filter(
        (review) =>
          review.rating >= 3 &&
          review.rating <= 5 &&
          Boolean(review.comment?.trim())
      )
      .map((review) => ({
        ...review,
        createdAt: review.createdAt ? new Date(review.createdAt) : undefined,
      }));
    const rating = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    return {
      updateOne: {
        filter: { sourceId: String(detail.sourceId) },
        update: {
          $set: {
            sourceReviews: reviews,
            rating: Math.round(rating * 10) / 10,
            reviewCount: reviews.length,
          },
        },
      },
    };
  });

  for (let index = 0; index < operations.length; index += 100) {
    await Product.bulkWrite(operations.slice(index, index + 100), {
      ordered: false,
    });
  }

  await Product.updateOne(
    { sourceId: LIGHT_GREY_CURTAIN_ID },
    { $pull: { images: SAGE_CURTAIN_IMAGE } }
  );

  const [withReviews, totals] = await Promise.all([
    Product.countDocuments({ "sourceReviews.0": { $exists: true } }),
    Product.aggregate([
      {
        $project: {
          count: { $size: { $ifNull: ["$sourceReviews", []] } },
        },
      },
      { $group: { _id: null, count: { $sum: "$count" } } },
    ]),
  ]);

  console.log(
    `Stored Etsy review sync complete: ${totals[0]?.count || 0} reviews across ${withReviews} products.`
  );
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error("Stored Etsy review sync failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
