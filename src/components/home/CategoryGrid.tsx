import Link from "next/link";
import { SectionHeader } from "@/components/marketing/PublicPage";
import { getPublicCategories } from "@/lib/category-data";
import { CategoryCardMedia } from "./CategoryCardMedia";

export async function CategoryGrid() {
  const categories = await getPublicCategories();

  return (
    <section className="py-16 lg:py-24">
      <div className="container-app">
        <SectionHeader
          align="center"
          title="Shop by category"
          description="Explore curated collections across modern essentials, occasion wear, and Indian classics."
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-brand-50 shadow-sm transition-transform duration-300 hover:-translate-y-1"
            >
              <CategoryCardMedia alt={category.name} src={category.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/75 via-brand-950/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-sm font-semibold text-white lg:text-base">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs text-white/75">Explore styles</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
