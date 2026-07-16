import Image from "next/image";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { CTASection, PageHero, PUBLIC_IMAGES, SectionHeader } from "@/components/marketing/PublicPage";
import { PROCESS_STEPS } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Hand Block Printing Process",
  description:
    "See the BOHOBLOCKPRINTED hand block printing process from block carving and fabric preparation to printing, washing, stitching, and quality inspection.",
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        title="Hand block printing process"
        description="A clear look at the Jaipur textile workflow behind the finished home linen, table linen, fashion, accessories, fabric, custom orders, and wholesale pieces."
        image={PUBLIC_IMAGES.printProcess}
        primaryHref="/shop"
        primaryLabel="Shop Textiles"
        secondaryHref="/our-story"
        secondaryLabel="Our Story"
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="From carved block to finished textile"
            description="The process page gives the brand a specific craft story instead of generic fashion copy."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((step, index) => (
              <article key={step.title} className="overflow-hidden rounded-lg border border-stone-200 bg-[#fbfaf7] shadow-sm">
                <div className="relative aspect-[4/3] bg-stone-100">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#173f4f] text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <h2 className="text-xl font-semibold text-stone-950">{step.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-stone-600">{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eef4f0] py-16 lg:py-24">
        <div className="container-app grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight text-stone-950 lg:text-5xl">
              Why the process matters
            </h2>
            <p className="mt-5 text-base leading-8 text-stone-700">
              Hand block printing carries natural variation in pressure, placement, and tone. Product pages and support content should explain this clearly so customers understand the difference between artisan-made textiles and machine-perfect printing.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Useful educational content for shoppers",
              "Better trust for wholesale buyers",
              "Clear language for handmade variation",
              "Internal links from category and product pages",
            ].map((point) => (
              <div key={point} className="flex gap-3 rounded-lg bg-white p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-[#276070]" size={18} />
                <span className="text-sm font-medium text-stone-700">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
