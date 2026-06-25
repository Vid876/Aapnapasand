import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/products/ProductCard";
import { PUBLIC_IMAGES, PromiseStrip, SectionHeader } from "@/components/marketing/PublicPage";
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
  const edits = [
    { title: "Saree moments", href: "/shop?category=sarees", image: PUBLIC_IMAGES.ethnic },
    { title: "New workwear", href: "/shop?category=shirts", image: PUBLIC_IMAGES.mens },
    { title: "Soft weekend layers", href: "/shop?sort=newest", image: PUBLIC_IMAGES.wardrobe },
  ];

  return (
    <>
      <section className="py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="Trending now"
            description="Most-loved products and styling stories customers are returning to."
          />

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {edits.map((edit) => (
                <Link
                  key={edit.title}
                  href={edit.href}
                  className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-brand-50"
                >
                  <Image
                    src={edit.image}
                    alt={edit.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="font-display text-3xl font-bold">{edit.title}</h3>
                    <p className="mt-2 text-sm text-white/80">Shop the edit</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

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
      <PromiseStrip />
    </>
  );
}
