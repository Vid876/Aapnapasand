"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { CategoryCardMedia } from "./CategoryCardMedia";
import type { Category } from "@/types";

type PublicCategory = Pick<
  Category,
  "_id" | "name" | "slug" | "description" | "image" | "gender" | "isActive"
>;

interface CategoryGridClientProps {
  categories: PublicCategory[];
}

const INITIAL_CATEGORY_COUNT = 6;

export function CategoryGridClient({ categories }: CategoryGridClientProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleCategories = showAll ? categories : categories.slice(0, INITIAL_CATEGORY_COUNT);
  const canExpand = categories.length > INITIAL_CATEGORY_COUNT;

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/shop?category=${category.slug}`}
            className="group relative min-h-[280px] overflow-hidden rounded-xl bg-brand-50 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-950/10 sm:min-h-[320px] lg:min-h-[360px]"
          >
            <CategoryCardMedia alt={category.name} src={category.image} />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/78 via-brand-950/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-sm font-semibold text-white lg:text-base">
                {category.name}
              </h3>
              <p className="mt-1 text-xs text-white/75">Explore styles</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-9 flex justify-center">
        {canExpand ? (
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-brand-900 px-6 py-3 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
          >
            {showAll ? "Show Less" : "View All"}
            <ChevronDown
              size={16}
              className={`transition-transform ${showAll ? "rotate-180" : ""}`}
            />
          </button>
        ) : (
          <Link
            href="/collections"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-brand-900 px-6 py-3 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
          >
            View All
            <ChevronDown size={16} className="-rotate-90" />
          </Link>
        )}
      </div>
    </>
  );
}
