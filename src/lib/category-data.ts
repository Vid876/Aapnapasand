import { unstable_cache } from "next/cache";
import { ensureDefaultCategories } from "@/lib/category-sync";
import { connectDB } from "@/lib/db";
import { CATEGORY_IMAGE_FILTER, PRODUCT_IMAGE_FILTER } from "@/lib/image-utils";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import type { Category as CategoryType } from "@/types";
import { getCanonicalCategorySlug, MERGED_CATEGORY_SLUGS } from "@/lib/category-aliases";

type PublicCategory = Pick<CategoryType, "_id" | "name" | "slug" | "description" | "image" | "gender" | "isActive"> & {
  productCount: number;
};

async function fetchPublicCategories(): Promise<PublicCategory[]> {
  try {
    await connectDB();
    await ensureDefaultCategories();

    const [categories, productCounts] = await Promise.all([
      Category.find({ isActive: true }).sort({ name: 1 }).lean(),
      Product.aggregate<{ _id: unknown; count: number }>([
        { $match: { isActive: true } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
    ]);
    const countsByCategory = new Map(productCounts.map(({ _id, count }) => [String(_id), count]));
    const countsBySlug = new Map<string, number>();
    for (const category of categories) {
      const canonicalSlug = getCanonicalCategorySlug(category.slug);
      countsBySlug.set(
        canonicalSlug,
        (countsBySlug.get(canonicalSlug) ?? 0) + (countsByCategory.get(String(category._id)) ?? 0)
      );
    }

    const categoriesWithCounts = categories
      .filter((category) => !MERGED_CATEGORY_SLUGS.includes(category.slug as never))
      .map((category) => ({
        ...category,
        productCount: countsBySlug.get(category.slug) ?? countsByCategory.get(String(category._id)) ?? 0,
      }))
      .sort((a, b) => {
        const emptyCategoryOrder = Number(a.productCount === 0) - Number(b.productCount === 0);
        return emptyCategoryOrder || a.name.localeCompare(b.name);
      });

    return JSON.parse(JSON.stringify(categoriesWithCounts)) as PublicCategory[];
  } catch (error) {
    console.error("Public categories fetch error:", error);
    return [];
  }
}

export const getPublicCategories = unstable_cache(fetchPublicCategories, ["public-categories-v2"], {
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
      slug: { $nin: MERGED_CATEGORY_SLUGS },
      ...CATEGORY_IMAGE_FILTER,
    })
      .sort({ name: 1 })
      .lean();

    return JSON.parse(JSON.stringify(categories)) as PublicCategory[];
  } catch (error) {
    console.error("Homepage categories fetch error:", error);
    return [];
  }
}

export const getHomepageCategories = unstable_cache(
  fetchHomepageCategories,
  ["homepage-categories-with-products-v2"],
  {
    revalidate: 300,
    tags: ["categories", "products"],
  }
);
