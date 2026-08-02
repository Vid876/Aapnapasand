import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import { Product } from "../models/Product";

type EtsyReview = {
  transaction_id?: number;
  buyer_user_name?: string;
  rating: number;
  review?: string;
  create_timestamp?: number;
  created_timestamp?: number;
};

type EtsyReviewsResponse = {
  count: number;
  results: EtsyReview[];
};

const apiKey = process.env.ETSY_API_KEY;
const accessToken = process.env.ETSY_ACCESS_TOKEN;
const concurrency = Math.max(
  1,
  Math.min(Number(process.env.ETSY_SYNC_CONCURRENCY) || 3, 8)
);

async function fetchListingReviews(listingId: string) {
  const headers: Record<string, string> = { "x-api-key": apiKey || "" };
  if (accessToken) headers.authorization = `Bearer ${accessToken}`;

  const allReviews: EtsyReview[] = [];
  for (let offset = 0; ; offset += 100) {
    const response = await fetch(
      `https://api.etsy.com/v3/application/listings/${listingId}/reviews?limit=100&offset=${offset}`,
      { headers }
    );
    if (!response.ok) {
      throw new Error(`Etsy reviews ${listingId} failed with ${response.status}`);
    }
    const data = (await response.json()) as EtsyReviewsResponse;
    allReviews.push(...(data.results || []));
    if (!data.results?.length || allReviews.length >= data.count) break;
  }
  return allReviews;
}

async function runWorker(
  products: Array<{ _id: mongoose.Types.ObjectId; sourceId?: string }>,
  start: number,
  counters: { synced: number; failed: number; reviews: number }
) {
  for (let index = start; index < products.length; index += concurrency) {
    const product = products[index];
    const listingId = product.sourceId || "";
    try {
      const rawReviews = await fetchListingReviews(listingId);
      const reviews = rawReviews
        .filter(
          (review) =>
            review.rating >= 3 &&
            review.rating <= 5 &&
            Boolean(review.review?.trim())
        )
        .map((review, reviewIndex) => {
          const timestamp =
            review.created_timestamp || review.create_timestamp || 0;
          return {
            sourceReviewId: String(
              review.transaction_id || `${listingId}-${timestamp}-${reviewIndex}`
            ),
            userName: review.buyer_user_name?.trim() || "Etsy Customer",
            rating: review.rating,
            comment: review.review?.trim() || "",
            createdAt: timestamp ? new Date(timestamp * 1000) : undefined,
          };
        });
      const rating = reviews.length
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            sourceReviews: reviews,
            rating: Math.round(rating * 10) / 10,
            reviewCount: reviews.length,
            sourceSyncedAt: new Date(),
            sourceSyncStatus: "api-synced",
          },
        }
      );
      counters.synced += 1;
      counters.reviews += reviews.length;
    } catch (error) {
      counters.failed += 1;
      console.error(error);
    }
  }
}

async function run() {
  if (!apiKey) {
    throw new Error(
      "ETSY_API_KEY is required in keystring:shared_secret format to download every listing review."
    );
  }

  await connectDB();
  const products = await Product.find({ sourceId: { $exists: true, $ne: "" } })
    .select("_id sourceId")
    .lean();
  const counters = { synced: 0, failed: 0, reviews: 0 };
  await Promise.all(
    Array.from({ length: concurrency }, (_, worker) =>
      runWorker(products, worker, counters)
    )
  );

  console.log(
    `Etsy review sync complete: ${counters.reviews} eligible reviews across ${counters.synced} products; ${counters.failed} failed.`
  );
  await mongoose.disconnect();
  if (counters.failed) process.exitCode = 1;
}

run().catch(async (error) => {
  console.error("Etsy review sync failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
