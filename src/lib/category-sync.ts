import { CATEGORY_GROUPS, SHOP_CATEGORY_TILES } from "@/lib/brand";
import { CATEGORIES } from "@/lib/constants";
import { Category } from "@/models/Category";

type CategoryGender = "men" | "women" | "kids" | "unisex";

type DefaultCategory = {
  name: string;
  slug: string;
  description: string;
  image: string;
  gender: CategoryGender;
  isActive: boolean;
};

const groupBySubcategorySlug = new Map<string, (typeof CATEGORY_GROUPS)[number]>(
  CATEGORY_GROUPS.flatMap((group) =>
    group.subcategories.map((subcategory) => [subcategory.slug, group] as const)
  )
);

const tileBySlug = new Map<string, (typeof SHOP_CATEGORY_TILES)[number]>(
  SHOP_CATEGORY_TILES.map((tile) => [tile.slug, tile])
);

const defaultCategories: DefaultCategory[] = CATEGORIES.map((category) => {
  const group = groupBySubcategorySlug.get(category.slug);
  const tile = tileBySlug.get(category.slug);

  return {
    name: category.name,
    slug: category.slug,
    description:
      group?.description ??
      `Shop ${category.name} from BOHOBLOCKPRINTED hand block printed textile collections.`,
    image: tile?.image ?? category.image,
    gender: category.gender,
    isActive: true,
  };
});

export async function ensureDefaultCategories() {
  if (defaultCategories.length === 0) return { upsertedCount: 0 };

  const result = await Category.bulkWrite(
    defaultCategories.map((category) => ({
      updateOne: {
        filter: { slug: category.slug },
        update: { $setOnInsert: category },
        upsert: true,
      },
    })),
    { ordered: false }
  );

  return { upsertedCount: result.upsertedCount ?? 0 };
}
