import { connectDB } from "@/lib/db";
import { CATEGORY_IMAGE_FILTER } from "@/lib/image-utils";
import { Category } from "@/models/Category";
import type { Category as CategoryType } from "@/types";

type PublicCategory = Pick<CategoryType, "_id" | "name" | "slug" | "description" | "image" | "gender" | "isActive">;

export async function getPublicCategories(): Promise<PublicCategory[]> {
  try {
    await connectDB();
    const categories = await Category.find({
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
