"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (items.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/products?limit=50");
        const data = await res.json();
        const wishlistProducts = (data.products || []).filter((p: Product) =>
          items.includes(p._id)
        );
        setProducts(wishlistProducts);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlistProducts();
  }, [items]);

  if (loading) {
    return <div className="container-app py-20 text-center">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <Heart className="mx-auto mb-6 text-gray-300" size={64} />
        <h1 className="text-2xl font-display font-bold mb-3">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-8">Save items you love for later.</p>
        <Link href="/shop">
          <Button size="lg">Explore Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-8 lg:py-12">
      <h1 className="text-3xl font-display font-bold mb-8">
        Wishlist ({items.length})
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
