import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CTASection, InfoBand, PageHero, PUBLIC_IMAGES, PromiseStrip, SectionHeader } from "@/components/marketing/PublicPage";
import { BRAND, CATEGORY_GROUPS, WHY_CHOOSE } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about BOHOBLOCKPRINTED, a Jaipur hand block printed textile brand for home linen, table linen, fashion, accessories, fabric, custom orders, and wholesale.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Bohoblockprinted"
        description={`${BRAND.name} is a Jaipur hand block printed textile brand for home decor, table linen, relaxed fashion, accessories, fabric by yard, custom orders, and wholesale buyers.`}
        image={PUBLIC_IMAGES.boutique}
        primaryHref="/shop"
        primaryLabel="Shop Collection"
        secondaryHref="/wholesale"
        secondaryLabel="Wholesale Inquiry"
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="What the brand stands for"
            description="The website now centers the work around place, process, material, and clear buying paths."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {WHY_CHOOSE.map((value) => (
              <div key={value} className="rounded-lg border border-stone-200 bg-[#fbfaf7] p-6 shadow-sm">
                <CheckCircle2 className="text-[#276070]" size={22} />
                <p className="mt-4 text-sm font-semibold leading-7 text-stone-800">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InfoBand
        title="From generic fashion to artisan textiles"
        text="The store keeps useful support, legal, and trust pages, but the public story now focuses on Jaipur hand block printing, natural cotton and linen fabrics, worldwide shipping, and custom wholesale possibilities."
        image={PUBLIC_IMAGES.fabric}
        reverse
        bullets={[
          "Home Linen, Table Linen, Fashion, Accessories, and Fabric landing pages",
          "Dedicated wholesale and custom-order inquiry path",
          "Product pages that explain care, origin, size, shipping, returns, and reviews",
        ]}
      />

      <section className="bg-[#eef4f0] py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="Explore the core collections"
            description="Each category is structured for clear internal linking and focused search intent."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {CATEGORY_GROUPS.map((category) => (
              <Link
                key={category.slug}
                href={category.href}
                className="rounded-lg bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <h2 className="font-semibold text-stone-950">{category.name}</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">{category.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#276070]">
                  View category <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PromiseStrip />
      <CTASection />
    </>
  );
}
