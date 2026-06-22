"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggle, has } = useWishlistStore();
  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const isWishlisted = has(product._id);

  return (
    <div className="group relative">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
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
        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={18}
          className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}
        />
      </button>

      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-brand-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
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
