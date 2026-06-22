"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/store/localeStore";

export function HeroBanner() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
        <Image
          src="/Banner.png"
          alt="Fashion collection"
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="container-app">
            <div className="max-w-xl text-white">
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-brand-200">
                {t.hero.tagline}
              </p>

              <h2 className="mb-6 text-4xl font-display font-bold leading-tight sm:text-5xl lg:text-6xl">
                {t.hero.title}
              </h2>

              <p className="mb-8 text-lg leading-relaxed text-gray-200">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/shop?gender=men">
                  <Button
                    size="lg"
                    className="bg-white text-brand-900 hover:bg-gray-100"
                  >
                    {t.hero.shopMen}
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>

                <Link href="/shop?gender=women">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    {t.hero.shopWomen}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}