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
    const products = await Product.find({
      isFeatured: true,
      isActive: true,
      ...PRODUCT_IMAGE_FILTER,
    })
      .populate("category", "name slug")
      .limit(8)
      .lean();
    return JSON.parse(JSON.stringify(products));
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
    <section className="bg-brand-50/70 py-16 lg:py-24">
      <div className="container-app">
        <div className="mb-10 flex items-end justify-between gap-6">
          <SectionHeader
            title="Best Sellers"
            description="Most requested textiles across home linen, table linen, fashion, accessories, and fabric."
          />
          <Link
            href="/shop?featured=true"
            className="hidden sm:block text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
