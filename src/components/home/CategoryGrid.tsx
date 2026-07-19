import { CategoryGridClient } from "./CategoryGridClient";
import { getHomepageCategories } from "@/lib/category-data";

type CategorySelector = {
  slug?: string;
  name?: string;
};

/*
 * Homepage par pehle dikhne wali categories.
 *
 * Slug aur name dono diye hain taaki category
 * kisi bhi tarah database mein saved ho, match ho jaye.
 */
const HOME_CATEGORY_ORDER: CategorySelector[] = [
  {
    slug: "bandanas",
    name: "Bandanas",
  },
  {
    slug: "curtains",
    name: "Curtains",
  },
  {
    slug: "duvet-covers",
    name: "Duvet Covers",
  },
  {
    slug: "tablecloths",
    name: "Tablecloths",
  },
  {
    slug: "canvas-bags",
    name: "Canvas Bags",
  },
  {
    slug: "wrinkle-duvet-covers",
    name: "Wrinkle Duvet Covers",
  },
  {
    slug: "linen-curtains",
    name: "Linen Curtains",
  },
];

function normalizeValue(value?: string) {
  return value?.trim().toLocaleLowerCase() ?? "";
}

export async function CategoryGrid() {
  const categories = await getHomepageCategories();

  if (!categories.length) return null;

  const selectedCategories: typeof categories = [];
  const selectedCategoryIds = new Set<string>();

  /*
   * Selected categories ko HOME_CATEGORY_ORDER
   * ke exact order mein find karo.
   */
  for (const selector of HOME_CATEGORY_ORDER) {
    const category = categories.find((item) => {
      const slugMatches =
        selector.slug &&
        normalizeValue(item.slug) === normalizeValue(selector.slug);

      const nameMatches =
        selector.name &&
        normalizeValue(item.name) === normalizeValue(selector.name);

      return slugMatches || nameMatches;
    });

    if (!category) continue;

    const categoryId = String(category._id);

    /*
     * Same category ko do baar show hone se rokta hai.
     */
    if (selectedCategoryIds.has(categoryId)) continue;

    selectedCategoryIds.add(categoryId);
    selectedCategories.push(category);
  }

  /*
   * Baaki sab categories selected categories ke baad rahengi.
   * View All Categories click karne par ye sab show hongi.
   */
  const remainingCategories = categories.filter(
    (category) => !selectedCategoryIds.has(String(category._id))
  );

  const orderedCategories = [
    ...selectedCategories,
    ...remainingCategories,
  ];

  return (
    <section
      id="shop-by-category"
      className="relative scroll-mt-24 overflow-hidden border-y border-[#e4ded2] bg-[#fbfaf7] py-12 sm:py-16 lg:py-24"
    >
      <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#dce9e2]/55 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#f4dfb5]/40 blur-3xl" />

      <div className="container-app relative">
        <div className="mb-8 sm:mb-10 lg:flex lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b87811]">
              Artisan Collections
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-[#173f4f] sm:text-4xl lg:text-5xl">
              Shop by Category
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
              Discover handcrafted collections made for beautiful, thoughtful
              living.
            </p>
          </div>

          <p className="mt-4 text-sm font-medium text-stone-500 lg:mt-0">
            {orderedCategories.length} collections available
          </p>
        </div>

        <CategoryGridClient categories={orderedCategories} />
      </div>
    </section>
  );
}