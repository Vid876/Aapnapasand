"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string, fabric?: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number, fabric?: string) => void;
  updateItemOptions: (
    productId: string,
    currentSize: string,
    currentColor: string,
    next: { size: string; color: string; price?: number; fabric?: string },
    currentFabric?: string
  ) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.size === item.size &&
              i.color === item.color &&
              (i.fabric || "") === (item.fabric || "")
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + item.quantity,
            };
            return { items: updated };
          }

          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId, size, color, fabric) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.productId === productId &&
                i.size === size &&
                i.color === color &&
                (i.fabric || "") === (fabric || "")
              )
          ),
        }));
      },

      updateQuantity: (productId, size, color, quantity, fabric) => {
        if (quantity < 1) {
          get().removeItem(productId, size, color, fabric);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId &&
            i.size === size &&
            i.color === color &&
            (i.fabric || "") === (fabric || "")
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      updateItemOptions: (productId, currentSize, currentColor, next, currentFabric) => {
        set((state) => {
          const currentIndex = state.items.findIndex(
            (i) =>
              i.productId === productId &&
              i.size === currentSize &&
              i.color === currentColor &&
              (i.fabric || "") === (currentFabric || "")
          );

          if (currentIndex === -1) return state;

          const items = [...state.items];
          const currentItem = items[currentIndex];
          const nextSize = next.size || currentItem.size;
          const nextColor = next.color || currentItem.color;
          const nextPrice = next.price ?? currentItem.price;
          const nextFabric = next.fabric ?? currentItem.fabric;

          const duplicateIndex = items.findIndex(
            (i, index) =>
              index !== currentIndex &&
              i.productId === productId &&
              i.size === nextSize &&
              i.color === nextColor &&
              (i.fabric || "") === (nextFabric || "")
          );

          if (duplicateIndex > -1) {
            items[duplicateIndex] = {
              ...items[duplicateIndex],
              price: nextPrice,
              quantity: items[duplicateIndex].quantity + currentItem.quantity,
            };
            items.splice(currentIndex, 1);
            return { items };
          }

          items[currentIndex] = {
            ...currentItem,
            size: nextSize,
            color: nextColor,
            fabric: nextFabric,
            price: nextPrice,
          };
          return { items };
        });
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: "bohoblockprinted-cart" }
  )
);

