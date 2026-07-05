import { unstable_cache } from "next/cache";
import Link from "next/link";
import { LuxuryTextBand } from "@/components/home/LuxuryTextBand";
import { ProductCard } from "@/components/products/ProductCard";
import { PromiseStrip, SectionHeader } from "@/components/marketing/PublicPage";
import { connectDB } from "@/lib/db";
import { PRODUCT_IMAGE_FILTER } from "@/lib/image-utils";
import { Product } from "@/models/Product";
import type { Product as ProductType } from "@/types";

async function fetchTrendingProducts(): Promise<ProductType[]> {
  try {
    await connectDB();
    const products = await Product.find({
      isActive: true,
      ...PRODUCT_IMAGE_FILTER,
    })
      .sort({ reviewCount: -1, rating: -1 })
      .limit(4)
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch {
    return [];
  }
}

const getTrendingProducts = unstable_cache(fetchTrendingProducts, ["home-trending-products"], {
  revalidate: 300,
  tags: ["products"],
});

export async function TrendingSection() {
  const products = await getTrendingProducts();

  return (
    <>
      {products.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container-app">
            <SectionHeader
              align="center"
              title="Trending now"
              description="Most-loved uploaded products customers are returning to."
            />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/shop?sort=popular"
                className="inline-flex items-center justify-center rounded-lg border border-brand-900 px-6 py-3 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-50"
              >
                View all trending
              </Link>
            </div>
          </div>
        </section>
      )}
      {products.length > 0 && <LuxuryTextBand />}
      <PromiseStrip />
    </>
  );
}
