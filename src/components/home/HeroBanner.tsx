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

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full overflow-hidden">
        {/* Banner Container */}
        <div className="relative w-full min-h-[430px] overflow-hidden bg-white sm:aspect-[2500/1050] sm:min-h-[450px] lg:min-h-[550px] xl:min-h-[650px]">
          {SLIDES.map((slide, index) => {
            const isActive = index === active;

            return (
              <div
                key={slide.image}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  isActive ? "z-10 opacity-100" : "z-0 opacity-0"
                }`}
              >
                {/* Banner Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />

                {/* Overlay for text readability */}
                <div className="absolute inset-0 bg-black/25 sm:bg-black/10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/35 sm:bg-gradient-to-r sm:from-black/35 sm:via-black/10 sm:to-transparent" />

                {/* Content on Banner */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div
                      className={`mx-auto max-w-[330px] text-center text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.75)] sm:max-w-[560px] ${
                        slide.align === "center"
                          ? "sm:mx-auto sm:text-center"
                          : "sm:mr-auto sm:ml-0 sm:text-left"
                      }`}
                    >
                      <h1 className="text-[24px] font-bold leading-[1.15] sm:text-4xl lg:text-6xl">
                        {slide.title}
                      </h1>

                      <p className="mx-auto mt-3 max-w-[310px] text-[12px] font-medium leading-relaxed text-white/95 sm:mx-0 sm:max-w-xl sm:text-base lg:mt-4 lg:text-lg">
                        {slide.text}
                      </p>

                      <div
                        className={`mt-4 flex flex-wrap justify-center gap-2 sm:mt-6 sm:gap-4 ${
                          slide.align === "center"
                            ? "sm:justify-center"
                            : "sm:justify-start"
                        }`}
                      >
                        <Link
                          href={slide.primaryHref}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white bg-white px-4 py-2 text-[12px] font-semibold text-black shadow-md transition hover:bg-black hover:text-white sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
                        >
                          {slide.primary}
                          <ArrowRight size={15} />
                        </Link>

                        <Link
                          href={slide.secondaryHref}
                          className="inline-flex items-center justify-center rounded-full border border-white/80 bg-black/35 px-4 py-2 text-[12px] font-semibold text-white shadow-md backdrop-blur-sm transition hover:bg-white hover:text-black sm:px-6 sm:py-3 sm:text-sm"
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
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 shadow-lg backdrop-blur-md sm:bottom-5 sm:gap-3 sm:px-4 sm:py-2">
            <button
              onClick={previous}
              aria-label="Previous slide"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-black hover:bg-gray-100 sm:h-10 sm:w-10"
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
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-black hover:bg-gray-100 sm:h-10 sm:w-10"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}