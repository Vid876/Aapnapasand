import fs from "node:fs";
import path from "node:path";

function loadEnvFile(fileName: string) {
  const filePath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

async function main() {
  const { connectDB } = await import("../lib/db");
  const { Cart } = await import("../models/Cart");
  const { Category } = await import("../models/Category");
  const { Coupon } = await import("../models/Coupon");
  const { Order } = await import("../models/Order");
  const { Product } = await import("../models/Product");
  const { Review } = await import("../models/Review");
  const { User } = await import("../models/User");

  await connectDB();

  await Promise.all([
    Cart.createIndexes(),
    Category.createIndexes(),
    Coupon.createIndexes(),
    Order.createIndexes(),
    Product.createIndexes(),
    Review.createIndexes(),
    User.createIndexes(),
  ]);

  console.log("Database indexes created successfully.");
}

main()
  .catch((error) => {
    console.error("Failed to create indexes:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = await import("mongoose");
    await mongoose.default.disconnect();
  });
