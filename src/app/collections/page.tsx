import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTASection, PageHero, PUBLIC_IMAGES, SectionHeader } from "@/components/marketing/PublicPage";
import { getPublicCategories } from "@/lib/category-data";

export const dynamic = "force-dynamic";

const collections = [
  {
    title: "Everyday Men",
    text: "Shirts, denim, trousers, kurtas, and layers for a polished daily rotation.",
    href: "/shop?gender=men",
    image: PUBLIC_IMAGES.mens,
  },
  {
    title: "Graceful Women",
    text: "Dresses, sarees, tops, and festive-ready silhouettes with easy elegance.",
    href: "/shop?gender=women",
    image: PUBLIC_IMAGES.boutique,
  },
  {
    title: "Ethnic Essentials",
    text: "Kurtas, sarees, and occasion pieces for celebrations, gifting, and family moments.",
    href: "/shop?category=ethnic-wear",
    image: PUBLIC_IMAGES.ethnic,
  },
  {
    title: "Wardrobe Staples",
    text: "Comfortable, repeatable styles that work across seasons and plans.",
    href: "/shop?sort=popular",
    image: PUBLIC_IMAGES.wardrobe,
  },
];

export default async function CollectionsPage() {
  const categories = await getPublicCategories();

  return (
    <>
      <PageHero
        title="Collections with a point of view"
        description="Browse curated edits designed around how you dress: daily ease, work polish, festive plans, and pieces that feel personal."
        image={PUBLIC_IMAGES.hero}
        primaryHref="/shop"
        primaryLabel="Shop All"
        secondaryHref="/new-arrivals"
        secondaryLabel="New Arrivals"
      />

      <section className="py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            title="Choose your edit"
            description="Each collection is shaped around a real wardrobe moment, not a random product shelf."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {collections.map((collection) => (
              <Link
                key={collection.title}
                href={collection.href}
                className="group grid overflow-hidden rounded-[1.25rem] bg-brand-50 shadow-sm md:grid-cols-[0.9fr_1.1fr]"
              >
                <div className="relative min-h-72 overflow-hidden">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 lg:p-8">
                  <h2 className="font-display text-3xl font-bold text-brand-950">{collection.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{collection.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                    Shop collection <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-50/70 py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="All shopping categories"
            description="A bigger catalog for customers who want to jump straight into a product type."
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-100">
                  <Image
                    src={category.image || PUBLIC_IMAGES.fabric}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-sm font-semibold text-brand-950">{category.name}</h2>
                  <p className="mt-1 text-xs capitalize text-gray-500">{category.gender}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
