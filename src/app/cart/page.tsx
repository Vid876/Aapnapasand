"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { CartItem, Product } from "@/types";

type CartProductOptions = Pick<Product, "_id" | "slug" | "price" | "variants">;

function getUniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function resolveSelection(product: CartProductOptions, size: string, color: string) {
  const variant =
    product.variants.find((item) => item.size === size && item.color === color && item.stock > 0) ||
    product.variants.find((item) => item.size === size && item.stock > 0) ||
    product.variants.find((item) => item.color === color && item.stock > 0) ||
    product.variants.find((item) => item.size === size && item.color === color) ||
    product.variants[0];

  return {
    size: variant?.size || size,
    color: variant?.color || color,
    price: variant?.price ?? product.price,
  };
}

export default function CartPage() {
  const { items, updateQuantity, updateItemOptions, removeItem, getSubtotal } = useCartStore();
  const [cartProducts, setCartProducts] = useState<Record<string, CartProductOptions>>({});
  const cartCurrency = items[0]?.currency || "INR";
  const subtotal = getSubtotal();
  const freeShippingThreshold = cartCurrency === "USD" ? 75 : 999;
  const shippingCharge = cartCurrency === "USD" ? 8 : 99;
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingCharge;
  const total = subtotal + shipping;

  useEffect(() => {
    let cancelled = false;
    const slugs = getUniqueValues(items.map((item) => item.slug));

    if (slugs.length === 0) {
      setCartProducts({});
      return;
    }

    async function fetchCartProducts() {
      const responses = await Promise.all(
        slugs.map(async (slug) => {
          try {
            const res = await fetch(`/api/products/${slug}`);
            const data = await res.json();
            return data.product as CartProductOptions | undefined;
          } catch {
            return undefined;
          }
        })
      );

      if (cancelled) return;

      setCartProducts(
        responses.reduce<Record<string, CartProductOptions>>((acc, product) => {
          if (product?._id) acc[product._id] = product;
          return acc;
        }, {})
      );
    }

    fetchCartProducts();

    return () => {
      cancelled = true;
    };
  }, [items]);

  const handleOptionChange = (
    item: CartItem,
    field: "size" | "color",
    value: string
  ) => {
    const product = cartProducts[item.productId];
    const nextSelection = product
      ? resolveSelection(
          product,
          field === "size" ? value : item.size,
          field === "color" ? value : item.color
        )
      : {
          size: field === "size" ? value : item.size,
          color: field === "color" ? value : item.color,
          price: item.price,
        };

    updateItemOptions(item.productId, item.size, item.color, nextSelection);
  };

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <ShoppingBag className="mx-auto mb-6 text-gray-300" size={64} />
        <h1 className="text-2xl font-display font-bold mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop">
          <Button size="lg">
            Start Shopping
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-8 lg:py-12">
      <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const productOptions = cartProducts[item.productId];
            const sizeOptions = productOptions
              ? getUniqueValues(productOptions.variants.map((variant) => variant.size))
              : [];
            const colorOptions = productOptions
              ? getUniqueValues(productOptions.variants.map((variant) => variant.color))
              : [];

            return (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100"
                >
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="font-medium text-gray-900 hover:text-brand-600 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>
                  {productOptions ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Size
                        <select
                          value={item.size}
                          onChange={(e) => handleOptionChange(item, "size", e.target.value)}
                          className="mt-1 block rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-gray-800"
                        >
                          {sizeOptions.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Color
                        <select
                          value={item.color}
                          onChange={(e) => handleOptionChange(item, "color", e.target.value)}
                          className="mt-1 block rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-gray-800"
                        >
                          {colorOptions.map((color) => (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">
                      Size: {item.size} | Color: {item.color}
                    </p>
                  )}
                  <p className="text-sm font-semibold mt-3">{formatPrice(item.price, item.currency)}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-50"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="font-semibold">{formatPrice(item.price * item.quantity, item.currency)}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-28">
            <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal, cartCurrency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? "FREE" : formatPrice(shipping, cartCurrency)}
                </span>
              </div>
              {subtotal < freeShippingThreshold && (
                <p className="text-xs text-brand-600">
                  Add {formatPrice(freeShippingThreshold - subtotal, cartCurrency)} more for free shipping
                </p>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">{formatPrice(total, cartCurrency)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block mt-6">
              <Button size="lg" className="w-full">
                Proceed to Checkout
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>

            <Link
              href="/shop"
              className="block text-center text-sm text-brand-600 hover:text-brand-800 mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
