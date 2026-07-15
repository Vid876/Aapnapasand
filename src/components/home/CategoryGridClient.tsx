"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { CategoryCardMedia } from "./CategoryCardMedia";
import type { Category } from "@/types";

type PublicCategory = Pick<
  Category,
  "_id" | "name" | "slug" | "description" | "image" | "gender" | "isActive"
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

export function CategoryGridClient({ categories }: CategoryGridClientProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleCategories = showAll ? categories : categories.slice(0, INITIAL_CATEGORY_COUNT);
  const canExpand = categories.length > INITIAL_CATEGORY_COUNT;

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/shop?category=${category.slug}`}
            className="group overflow-hidden rounded-[1.15rem] border border-[#ded8cc] bg-white shadow-[0_8px_30px_rgba(23,63,79,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#c9902e]/45 hover:shadow-[0_18px_44px_rgba(23,63,79,0.12)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#e8ece6]">
              <CategoryCardMedia alt={category.name} src={category.image} />
            </div>
            <div className="flex min-h-16 items-center justify-between gap-4 px-5 py-4">
              <h3 className="font-display text-lg font-semibold leading-tight text-[#173f4f]">
                {formatCategoryName(category.name)}
              </h3>
              <ArrowRight
                size={19}
                className="shrink-0 text-[#b87811] transition-transform duration-300 group-hover:translate-x-1"
              />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex justify-start">
        {canExpand ? (
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="group inline-flex min-h-11 items-center justify-center gap-2 border-b border-[#173f4f]/50 pb-1 text-sm font-semibold text-[#173f4f] transition-colors hover:border-[#c9902e] hover:text-[#9a620b]"
          >
            {showAll ? "Show fewer categories" : "View all categories"}
            <ChevronDown
              size={16}
              className={`transition-transform ${showAll ? "rotate-180" : ""}`}
            />
          </button>
        ) : (
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center justify-center gap-2 border-b border-[#173f4f]/50 pb-1 text-sm font-semibold text-[#173f4f] transition-colors hover:border-[#c9902e] hover:text-[#9a620b]"
          >
            Shop all products
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </>
  );
}
