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
      {/* Banner Container */}
      <div className="relative w-full aspect-[2500/1050] min-h-[350px] sm:min-h-[450px] lg:min-h-[550px] xl:min-h-[650px] overflow-hidden">

        {SLIDES.map((slide, index) => {
          const isActive = index === active;

          return (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
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

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div
                    className={`max-w-[560px] text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.72)] ${
                      slide.align === "center"
                        ? "mx-auto text-center"
                        : "mr-auto text-left"
                    }`}
                  >
                    <h1 className="text-2xl font-bold leading-tight sm:text-4xl lg:text-6xl">
                      {slide.title}
                    </h1>

                    <p className="mt-3 max-w-xl text-xs font-medium leading-relaxed text-white/95 sm:text-base lg:mt-4 lg:text-lg">
                      {slide.text}
                    </p>

                    <div
                      className={`mt-5 flex flex-wrap gap-4 sm:mt-6 ${
                        slide.align === "center"
                          ? "justify-center"
                          : "justify-start"
                      }`}
                    >
                      <Link
                        href={slide.primaryHref}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white underline underline-offset-8 transition hover:text-brand-100 sm:text-base"
                      >
                        {slide.primary}
                        <ArrowRight size={18} />
                      </Link>

                      <Link
                        href={slide.secondaryHref}
                        className="hidden items-center text-sm font-semibold text-white/90 underline underline-offset-8 transition hover:text-white sm:inline-flex sm:text-base"
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
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-lg backdrop-blur-md">
          <button
            onClick={previous}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
          </button>

          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === active
                  ? "w-8 bg-black"
                  : "w-2.5 bg-gray-400"
              }`}
            />
          ))}

          <button
            onClick={next}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
