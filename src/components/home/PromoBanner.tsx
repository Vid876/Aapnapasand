import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { InfoBand, PUBLIC_IMAGES } from "@/components/marketing/PublicPage";

export function PromoBanner() {
  return (
    <>
      <InfoBand
        title="A wardrobe built around your plans"
        text="From workdays to wedding weekends, BOHOBLOCKPRINTED brings together breathable fabrics, polished cuts, and colors that feel easy to wear in real life."
        image={PUBLIC_IMAGES.fabric}
        bullets={[
          "Modern Indian silhouettes for men and women",
          "Occasion edits that pair effortlessly",
          "Comfort-first fabrics selected for repeat wear",
        ]}
      />
      <section className="pb-16 lg:pb-24">
        <div className="container-app grid gap-5 md:grid-cols-2">
          <Link
            href="/shop?gender=men"
            className="group relative h-72 overflow-hidden rounded-[1.25rem] bg-brand-950 lg:h-96"
          >
            <Image
              src={PUBLIC_IMAGES.mens}
              alt="Men's collection"
              fill
              className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:p-8">
              <h3 className="font-display text-4xl font-bold">Men&apos;s wear</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">
                Crisp shirts, versatile denim, kurtas, and layers with a refined everyday mood.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                Shop men <ArrowRight size={16} />
              </span>
            </div>
          </Link>

          <Link
            href="/shop?gender=women"
            className="group relative h-72 overflow-hidden rounded-[1.25rem] bg-brand-950 lg:h-96"
          >
            <Image
              src={PUBLIC_IMAGES.boutique}
              alt="Women's collection"
              fill
              className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:p-8">
              <h3 className="font-display text-4xl font-bold">Women&apos;s wear</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">
                Dresses, sarees, tops, and ethnic staples for quiet elegance and celebration.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                Shop women <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}

