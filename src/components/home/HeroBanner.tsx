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
                quality={100}
                sizes="100vw"
                className="object-cover object-center"
              />

              {/* Overlay */}
              <div
                className={`absolute inset-0 ${
                  slide.tone === "light"
                    ? "bg-[linear-gradient(90deg,rgba(47,25,18,0.35),rgba(47,25,18,0.05)_25%,rgba(255,255,255,0.55)_50%,rgba(47,25,18,0.05)_75%,rgba(47,25,18,0.25))]"
                    : "bg-[linear-gradient(90deg,rgba(255,243,235,0.88),rgba(255,243,235,0.70)_35%,rgba(255,243,235,0.10)_60%,rgba(47,25,18,0.12))]"
                }`}
              />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div
                    className={`max-w-[550px] rounded-3xl p-6 sm:p-8 lg:p-10 ${
                      slide.align === "center"
                        ? "mx-auto text-center"
                        : "mr-auto text-left"
                    } ${
                      slide.tone === "light"
                        ? "bg-white/75 text-gray-900 backdrop-blur-md"
                        : "bg-black/60 text-white backdrop-blur-md"
                    }`}
                  >
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                      {slide.title}
                    </h1>

                    <p
                      className={`mt-4 text-sm sm:text-base lg:text-lg leading-relaxed ${
                        slide.tone === "light"
                          ? "text-gray-700"
                          : "text-gray-200"
                      }`}
                    >
                      {slide.text}
                    </p>

                    <div
                      className={`mt-6 flex flex-wrap gap-3 ${
                        slide.align === "center"
                          ? "justify-center"
                          : "justify-start"
                      }`}
                    >
                      <Link
                        href={slide.primaryHref}
                        className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition ${
                          slide.tone === "light"
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-white text-black hover:bg-gray-100"
                        }`}
                      >
                        {slide.primary}
                        <ArrowRight size={18} />
                      </Link>

                      <Link
                        href={slide.secondaryHref}
                        className={`hidden sm:inline-flex items-center rounded-lg border px-6 py-3 font-semibold transition ${
                          slide.tone === "light"
                            ? "border-black text-black hover:bg-black/5"
                            : "border-white text-white hover:bg-white/10"
                        }`}
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