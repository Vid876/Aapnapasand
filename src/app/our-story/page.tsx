import type { Metadata } from "next";
import { ArrowRight, MapPin, Sparkles, UsersRound } from "lucide-react";
import Link from "next/link";
import { InfoBand, PageHero, PUBLIC_IMAGES, PromiseStrip, SectionHeader } from "@/components/marketing/PublicPage";
import { BRAND, CATEGORY_GROUPS } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The BOHOBLOCKPRINTED story: hand block printed home decor, table linen, fashion, accessories, fabric, custom orders, and wholesale textiles from Jaipur.",
};

export default function OurStoryPage() {
  return (
    <>
      <PageHero
        title="Our Story"
        description={`${BRAND.name} is positioned around Jaipur hand block printed textiles, natural cotton and linen fabrics, worldwide shipping, custom orders, and wholesale production conversations.`}
        image={PUBLIC_IMAGES.artisanStory}
        imageFit="contain"
        primaryHref="/process"
        primaryLabel="See the Process"
        secondaryHref="/shop"
        secondaryLabel="Shop Collection"
      />

      <InfoBand
        title="A clearer identity for a textile brand"
        text="The site now keeps the useful customer-support structure while shifting the public story from broad fashion to a focused artisan textile identity."
        image={PUBLIC_IMAGES.collectionEdit}
        bullets={[
          "Hand block printed home decor, fashion, and accessories",
          "A Jaipur, Rajasthan, India origin story",
          "Retail, custom, fabric, and wholesale buying paths",
        ]}
      />

      <section className="bg-[#eef4f0] py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="What makes the story specific"
            description="The brand should sound like a real textile workshop and ecommerce store, not a generic fashion catalog."
          />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <MapPin className="text-[#276070]" size={24} />
              <h2 className="mt-5 font-semibold text-stone-950">Place</h2>
              <p className="mt-2 text-sm leading-7 text-stone-600">Jaipur gives the brand a credible textile and block printing context.</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <Sparkles className="text-[#c9902e]" size={24} />
              <h2 className="mt-5 font-semibold text-stone-950">Process</h2>
              <p className="mt-2 text-sm leading-7 text-stone-600">Carving, printing, washing, stitching, and inspection make the product story concrete.</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <UsersRound className="text-[#9f2f2f]" size={24} />
              <h2 className="mt-5 font-semibold text-stone-950">Buyers</h2>
              <p className="mt-2 text-sm leading-7 text-stone-600">Retail shoppers, boutiques, designers, hotels, makers, and brands all get clear paths.</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 rounded-xl bg-[#173f4f] p-6 text-white md:grid-cols-5 lg:p-8">
            {CATEGORY_GROUPS.map((category) => (
              <Link key={category.slug} href={category.href} className="group">
                <p className="font-semibold text-white">{category.name}</p>
                <span className="mt-2 inline-flex items-center gap-2 text-sm text-white/72 group-hover:text-white">
                  Explore <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PromiseStrip />
    </>
  );
}
