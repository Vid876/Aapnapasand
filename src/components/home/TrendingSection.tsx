import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import type { Product as ProductType } from "@/types";

async function getTrendingProducts(): Promise<ProductType[]> {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true })
      .sort({ reviewCount: -1, rating: -1 })
      .limit(4)
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch {
    return [];
  }
}

export async function TrendingSection() {
  const products = await getTrendingProducts();

  if (products.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="container-app">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-2">
            Trending Now
          </h2>
          <p className="text-gray-500">Most loved by our customers</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/shop?sort=popular"
            className="inline-block text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
          >
            View All Trending &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
