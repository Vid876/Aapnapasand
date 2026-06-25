import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { CATEGORIES } from "@/lib/constants";
import type { Category as CategoryType } from "@/types";

type PublicCategory = Pick<CategoryType, "_id" | "name" | "slug" | "description" | "image" | "gender" | "isActive">;

export function fallbackCategories(): PublicCategory[] {
  return CATEGORIES.map((category) => ({
    _id: category.slug,
    name: category.name,
    slug: category.slug,
    gender: category.gender,
    image: category.image,
    description: `Shop ${category.name} collection at Aapnapasand`,
    isActive: true,
  }));
}

export async function getPublicCategories(): Promise<PublicCategory[]> {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })
      .lean();

    const dbCategories = JSON.parse(JSON.stringify(categories)) as PublicCategory[];
    const dbSlugs = new Set(dbCategories.map((category) => category.slug));
    const missingDefaults = fallbackCategories().filter((category) => !dbSlugs.has(category.slug));

    return [...dbCategories, ...missingDefaults];
  } catch {
    return fallbackCategories();
  }
}
