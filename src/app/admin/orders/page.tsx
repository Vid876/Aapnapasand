"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

const STATUS_OPTIONS = ["", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = statusFilter ? `?status=${statusFilter}` : "";
    fetch(`/api/admin/orders${params}`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All Statuses"}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-gray-500">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="p-4 font-medium">Order #</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <Link href={`/admin/orders/${order._id}`} className="text-brand-600 font-medium hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="p-4">{order.shippingAddress.fullName}</td>
                  <td className="p-4">{order.items.length}</td>
                  <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 capitalize">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 capitalize">{order.paymentStatus}</td>
                  <td className="p-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
