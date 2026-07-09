import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/marketing/PublicPage";
import { SHOP_CATEGORY_TILES } from "@/lib/brand";
import { getPublicCategories } from "@/lib/category-data";
import { CategoryCardMedia } from "./CategoryCardMedia";

const tileOrder = new Map<string, number>(
  SHOP_CATEGORY_TILES.map((category, index) => [category.slug, index])
);
const tileBySlug = new Map<string, (typeof SHOP_CATEGORY_TILES)[number]>(
  SHOP_CATEGORY_TILES.map((category) => [category.slug, category])
);

export async function CategoryGrid() {
  const dbCategories = await getPublicCategories();
  const dbCategoryBySlug = new Map(dbCategories.map((category) => [category.slug, category]));
  const categories = SHOP_CATEGORY_TILES.map((tile) => {
    const dbCategory = dbCategoryBySlug.get(tile.slug);

    return {
      name: dbCategory?.name ?? tile.name,
      slug: tile.slug,
      image: dbCategory?.image || tile.image,
    };
  }).sort((a, b) => {
    const aOrder = tileOrder.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = tileOrder.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder;
  });

  return (
    <section className="py-16 lg:py-24">
      <div className="container-app">
        <SectionHeader
          align="center"
          title="Shop by Category"
          description="Clear collection paths for home linen, table linen, artisan fashion, accessories, and fabric by yard."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const fallbackTile = tileBySlug.get(category.slug);
            const image = category.image || fallbackTile?.image || "/Logo.png";

            return (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group relative min-h-[280px] overflow-hidden rounded-xl bg-stone-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-950/10 sm:min-h-[320px] lg:min-h-[360px]"
              >
                <CategoryCardMedia alt={category.name} src={image} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102f3b]/82 via-[#102f3b]/16 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-semibold text-white lg:text-xl">
                    {category.name}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white/84">
                    Shop now <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
