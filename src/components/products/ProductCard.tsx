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
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggle, has } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const isWishlisted = mounted ? has(product._id) : false;
  const alternateImage = product.images[1];
  const displayBrand =
    product.brand?.toUpperCase().includes("BOHOBLOCKPRINTED")
      ? product.brand
      : "BOHOBLOCKPRINTED";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="group relative rounded-lg transition duration-300 hover:-translate-y-1">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg shadow-sm transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-brand-950/10">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            className={`object-cover transition duration-700 group-hover:scale-105 ${
              alternateImage ? "group-hover:opacity-0" : ""
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {alternateImage && (
            <ProductImage
              src={alternateImage}
              alt={product.name}
              className="object-cover opacity-0 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              {discount}% OFF
            </span>
          )}
          {product.totalStock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold text-sm uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggle(product._id);
        }}
        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition duration-300 hover:bg-white hover:scale-105 sm:opacity-0 sm:translate-y-1 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={18}
          className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}
        />
      </button>

      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{displayBrand}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-brand-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.compareAtPrice, product.currency)}
            </span>
          )}
        </div>
        {product.rating > 0 && (
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-500">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
