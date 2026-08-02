"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types";

export function WishlistProducts({ compactTitle = false }: { compactTitle?: boolean }) {
  const items = useWishlistStore((state) => state.items);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const stableIds = useMemo(() => [...new Set(items)], [items]);
  const idsKey = stableIds.join(",");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWishlistProducts() {
      if (!stableIds.length) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const batches: string[][] = [];
        for (let index = 0; index < stableIds.length; index += 100) {
          batches.push(stableIds.slice(index, index + 100));
        }
        const responses = await Promise.all(
          batches.map(async (batch) => {
            const params = new URLSearchParams({ ids: batch.join(","), limit: "100" });
            const response = await fetch(`/api/products?${params}`, {
              cache: "no-store",
              signal: controller.signal,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Unable to load wishlist");
            return (data.products || []) as Product[];
          })
        );
        const productMap = new Map(
          responses.flat().map((product) => [product._id, product])
        );
        setProducts(
          stableIds
            .map((id) => productMap.get(id))
            .filter((product): product is Product => Boolean(product))
        );
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
        setProducts([]);
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load wishlist");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchWishlistProducts();
    return () => controller.abort();
  }, [idsKey, stableIds]);

  if (loading) {
    return <div className="py-16 text-center text-stone-500">Loading wishlist...</div>;
  }

  if (!stableIds.length) {
    return (
      <div className="rounded-2xl bg-stone-50 py-16 text-center">
        <Heart className="mx-auto mb-5 text-gray-300" size={56} />
        <h2 className="font-display text-2xl font-bold">Your wishlist is empty</h2>
        <p className="mb-7 mt-2 text-gray-500">Save items you love for later.</p>
        <Link href="/shop">
          <Button size="lg">Explore Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {!compactTitle ? (
        <h1 className="mb-8 font-display text-3xl font-bold">
          Wishlist ({stableIds.length})
        </h1>
      ) : null}
      {error ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {products.length !== stableIds.length ? (
        <p className="mb-5 text-sm text-stone-500">
          {products.length} available item{products.length === 1 ? "" : "s"} shown. Unavailable saved items remain in your wishlist.
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
