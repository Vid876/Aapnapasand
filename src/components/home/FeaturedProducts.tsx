import { ProductCard } from "@/components/products/ProductCard";
import { SectionHeader } from "@/components/marketing/PublicPage";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import type { Product as ProductType } from "@/types";

async function getFeaturedProducts(): Promise<ProductType[]> {
  try {
    await connectDB();
    const products = await Product.find({
      isFeatured: true,
      isActive: true,
      "images.0": { $regex: "^/uploads/" },
    })
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
    <section className="bg-brand-50/70 py-16 lg:py-24">
      <div className="container-app">
        <div className="mb-10 flex items-end justify-between gap-6">
          <SectionHeader
            title="Featured for this season"
            description="Handpicked styles with strong fabric, versatile cuts, and easy styling."
          />
          <a
            href="/shop?featured=true"
            className="hidden sm:block text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
          >
            View all
          </a>
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
