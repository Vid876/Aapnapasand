"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { CategoryCardMedia } from "./CategoryCardMedia";
import type { Category } from "@/types";

type PublicCategory = Pick<
  Category,
  | "_id"
  | "name"
  | "slug"
  | "description"
  | "image"
  | "gender"
  | "isActive"
>;

interface CategoryGridClientProps {
  categories: PublicCategory[];
}

const INITIAL_CATEGORY_COUNT = 8;

function formatCategoryName(name: string) {
  return name
    .trim()
    .toLocaleLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toLocaleUpperCase());
}

export function CategoryGridClient({
  categories,
}: CategoryGridClientProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleCategories = showAll
    ? categories
    : categories.slice(0, INITIAL_CATEGORY_COUNT);

  const canExpand = categories.length > INITIAL_CATEGORY_COUNT;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {visibleCategories.map((category, index) => (
          <Link
            key={category.slug}
            href={`/shop?category=${category.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-[#ded8cc] bg-white shadow-[0_8px_25px_rgba(23,63,79,0.07)] transition duration-300 hover:-translate-y-1 hover:border-[#c9902e]/60 hover:shadow-[0_18px_45px_rgba(23,63,79,0.15)]"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[#e8ece6] sm:aspect-[4/3]">
              <CategoryCardMedia
                alt={category.name}
                src={category.image}
                priority={index < 4}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#102f3b]/85 via-transparent to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-5">
                <div className="min-w-0">
                  <p className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65 sm:block">
                    Handcrafted Collection
                  </p>

                  <h3 className="mt-1 line-clamp-2 font-display text-base font-semibold leading-tight text-white sm:text-xl">
                    {formatCategoryName(category.name)}
                  </h3>
                </div>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/95 text-[#b87811] shadow-md transition-transform duration-300 group-hover:translate-x-1 sm:h-10 sm:w-10">
                  <ArrowRight size={17} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center sm:mt-10">
        {canExpand ? (
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#173f4f] bg-white px-6 text-sm font-semibold text-[#173f4f] shadow-sm transition hover:bg-[#173f4f] hover:text-white"
          >
            {showAll ? "Show fewer categories" : "View all categories"}

            <ChevronDown
              size={17}
              className={`transition-transform duration-300 ${
                showAll ? "rotate-180" : ""
              }`}
            />
          </button>
        ) : (
          <Link
            href="/shop"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#173f4f] px-6 text-sm font-semibold text-white transition hover:bg-[#245d70]"
          >
            Shop all products
            <ArrowRight size={17} />
          </Link>
        )}
      </div>
    </>
  );
}