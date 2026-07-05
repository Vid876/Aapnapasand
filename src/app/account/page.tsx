"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, Heart, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => setOrders(data.orders || []))
        .catch(() => {});
    }
  }, [session]);

  if (status === "loading") {
    return <div className="container-app py-20 text-center">Loading...</div>;
  }

  if (!session) return null;

  return (
    <div className="container-app py-8 lg:py-12">
      <h1 className="text-3xl font-display font-bold mb-8">My Account</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="space-y-1">
          <div className="p-4 bg-brand-50 rounded-xl mb-4">
            <p className="font-semibold">{session.user.name}</p>
            <p className="text-sm text-gray-500">{session.user.email}</p>
          </div>
          <nav className="space-y-1">
            <Link
              href="/account"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-brand-900 text-white text-sm font-medium"
            >
              <User size={18} /> Profile
            </Link>
            <Link
              href="/account/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
            >
              <Package size={18} /> Orders
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
            >
              <Heart size={18} /> Wishlist
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-red-600 w-full"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </nav>
        </aside>

        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Package className="mx-auto mb-4 text-gray-300" size={48} />
              <p className="text-gray-500 mb-4">No orders yet</p>
              <Link href="/shop" className="text-brand-600 font-medium hover:text-brand-800">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order._id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium">#{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full capitalize">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(order.total, order.currency)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
