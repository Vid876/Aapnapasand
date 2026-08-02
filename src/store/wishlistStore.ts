"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[];
  toggle: (productId: string) => boolean;
  has: (productId: string) => boolean;
  merge: (productIds: string[]) => void;
  replace: (productIds: string[]) => void;
}

function uniqueIds(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (productId) => {
        const wasSaved = get().items.includes(productId);
        set((state) => ({
          items: wasSaved
            ? state.items.filter((id) => id !== productId)
            : uniqueIds([...state.items, productId]),
        }));

        fetch(`/api/wishlist?productId=${encodeURIComponent(productId)}`, {
          method: wasSaved ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: wasSaved ? undefined : JSON.stringify({ productId }),
        }).catch(() => undefined);

        return !wasSaved;
      },

      has: (productId) => get().items.includes(productId),
      merge: (productIds) =>
        set((state) => ({ items: uniqueIds([...state.items, ...productIds]) })),
      replace: (productIds) => set({ items: uniqueIds(productIds) }),
    }),
    {
      name: "bohoblockprinted-wishlist",
      version: 2,
    }
  )
);
