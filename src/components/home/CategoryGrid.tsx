import { SectionHeader } from "@/components/marketing/PublicPage";
import { getHomepageCategories } from "@/lib/category-data";
import { CategoryGridClient } from "./CategoryGridClient";

export async function CategoryGrid() {
  const categories = await getHomepageCategories();

  if (categories.length === 0) return null;

  return (
    <section id="shop-by-category" className="scroll-mt-24 border-y border-[#dfe5df] bg-[#fbfaf7] py-16 lg:py-24">
      <div className="container-app">
        <SectionHeader
          title="Shop by Category"
          description="Discover handcrafted collections made for beautiful, thoughtful living."
        />
        <CategoryGridClient categories={categories} />
      </div>
    </section>
  );
}
