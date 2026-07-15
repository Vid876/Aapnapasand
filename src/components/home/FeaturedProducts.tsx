import { unstable_cache } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { SectionHeader } from "@/components/marketing/PublicPage";
import { connectDB } from "@/lib/db";
import { PRODUCT_IMAGE_FILTER } from "@/lib/image-utils";
import { Product } from "@/models/Product";
import type { Product as ProductType } from "@/types";

async function fetchFeaturedProducts(): Promise<ProductType[]> {
  try {
    await connectDB();
    const [importedCandidates, featuredCandidates] = await Promise.all([
      Product.find({
        isActive: true,
        tags: { $regex: "^etsy:" },
        ...PRODUCT_IMAGE_FILTER,
      })
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .limit(400)
        .lean(),
      Product.find({
        isActive: true,
        isFeatured: true,
        ...PRODUCT_IMAGE_FILTER,
      })
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .limit(40)
        .lean(),
    ]);

    const importedProducts = JSON.parse(JSON.stringify(importedCandidates)) as ProductType[];
    const featuredProducts = JSON.parse(JSON.stringify(featuredCandidates)) as ProductType[];
    const selected: ProductType[] = [];
    const categoryCounts = new Map<string, number>();
    const selectedIds = new Set<string>();

    const addDiverseProducts = (products: ProductType[], targetTotal: number, maxPerCategory: number) => {
      for (const product of products) {
        if (selectedIds.has(product._id)) continue;

      const categoryKey =
        typeof product.category === "string"
          ? product.category
            : String(product.category?._id ?? product.category?.slug ?? "uncategorized");
      const categoryCount = categoryCounts.get(categoryKey) ?? 0;

        if (categoryCount < maxPerCategory) {
        selected.push(product);
          selectedIds.add(product._id);
        categoryCounts.set(categoryKey, categoryCount + 1);
      }

        if (selected.length === targetTotal) break;
      }
    };

    // Keep the homepage fresh: six imported catalog pieces plus two existing featured products.
    addDiverseProducts(importedProducts, 6, 1);
    addDiverseProducts(featuredProducts, 8, 2);

    if (selected.length < 8) {
      addDiverseProducts([...importedProducts, ...featuredProducts], 8, Number.MAX_SAFE_INTEGER);
    }

    return selected;
  } catch {
    return [];
  }
}

const getFeaturedProducts = unstable_cache(fetchFeaturedProducts, ["home-featured-products"], {
  revalidate: 300,
  tags: ["products"],
});

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <section id="handpicked-products" className="scroll-mt-24 border-b border-[#d7dfd8] bg-[#eef4f0] py-16 lg:py-24">
      <div className="container-app">
        <div className="mb-10 flex items-end justify-between gap-6">
          <SectionHeader
            title="Handpicked for You"
            description="Fresh artisan finds, ready to make your everyday feel special."
          />
          <Link
            href="/shop"
            className="hidden shrink-0 items-center border-b border-[#c9902e] pb-1 text-sm font-semibold text-[#9a620b] transition-colors hover:text-[#173f4f] sm:inline-flex"
          >
            Shop all products
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-9 sm:hidden">
          <Link href="/shop" className="inline-flex border-b border-[#c9902e] pb-1 text-sm font-semibold text-[#9a620b]">
            Shop all products
          </Link>
        </div>
      </div>
    </section>
  );
}
