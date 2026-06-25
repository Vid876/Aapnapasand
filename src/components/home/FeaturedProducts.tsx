import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/products/ProductCard";
import { PUBLIC_IMAGES, SectionHeader } from "@/components/marketing/PublicPage";
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
  const fallbackLooks = [
    {
      title: "Everyday ease",
      text: "Soft shirts, relaxed denim, and refined staples.",
      href: "/shop?gender=men",
      image: PUBLIC_IMAGES.mens,
    },
    {
      title: "Celebration ready",
      text: "Sarees, kurtas, and statement ethnic wear.",
      href: "/shop?category=ethnic-wear",
      image: PUBLIC_IMAGES.ethnic,
    },
    {
      title: "Weekend refresh",
      text: "Light layers, dresses, and modern silhouettes.",
      href: "/shop?gender=women",
      image: PUBLIC_IMAGES.studio,
    },
  ];

  return (
    <section className="bg-brand-50/70 py-16 lg:py-24">
      <div className="container-app">
        <div className="mb-10 flex items-end justify-between gap-6">
          <SectionHeader
            title="Featured for this season"
            description="Handpicked styles with strong fabric, versatile cuts, and easy styling."
          />
          <Link
            href="/shop?featured=true"
            className="hidden sm:block text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
          >
            View all
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {fallbackLooks.map((look) => (
              <Link
                key={look.title}
                href={look.href}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-100">
                  <Image
                    src={look.image}
                    alt={look.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-2xl font-bold text-brand-950">{look.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{look.text}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
