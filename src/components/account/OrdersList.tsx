"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export function OrdersList({ limit }: { limit?: number }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/orders", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load orders");
        return data;
      })
      .then((data) => setOrders(data.orders || []))
      .catch((fetchError) => {
        if (!(fetchError instanceof DOMException && fetchError.name === "AbortError")) {
          setError(fetchError instanceof Error ? fetchError.message : "Unable to load orders");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  if (loading) return <div className="py-14 text-center text-stone-500">Loading orders...</div>;
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>;

  const visibleOrders = limit ? orders.slice(0, limit) : orders;
  if (!orders.length) {
    return (
      <div className="rounded-xl bg-gray-50 py-12 text-center">
        <Package className="mx-auto mb-4 text-gray-300" size={48} />
        <p className="mb-4 text-gray-500">No orders yet</p>
        <Link href="/shop" className="font-medium text-[#173f4f] hover:underline">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visibleOrders.map((order) => (
        <article key={order._id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-[#173f4f]">#{order.orderNumber}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium capitalize text-green-700">
              {order.status}
            </span>
          </div>
          <div className="mt-4 border-t border-stone-100 pt-4">
            <p className="text-sm text-stone-600">
              {order.items.length} item{order.items.length === 1 ? "" : "s"}
            </p>
            <p className="mt-1 text-sm font-semibold">
              {formatPrice(order.total, order.currency)}
            </p>
          </div>
        </article>
      ))}
      {limit && orders.length > limit ? (
        <Link href="/account/orders" className="inline-flex font-semibold text-[#173f4f] hover:underline">
          View all {orders.length} orders
        </Link>
      ) : null}
    </div>
  );
}
