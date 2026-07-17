import Image from "next/image";
import Link from "next/link";
import { CTASection, PageHero, PUBLIC_IMAGES, SectionHeader } from "@/components/marketing/PublicPage";
import { getPublicCategories } from "@/lib/category-data";
import { getRenderableImageSrc } from "@/lib/image-utils";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const categories = await getPublicCategories();

  return (
    <>
      <PageHero
        title="Textile collections with a clear path"
        description="Browse BOHOBLOCKPRINTED categories for home linen, table linen, fashion, accessories, fabric by yard, custom orders, and wholesale buying."
        image={PUBLIC_IMAGES.collectionEdit}
        imagePosition="center"
        primaryHref="/shop"
        primaryLabel="Shop All"
        secondaryHref="/wholesale"
        secondaryLabel="Wholesale"
      />

      <section className="bg-brand-50/70 py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="Shopping categories"
            description="Active product categories from the catalog, aligned to the Jaipur hand block printed textile structure."
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
                    src={getRenderableImageSrc(category.image)!}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                    unoptimized={category.image?.startsWith("/uploads/")}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-sm font-semibold text-brand-950">{category.name}</h2>
                  <p className="mt-1 text-xs text-gray-500">Shop category</p>
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
