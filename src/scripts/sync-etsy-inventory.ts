import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import { Product } from "../models/Product";

type EtsyMoney = {
  amount: number;
  divisor: number;
  currency_code: string;
};

type EtsyPropertyValue = {
  property_name?: string;
  values?: string[];
};

type EtsyInventoryProduct = {
  product_id: number;
  sku?: string;
  is_deleted?: boolean;
  property_values?: EtsyPropertyValue[];
  offerings?: Array<{
    quantity: number;
    is_enabled: boolean;
    price?: EtsyMoney;
  }>;
};

type EtsyInventoryResponse = {
  products?: EtsyInventoryProduct[];
};

const apiKey = process.env.ETSY_API_KEY;
const accessToken = process.env.ETSY_ACCESS_TOKEN;

function getProperty(product: EtsyInventoryProduct, names: string[]) {
  const property = product.property_values?.find((item) => {
    const name = item.property_name?.toLowerCase() || "";
    return names.some((candidate) => name.includes(candidate));
  });
  return property?.values?.filter(Boolean).join(" / ");
}

function getPrice(money?: EtsyMoney) {
  if (!money || !money.divisor) return undefined;
  return money.amount / money.divisor;
}

async function getInventory(listingId: string) {
  const headers: Record<string, string> = { "x-api-key": apiKey || "" };
  if (accessToken) headers.authorization = `Bearer ${accessToken}`;
  const response = await fetch(
    `https://api.etsy.com/v3/application/listings/${listingId}/inventory`,
    { headers }
  );
  if (!response.ok) {
    throw new Error(`Etsy inventory ${listingId} failed with ${response.status}`);
  }
  return (await response.json()) as EtsyInventoryResponse;
}

async function run() {
  if (!apiKey) {
    throw new Error(
      "ETSY_API_KEY is required in keystring:shared_secret format. ETSY_ACCESS_TOKEN is optional for endpoints your Etsy app can read without OAuth."
    );
  }

  await connectDB();
  const products = await Product.find({ sourceId: { $exists: true, $ne: "" } });
  let synced = 0;
  let failed = 0;

  for (const product of products) {
    try {
      const inventory = await getInventory(product.sourceId || "");
      const variants = (inventory.products || [])
        .filter((item) => !item.is_deleted)
        .map((item) => {
          const offering =
            item.offerings?.find((value) => value.is_enabled) || item.offerings?.[0];
          return {
            size: getProperty(item, ["size", "dimensions"]) || "One Size",
            fabric: getProperty(item, ["fabric", "material"]),
            color:
              getProperty(item, ["primary color", "colour", "color"]) ||
              "As Shown",
            sku: item.sku || `ETSY-${product.sourceId}-${item.product_id}`,
            stock: Math.max(0, offering?.quantity || 0),
            price: getPrice(offering?.price),
            sourceProductId: String(item.product_id),
            isAvailable: Boolean(offering?.is_enabled && (offering.quantity || 0) > 0),
          };
        });

      if (variants.length) {
        product.variants = variants;
        product.totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);
      }
      product.sourceSyncedAt = new Date();
      product.sourceSyncStatus = "api-synced";
      await product.save();
      synced += 1;
    } catch (error) {
      failed += 1;
      await Product.updateOne(
        { _id: product._id },
        { sourceSyncedAt: new Date(), sourceSyncStatus: "sync-error" }
      );
      console.error(error);
    }
  }

  console.log(`Etsy inventory sync complete: ${synced} synced, ${failed} failed.`);
  await mongoose.disconnect();
  if (failed) process.exitCode = 1;
}

run().catch(async (error) => {
  console.error("Etsy inventory sync failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
