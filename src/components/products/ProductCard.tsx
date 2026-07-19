"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { ProductImage } from "@/components/products/ProductImage";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const { toggle, has } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  const discount = calculateDiscount(
    product.price,
    product.compareAtPrice
  );

  const isWishlisted = mounted
    ? has(product._id)
    : false;

  const primaryImage = product.images[0];
  const alternateImage = product.images[1];

  const categoryName =
    typeof product.category === "string"
      ? product.subcategory || "Artisan textile"
      : product.category?.name ||
        product.subcategory ||
        "Artisan textile";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#ded8cc] bg-white shadow-[0_8px_25px_rgba(23,63,79,0.07)] transition duration-300 hover:-translate-y-1 hover:border-[#c9902e]/60 hover:shadow-[0_18px_45px_rgba(23,63,79,0.15)]">
      <Link
        href={`/product/${product.slug}`}
        className="block"
      >
        {/*
         * Fixed 4:3 image grid.
         * object-cover image ko poora area fill karega.
         * Koi padding ya khaali gray area nahi rahega.
         */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e8ece6]">
          <ProductImage
            src={primaryImage}
            alt={product.name}
            priority={priority}
            className={`object-cover transition duration-700 ease-out group-hover:scale-105 ${
              alternateImage
                ? "group-hover:opacity-0"
                : ""
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {alternateImage && (
            <ProductImage
              src={alternateImage}
              alt={`${product.name} alternate view`}
              className="object-cover opacity-0 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#102f3b]/15 via-transparent to-transparent" />

          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-md border border-[#e7c882] bg-[#fff7e7]/95 px-2 py-1 text-[11px] font-semibold text-[#8a5708] shadow-sm backdrop-blur-sm">
              {discount}% OFF
            </span>
          )}

          {product.totalStock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45">
              <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#173f4f]">
                Sold Out
              </span>
            </div>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          toggle(product._id);
        }}
        className="absolute right-3 top-3 z-10 rounded-full border border-white/70 bg-white/90 p-2 shadow-md backdrop-blur-sm transition duration-300 hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173f4f]"
        aria-label={
          isWishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
      >
        <Heart
          size={18}
          className={
            isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-gray-600"
          }
        />
      </button>

      <div className="flex min-w-0 flex-1 flex-col px-3.5 py-4 sm:px-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f776f] sm:text-xs">
          {categoryName}
        </p>

        <Link
          href={`/product/${product.slug}`}
          className="mt-1"
        >
          <h3 className="line-clamp-2 min-h-10 break-words text-sm font-semibold leading-5 text-[#173f4f] transition-colors hover:text-[#9a620b]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {formatPrice(
                product.price,
                product.currency
              )}
            </span>

            {product.compareAtPrice &&
              product.compareAtPrice >
                product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(
                    product.compareAtPrice,
                    product.currency
                  )}
                </span>
              )}
          </div>

          {product.rating > 0 && (
            <div className="mt-2 flex items-center gap-1">
              <Star
                size={12}
                className="fill-yellow-400 text-yellow-400"
              />

              <span className="text-xs text-gray-500">
                {product.rating.toFixed(1)} (
                {product.reviewCount})
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}