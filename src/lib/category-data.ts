import { unstable_cache } from "next/cache";
import { ensureDefaultCategories } from "@/lib/category-sync";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
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
