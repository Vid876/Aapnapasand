import { unstable_cache } from "next/cache";
import { ensureDefaultCategories } from "@/lib/category-sync";
import { connectDB } from "@/lib/db";
import { CATEGORY_IMAGE_FILTER, PRODUCT_IMAGE_FILTER } from "@/lib/image-utils";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import type { Category as CategoryType } from "@/types";

type PublicCategory = Pick<CategoryType, "_id" | "name" | "slug" | "description" | "image" | "gender" | "isActive">;

async function fetchPublicCategories(): Promise<PublicCategory[]> {
  try {
    await connectDB();
    await ensureDefaultCategories();

    const categories = await Category.find({
      isActive: true,
    })
      .sort({ name: 1 })
      .lean();

    return JSON.parse(JSON.stringify(categories)) as PublicCategory[];
  } catch {
    return [];
  }
}

export const getPublicCategories = unstable_cache(fetchPublicCategories, ["public-categories"], {
  revalidate: 300,
  tags: ["categories"],
});

async function fetchHomepageCategories(): Promise<PublicCategory[]> {
  try {
    await connectDB();
    await ensureDefaultCategories();

    const categoryIds = await Product.distinct("category", {
      isActive: true,
      ...PRODUCT_IMAGE_FILTER,
    });

    const categories = await Category.find({
      _id: { $in: categoryIds },
      isActive: true,
      ...CATEGORY_IMAGE_FILTER,
    })
      .sort({ name: 1 })
      .lean();

    return JSON.parse(JSON.stringify(categories)) as PublicCategory[];
  } catch {
    return [];
  }
}

export const getHomepageCategories = unstable_cache(
  fetchHomepageCategories,
  ["homepage-categories-with-products"],
  {
    revalidate: 300,
    tags: ["categories", "products"],
  }
);
