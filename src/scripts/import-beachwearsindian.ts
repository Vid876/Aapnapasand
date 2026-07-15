import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import catalog from "../data/beachwearsindian-products.json";
import { connectDB } from "../lib/db";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { slugify } from "../lib/utils";

type Gender = "men" | "women" | "kids" | "unisex";

type CatalogEntry = {
  sourceId: string;
  sourceUrl: string;
  title: string;
  image: string;
  price: number;
  compareAtPrice: number;
  category: string;
  categoryName: string;
  gender: Gender;
};

const PRODUCTS = catalog as CatalogEntry[];
const SOURCE_SHOP = "https://www.etsy.com/shop/Beachwearsindian";
const DOWNLOAD_CONCURRENCY = 6;
const BULK_WRITE_SIZE = 100;

const CATEGORY_META: Record<
  string,
  { name: string; description: string; gender: Gender }
> = {
  sarongs: {
    name: "Sarongs",
    description: "Hand block printed cotton sarongs and versatile beach wraps.",
    gender: "women",
  },
  bandanas: {
    name: "Bandanas",
    description: "Handcrafted cotton bandanas for hair, neck, travel, and everyday styling.",
    gender: "unisex",
  },
  kaftans: {
    name: "Kaftans",
    description: "Relaxed cotton kaftans for resort, beach, lounge, and vacation wear.",
    gender: "women",
  },
  napkins: {
    name: "Napkins",
    description: "Reusable cotton table napkins with artisan prints.",
    gender: "unisex",
  },
  "tote-bags": {
    name: "Tote Bags",
    description: "Handmade cotton tote bags for shopping, travel, and everyday use.",
    gender: "unisex",
  },
  "bandana-sets": {
    name: "Bandana Sets",
    description: "Coordinated sets of hand block printed cotton bandanas.",
    gender: "unisex",
  },
  "quilted-jackets": {
    name: "Quilted Jackets",
    description: "Artisan quilted jackets and layering vests for women.",
    gender: "women",
  },
  tablecloths: {
    name: "Tablecloths",
    description: "Cotton tablecloths for dining, celebrations, and relaxed hosting.",
    gender: "unisex",
  },
  "duvet-covers": {
    name: "Duvet Covers",
    description: "Handcrafted duvet covers for comfortable, layered bedrooms.",
    gender: "unisex",
  },
  "wrinkle-duvet-covers": {
    name: "Wrinkle Duvet Covers",
    description: "Soft textured cotton duvet covers for modern bedrooms.",
    gender: "unisex",
  },
  "canvas-bags": {
    name: "Canvas Bags",
    description: "Reusable printed canvas bags for markets, travel, and daily carry.",
    gender: "unisex",
  },
  quilts: {
    name: "Quilts",
    description: "Cotton quilts and throws with handcrafted textile character.",
    gender: "unisex",
  },
  "custom-listings": {
    name: "Custom Listings",
    description: "Custom textile orders prepared for individual buyer requirements.",
    gender: "unisex",
  },
  "linen-bedding-sets": {
    name: "Linen Bedding Sets",
    description: "Breathable linen bedding sets with soft, relaxed finishes.",
    gender: "unisex",
  },
  "duffel-bags": {
    name: "Duffel Bags",
    description: "Handcrafted textile duffel bags for travel and everyday storage.",
    gender: "unisex",
  },
  "linen-curtains": {
    name: "Linen Curtains",
    description: "Relaxed linen curtain panels for bedrooms and living spaces.",
    gender: "unisex",
  },
};

const SIZE_MAP: Record<string, string[]> = {
  sarongs: ["One Size"],
  bandanas: ["One Size"],
  kaftans: ["S", "M", "L", "XL"],
  napkins: ["Set"],
  "tote-bags": ["One Size"],
  "bandana-sets": ["Set"],
  "quilted-jackets": ["S", "M", "L", "XL"],
  tablecloths: ["4 Seater", "6 Seater", "8 Seater"],
  "duvet-covers": ["Twin", "Queen", "King"],
  "wrinkle-duvet-covers": ["Twin", "Queen", "King"],
  "canvas-bags": ["One Size"],
  quilts: ["Queen", "King"],
  "custom-listings": ["Custom"],
  "linen-bedding-sets": ["Twin", "Queen", "King"],
  "duffel-bags": ["One Size"],
  "linen-curtains": ["Single Panel", "Pair", "Custom"],
};

function cleanName(value: string) {
  const repaired = value
    .replace(/â€“/g, "–")
    .replace(/â€”/g, "—")
    .replace(/â€™/g, "’")
    .replace(/â€œ/g, "“")
    .replace(/â€/g, "”")
    .replace(/Â/g, "")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  const shortened =
    repaired.length > 150 ? repaired.slice(0, 147).trimEnd() + "..." : repaired;

  return shortened.replace(/[|,;\s]+$/g, "");
}

function normalizeEtsyImageUrl(value: string) {
  return value
    .replace(/\/c\/(?:[^/]+\/){4}il\//, "/r/il/")
    .replace(/il_(?:340x270|600x600)\./, "il_794xN.");
}

function buildVariants(category: string, sourceId: string) {
  return (SIZE_MAP[category] || ["One Size"]).map((size, index) => ({
    size,
    color: "As Shown",
    sku: "ETSY-" + sourceId + "-" + slugify(size).toUpperCase(),
    stock: 10 + index * 2,
  }));
}

function buildDescription(name: string) {
  return (
    name +
    ". Handcrafted in India with an artisan-led textile process. Suitable for retail, gifting, travel, resort, home, and wholesale requirements according to the product type."
  );
}

async function downloadImage(entry: CatalogEntry) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const filename = "etsy-" + entry.sourceId + ".jpg";
  const absolutePath = path.join(uploadsDir, filename);
  const publicPath = "/uploads/" + filename;

  await fs.mkdir(uploadsDir, { recursive: true });

  try {
    const stats = await fs.stat(absolutePath);
    if (stats.size > 1_000) return publicPath;
  } catch {
    // Download missing image below.
  }

  const imageUrl = normalizeEtsyImageUrl(entry.image);
  const candidates = [
    imageUrl,
    imageUrl.replace("il_794xN.", "il_600x600."),
  ];

  let lastError = "Unknown image download error";

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; BohoblockprintedCatalogImporter/2.0)",
        },
      });

      if (!response.ok) {
        lastError = "HTTP " + response.status;
        continue;
      }

      const contentType = response.headers.get("content-type") || "";
      const bytes = new Uint8Array(await response.arrayBuffer());

      if (!contentType.startsWith("image/") || bytes.length < 1_000) {
        lastError = "Invalid image response";
        continue;
      }

      await fs.writeFile(absolutePath, bytes);
      return publicPath;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }

  throw new Error(lastError);
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>
) {
  const results = new Array<R>(items.length);
  let cursor = 0;

  async function runWorker() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(concurrency, items.length) },
      () => runWorker()
    )
  );

  return results;
}

async function run() {
  console.log("Catalog products: " + PRODUCTS.length);
  await connectDB();

  const imageFailures: string[] = [];
  let completedImages = 0;

  const downloaded = await mapWithConcurrency(
    PRODUCTS,
    DOWNLOAD_CONCURRENCY,
    async (entry) => {
      try {
        const localImage = await downloadImage(entry);
        completedImages += 1;
        if (completedImages % 50 === 0 || completedImages === PRODUCTS.length) {
          console.log(
            "Images ready: " + completedImages + "/" + PRODUCTS.length
          );
        }
        return { entry, localImage };
      } catch (error) {
        completedImages += 1;
        const message = error instanceof Error ? error.message : String(error);
        imageFailures.push(entry.sourceId + ": " + message);
        return { entry, localImage: null };
      }
    }
  );

  const validDownloads = downloaded.filter(
    (
      item
    ): item is {
      entry: CatalogEntry;
      localImage: string;
    } => Boolean(item.localImage)
  );

  const categoryIds = new Map<string, mongoose.Types.ObjectId>();
  let createdCategories = 0;

  for (const categorySlug of [...new Set(validDownloads.map((x) => x.entry.category))]) {
    const firstProduct = validDownloads.find(
      (item) => item.entry.category === categorySlug
    );
    if (!firstProduct) continue;

    const meta = CATEGORY_META[categorySlug] || {
      name: firstProduct.entry.categoryName,
      description: "Handcrafted textiles and accessories from Jaipur, India.",
      gender: firstProduct.entry.gender,
    };

    let category = await Category.findOne({ slug: categorySlug });

    if (!category) {
      category = await Category.create({
        name: meta.name,
        slug: categorySlug,
        description: meta.description,
        image: firstProduct.localImage,
        gender: meta.gender,
        isActive: true,
      });
      createdCategories += 1;
    } else if (!category.image) {
      category.image = firstProduct.localImage;
      await category.save();
    }

    categoryIds.set(categorySlug, category._id);
  }

  let createdProducts = 0;
  let updatedProducts = 0;

  for (let start = 0; start < validDownloads.length; start += BULK_WRITE_SIZE) {
    const batch = validDownloads.slice(start, start + BULK_WRITE_SIZE);

    const operations = batch.map(({ entry, localImage }) => {
      const name = cleanName(entry.title);
      const description = buildDescription(name);
      const sourceTag = "etsy:" + entry.sourceId;
      const slug =
        "etsy-" +
        entry.sourceId +
        "-" +
        slugify(name).slice(0, 80);
      const variants = buildVariants(entry.category, entry.sourceId);
      const totalStock = variants.reduce(
        (sum, variant) => sum + variant.stock,
        0
      );
      const categoryId = categoryIds.get(entry.category);

      if (!categoryId) {
        throw new Error("Missing category for " + entry.sourceId);
      }

      return {
        updateOne: {
          filter: {
            $or: [{ tags: sourceTag }, { slug }],
          },
          update: {
            $set: {
              name,
              description,
              images: [localImage],
              category: categoryId,
              isActive: true,
            },
            $setOnInsert: {
              slug,
              shortDescription:
                CATEGORY_META[entry.category]?.description ||
                "Handcrafted Indian textile product.",
              price: entry.price,
              compareAtPrice:
                entry.compareAtPrice > entry.price
                  ? entry.compareAtPrice
                  : undefined,
              currency: "INR" as const,
              gender: entry.gender,
              brand: "BOHOBLOCKPRINTED",
              specifications: [
                "Handcrafted in India",
                "Artisan textile product",
                "Colors may vary slightly due to screen settings",
                "Care instructions depend on the selected product",
              ],
              tags: [
                entry.category,
                entry.gender,
                "handmade",
                "block-print",
                "Beachwearsindian",
                sourceTag,
                "source:" + SOURCE_SHOP,
              ],
              variants,
              totalStock,
              rating: 0,
              reviewCount: 0,
              isFeatured: false,
            },
          },
          upsert: true,
        },
      };
    });

    const result = await Product.bulkWrite(operations, { ordered: false });
    createdProducts += result.upsertedCount;
    updatedProducts += result.modifiedCount;

    console.log(
      "Database products processed: " +
        Math.min(start + batch.length, validDownloads.length) +
        "/" +
        validDownloads.length
    );
  }

  const importedProducts = await Product.countDocuments({
    tags: { $regex: "^etsy:" },
  });

  console.log("\nImport complete");
  console.log("Categories created: " + createdCategories);
  console.log("Products created: " + createdProducts);
  console.log("Products updated: " + updatedProducts);
  console.log("Imported Etsy products in database: " + importedProducts);
  console.log("Image failures: " + imageFailures.length);

  if (imageFailures.length > 0) {
    console.log(imageFailures.join("\n"));
    process.exitCode = 1;
  }

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error("Import failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
