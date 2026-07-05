import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Sparkles } from "lucide-react";
import { PageHero, PUBLIC_IMAGES, PromiseStrip, SectionHeader } from "@/components/marketing/PublicPage";

const arrivals = [
  { title: "Fresh shirts", href: "/shop?category=shirts&sort=newest", image: PUBLIC_IMAGES.mens },
  { title: "New sarees", href: "/shop?category=sarees&sort=newest", image: PUBLIC_IMAGES.ethnic },
  { title: "Soft layers", href: "/shop?sort=newest", image: PUBLIC_IMAGES.wardrobe },
];

export default function NewArrivalsPage() {
  return (
    <>
      <PageHero
        title="New arrivals just landed"
        description="The latest BOHOBLOCKPRINTED edits bring in fresh colors, updated fits, polished staples, and celebration-ready pieces."
        image={PUBLIC_IMAGES.studio}
        primaryHref="/shop?sort=newest"
        primaryLabel="Shop Latest"
        secondaryHref="/collections"
        secondaryLabel="View Collections"
      >
        <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-600">
          <span className="inline-flex items-center gap-2 rounded-lg bg-brand-50 px-4 py-2">
            <Clock3 size={16} /> Updated weekly
          </span>
          <span className="inline-flex items-center gap-2 rounded-lg bg-brand-50 px-4 py-2">
            <Sparkles size={16} /> Limited seasonal edits
          </span>
        </div>
      </PageHero>

      <section className="bg-brand-50/70 py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="Start with what is new"
            description="Quick paths into the newest pieces by wardrobe mood."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {arrivals.map((arrival) => (
              <Link key={arrival.title} href={arrival.href} className="group overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={arrival.image}
                    alt={arrival.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between p-5">
                  <h2 className="font-display text-2xl font-bold text-brand-950">{arrival.title}</h2>
                  <ArrowRight className="text-brand-700" size={18} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <PromiseStrip />
    </>
  );
}

