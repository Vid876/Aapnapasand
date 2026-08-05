import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";
import { CATEGORY_IMAGE_BY_SLUG } from "../lib/category-images";

loadEnvConfig(process.cwd());

async function syncCategoryImages() {
  const [{ connectDB }, { Category }] = await Promise.all([
    import("../lib/db"),
    import("../models/Category"),
  ]);
  await connectDB();

  const result = await Category.bulkWrite(
    Object.entries(CATEGORY_IMAGE_BY_SLUG).map(([slug, image]) => ({
      updateOne: {
        filter: { slug },
        update: { $set: { image } },
      },
    })),
    { ordered: false }
  );

  console.log(
    `Category images updated: ${result.modifiedCount}; matched: ${result.matchedCount}.`
  );
}

syncCategoryImages()
  .catch((error) => {
    console.error("Category image sync failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
