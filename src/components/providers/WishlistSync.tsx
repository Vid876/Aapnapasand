"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/store/wishlistStore";

export function WishlistSync() {
  const { status } = useSession();
  const merge = useWishlistStore((state) => state.merge);

  useEffect(() => {
    if (status !== "authenticated") return;
    const controller = new AbortController();

    async function sync() {
      const localItems = useWishlistStore.getState().items;
      if (localItems.length) {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds: localItems }),
          signal: controller.signal,
        });
      }

      const response = await fetch("/api/wishlist", {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) return;
      const data = await response.json();
      merge(data.items || []);
    }

    sync().catch((error) => {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error("Wishlist sync failed:", error);
      }
    });

    return () => controller.abort();
  }, [merge, status]);

  return null;
}
