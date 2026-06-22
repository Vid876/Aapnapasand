import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import type { Product as ProductType } from "@/types";

async function getFeaturedProducts(): Promise<ProductType[]> {
  try {
    await connectDB();
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate("category", "name slug")
      .limit(8)
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch {
    return [];
  }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container-app">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-2">
              Featured Products
            </h2>
            <p className="text-gray-500">Handpicked styles just for you</p>
          </div>
          <Link
            href="/shop?featured=true"
            className="hidden sm:block text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
          >
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
