"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    image: "/Banner 2.png",
    title: "Wear what feels like you",
    text: "Premium festive and everyday Indian fashion, curated for confidence, comfort, and celebration.",
    primary: "Shop New Arrivals",
    primaryHref: "/new-arrivals",
    secondary: "Explore Collections",
    secondaryHref: "/collections",
    align: "center" as const,
    tone: "light" as const,
  },
  {
    image: "/Banner.png",
    title: "Fresh styles for every plan",
    text: "From soft everyday looks to polished occasion pieces, discover outfits that feel easy and expressive.",
    primary: "Shop the Collection",
    primaryHref: "/shop",
    secondary: "View Categories",
    secondaryHref: "/collections",
    align: "left" as const,
    tone: "warm" as const,
  },
];

export function HeroBanner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  const previous = () => {
    setActive((current) => (current - 1 + SLIDES.length) % SLIDES.length);
  };

  const next = () => {
    setActive((current) => (current + 1) % SLIDES.length);
  };

  const goTo = (index: number) => {
    setActive(index);
  };

  const activeSlide = SLIDES[active];

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full overflow-hidden">
        {/* Banner Image Area */}
        <div className="relative w-full aspect-[2500/1050] overflow-hidden bg-white sm:min-h-[450px] lg:min-h-[550px] xl:min-h-[650px]">
          {SLIDES.map((slide, index) => {
            const isActive = index === active;

            return (
              <div
                key={slide.image}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-contain object-center sm:object-cover"
                />

                {/* Desktop Content Only */}
                <div className="absolute inset-0 hidden items-center sm:flex">
                  <div className="container mx-auto px-4">
                    <div
                      className={`max-w-[560px] text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.72)] ${
                        slide.align === "center"
                          ? "mx-auto text-center"
                          : "mr-auto text-left"
                      }`}
                    >
                      <h1 className="text-4xl font-bold leading-tight lg:text-6xl">
                        {slide.title}
                      </h1>

                      <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-white/95 lg:text-lg">
                        {slide.text}
                      </p>

                      <div
                        className={`mt-6 flex flex-wrap gap-4 ${
                          slide.align === "center"
                            ? "justify-center"
                            : "justify-start"
                        }`}
                      >
                        <Link
                          href={slide.primaryHref}
                          className="inline-flex items-center gap-2 text-base font-semibold text-white underline underline-offset-8 transition hover:text-brand-100"
                        >
                          {slide.primary}
                          <ArrowRight size={18} />
                        </Link>

                        <Link
                          href={slide.secondaryHref}
                          className="inline-flex items-center text-base font-semibold text-white/90 underline underline-offset-8 transition hover:text-white"
                        >
                          {slide.secondary}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Navigation */}
          <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-lg backdrop-blur-md sm:bottom-5 sm:gap-3 sm:px-4 sm:py-2">
            <button
              onClick={previous}
              aria-label="Previous slide"
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 sm:h-10 sm:w-10"
            >
              <ArrowLeft size={16} />
            </button>

            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all sm:h-2.5 ${
                  index === active
                    ? "w-7 bg-black sm:w-8"
                    : "w-2 bg-gray-400 sm:w-2.5"
                }`}
              />
            ))}

            <button
              onClick={next}
              aria-label="Next slide"
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 sm:h-10 sm:w-10"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Content Below Banner */}
        <div className="block px-4 py-5 text-center sm:hidden">
          <h1 className="text-2xl font-bold leading-tight text-gray-950">
            {activeSlide.title}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed text-gray-600">
            {activeSlide.text}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link
              href={activeSlide.primaryHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-950 underline underline-offset-8"
            >
              {activeSlide.primary}
              <ArrowRight size={16} />
            </Link>

            <Link
              href={activeSlide.secondaryHref}
              className="inline-flex items-center text-sm font-semibold text-gray-700 underline underline-offset-8"
            >
              {activeSlide.secondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}