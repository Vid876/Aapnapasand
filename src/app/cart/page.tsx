"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

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
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl"
            >
              <Link
                href={`/product/${item.slug}`}
                className="relative w-24 h-32 shrink-0 rounded-lg overflow-hidden bg-gray-100"
              >
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.slug}`}>
                  <h3 className="font-medium text-gray-900 hover:text-brand-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  Size: {item.size} | Color: {item.color}
                </p>
                <p className="text-sm font-semibold mt-2">{formatPrice(item.price)}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                      }
                      className="p-2 hover:bg-gray-50"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                      }
                      className="p-2 hover:bg-gray-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-28">
            <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              {subtotal < 999 && (
                <p className="text-xs text-brand-600">
                  Add {formatPrice(999 - subtotal)} more for free shipping
                </p>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">{formatPrice(total)}</span>
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
