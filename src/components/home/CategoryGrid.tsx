import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/constants";

export function CategoryGrid() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-app">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Explore our curated collections across men&apos;s and women&apos;s fashion
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {CATEGORIES.slice(0, 10).map((category) => (
            
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-sm lg:text-base">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
