import { SectionHeader } from "@/components/marketing/PublicPage";
import { getPublicCategories } from "@/lib/category-data";
import { CategoryGridClient } from "./CategoryGridClient";

export async function CategoryGrid() {
  const categories = await getPublicCategories();

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container-app">
        <SectionHeader
          align="center"
          title="Shop by category"
          description="Explore curated collections across modern essentials, occasion wear, and Indian classics."
        />

        <CategoryGridClient categories={categories} />
      </div>
    </section>
  );
}
