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
        <div className="relative w-full aspect-[2500/1050] overflow-hidden bg-[#f7eee9] sm:min-h-[450px] lg:min-h-[550px] xl:min-h-[650px]">
          {SLIDES.map((slide, index) => {
            const isActive = index === active;

            return (
              <div
                key={slide.image}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  isActive ? "z-10 opacity-100" : "z-0 opacity-0"
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

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10 sm:bg-black/25" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25 sm:bg-gradient-to-r sm:from-black/40 sm:via-black/15 sm:to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-3 sm:px-4">
                    <div
                      className={`mx-auto max-w-[245px] rounded-xl border border-white/35 bg-black/25 px-3 py-2 text-center text-white shadow-lg backdrop-blur-[2px] sm:max-w-[560px] sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-0 ${
                        slide.align === "center"
                          ? "sm:mx-auto sm:text-center"
                          : "sm:mr-auto sm:ml-0 sm:text-left"
                      }`}
                    >
                      <h1 className="text-[15px] font-bold leading-[1.12] sm:text-4xl lg:text-6xl">
                        {slide.title}
                      </h1>

                      <p className="mx-auto mt-1.5 max-w-[220px] text-[8.5px] font-medium leading-[1.35] text-white/95 sm:mx-0 sm:mt-4 sm:max-w-xl sm:text-base sm:leading-relaxed lg:text-lg">
                        {slide.text}
                      </p>

                      <div
                        className={`mt-2 flex flex-wrap justify-center gap-1.5 sm:mt-7 sm:gap-4 ${
                          slide.align === "center"
                            ? "sm:justify-center"
                            : "sm:justify-start"
                        }`}
                      >
                        <Link
                          href={slide.primaryHref}
                          className="inline-flex items-center justify-center gap-1 rounded-full border border-[#3A1D14] bg-[#3A1D14] px-2.5 py-1.5 text-[8.5px] font-semibold text-white shadow-md transition-all duration-300 hover:bg-white hover:text-[#3A1D14] sm:gap-2 sm:px-7 sm:py-3 sm:text-sm lg:text-base"
                        >
                          {slide.primary}
                          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Link>

                        <Link
                          href={slide.secondaryHref}
                          className="inline-flex items-center justify-center rounded-full border border-[#3A1D14] bg-[#F8E7DA] px-2.5 py-1.5 text-[8.5px] font-semibold text-[#3A1D14] shadow-md transition-all duration-300 hover:bg-[#3A1D14] hover:text-white sm:px-7 sm:py-3 sm:text-sm lg:text-base"
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
          <div className="absolute bottom-1.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/70 bg-white/90 px-2 py-1 shadow-lg backdrop-blur-md sm:bottom-6 sm:gap-3 sm:px-4 sm:py-2">
            <button
              onClick={previous}
              aria-label="Previous slide"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-[#3A1D14]/20 bg-white text-[#3A1D14] hover:bg-[#3A1D14] hover:text-white sm:h-10 sm:w-10"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>

            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all sm:h-2.5 ${
                  index === active
                    ? "w-5 bg-[#3A1D14] sm:w-8"
                    : "w-1.5 bg-gray-400 sm:w-2.5"
                }`}
              />
            ))}

            <button
              onClick={next}
              aria-label="Next slide"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-[#3A1D14]/20 bg-white text-[#3A1D14] hover:bg-[#3A1D14] hover:text-white sm:h-10 sm:w-10"
            >
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}