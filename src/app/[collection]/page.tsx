import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Layers3, PackageCheck, Sparkles } from "lucide-react";
import { CTASection, PageHero, PromiseStrip, SectionHeader } from "@/components/marketing/PublicPage";
import { BRAND, CATEGORY_GROUPS } from "@/lib/brand";

type CollectionPageProps = {
  params: Promise<{ collection: string }>;
};

function getCollection(slug: string) {
  return CATEGORY_GROUPS.find((category) => category.slug === slug);
}

export function generateStaticParams() {
  return CATEGORY_GROUPS.map((category) => ({ collection: category.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { collection } = await params;
  const category = getCollection(collection);

  if (!category) {
    return {};
  }

  return {
    title: `${category.name} Collection`,
    description: `${category.description} Shop ${category.keywords} from ${BRAND.name}, Jaipur, India.`,
    keywords: category.keywords,
  };
}

export default async function CollectionLandingPage({ params }: CollectionPageProps) {
  const { collection } = await params;
  const category = getCollection(collection);

  if (!category) {
    notFound();
  }

  return (
    <>
      <PageHero
        title={`${category.name} by BOHOBLOCKPRINTED`}
        description={category.description}
        image={category.image}
        primaryHref={`/shop?category=${category.subcategories[0]?.slug ?? category.slug}`}
        primaryLabel="Shop Collection"
        secondaryHref="/wholesale"
        secondaryLabel="Wholesale Inquiry"
      >
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-[#eef4f0] px-4 py-3 text-sm font-semibold text-[#173f4f]">
            Handmade in Jaipur
          </div>
          <div className="rounded-lg bg-[#eef4f0] px-4 py-3 text-sm font-semibold text-[#173f4f]">
            Worldwide Shipping
          </div>
          <div className="rounded-lg bg-[#eef4f0] px-4 py-3 text-sm font-semibold text-[#173f4f]">
            Custom Orders
          </div>
        </div>
      </PageHero>

      <section className="bg-white py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title={`Shop ${category.name}`}
            description="Clear subcategory paths help retail shoppers, wholesale buyers, and search engines understand the collection."
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {category.subcategories.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="group rounded-lg border border-stone-200 bg-[#fbfaf7] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-950/10"
              >
                <PackageCheck className="text-[#276070]" size={24} />
                <h2 className="mt-5 text-xl font-semibold text-stone-950">{item.name}</h2>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  Browse {item.name.toLowerCase()} within the {category.name.toLowerCase()} collection.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#276070]">
                  Shop now <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eef4f0] py-16 lg:py-24">
        <div className="container-app grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight text-stone-950 lg:text-5xl">
              Made for homes, wardrobes, makers, and wholesale edits
            </h2>
            <p className="mt-5 text-base leading-8 text-stone-700">
              {category.name} keeps the brand focused on artisan-made textiles instead of generic fashion. Every product path should explain fabric, care, origin, processing, shipping, returns, sizing, and reviews so shoppers can buy with confidence.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Focused collection keywords",
                "Crawlable internal links",
                "Product detail and care context",
                "Retail, custom, and wholesale pathways",
              ].map((point) => (
                <div key={point} className="flex gap-3 rounded-lg bg-white p-4">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#276070]" size={18} />
                  <span className="text-sm font-medium text-stone-700">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-white shadow-xl shadow-stone-950/10 lg:aspect-[5/4]">
            <Image
              src={category.image}
              alt={`${category.name} hand block printed textile collection`}
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="container-app">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-stone-200 p-6">
              <Sparkles className="text-[#c9902e]" size={24} />
              <h2 className="mt-4 font-semibold text-stone-950">Artisan story</h2>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Jaipur hand block printing gives each textile a handmade surface and a place-based craft story.
              </p>
            </div>
            <div className="rounded-lg border border-stone-200 p-6">
              <Layers3 className="text-[#276070]" size={24} />
              <h2 className="mt-4 font-semibold text-stone-950">Material clarity</h2>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Category and product pages should make cotton, linen, sizing, care, and use cases easy to compare.
              </p>
            </div>
            <div className="rounded-lg border border-stone-200 p-6">
              <PackageCheck className="text-[#9f2f2f]" size={24} />
              <h2 className="mt-4 font-semibold text-stone-950">Wholesale ready</h2>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Boutiques, interior studios, and brands can move from collection browsing into the wholesale inquiry path.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PromiseStrip />
      <CTASection />
    </>
  );
}
