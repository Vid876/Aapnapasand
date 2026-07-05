"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
          setStatus(data.order.status);
          setTrackingNumber(data.order.trackingNumber || "");
        }
      });
  }, [id]);

  const handleUpdate = async (opts?: { generateTracking?: boolean }) => {
    setSaving(true);
    setMessage("");
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        trackingNumber: trackingNumber || undefined,
        generateTracking: opts?.generateTracking,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setOrder(data.order);
      setTrackingNumber(data.order.trackingNumber || "");
      setStatus(data.order.status);
      setMessage("Order updated successfully");
    } else {
      setMessage(data.error || "Update failed");
    }
    setSaving(false);
  };

  const handleShip = async () => {
    setSaving(true);
    setMessage("");
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "shipped", generateTracking: true }),
    });
    const data = await res.json();
    if (res.ok) {
      setOrder(data.order);
      setTrackingNumber(data.order.trackingNumber || "");
      setStatus("shipped");
      setMessage("Order shipped! SMS sent to customer.");
    } else {
      setMessage(data.error || "Failed to ship order");
    }
    setSaving(false);
  };

  if (!order) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/orders" className="text-sm text-brand-600 hover:underline">
        &larr; Back to orders
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Order #{order.orderNumber}</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold mb-4">Items</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="relative w-16 h-20 rounded overflow-hidden bg-gray-100 shrink-0">
                    <Image src={item.image} alt="" fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.size} | {item.color} x{item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity, item.currency)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold mb-3">Shipping Address</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 && <>, {order.shippingAddress.addressLine2}</>}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal, order.currency)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{formatPrice(order.shippingCost, order.currency)}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount, order.currency)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatPrice(order.tax, order.currency)}</span></div>
              <div className="flex justify-between font-bold pt-2 border-t"><span>Total</span><span>{formatPrice(order.total, order.currency)}</span></div>
            </div>
            <p className="text-xs text-gray-500 mt-3 capitalize">
              Payment: {order.paymentMethod} ({order.paymentStatus})
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h2 className="font-semibold">Update Order</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tracking Number</label>
              <div className="flex gap-2">
                <input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Auto-generated on ship"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleUpdate({ generateTracking: true })}
                  className="px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                >
                  Generate
                </button>
              </div>
            </div>
            {message && (
              <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdate()}
                disabled={saving}
                className="flex-1 py-2.5 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Update Order"}
              </button>
              {status !== "shipped" && status !== "delivered" && (
                <button
                  onClick={handleShip}
                  disabled={saving}
                  className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Ship Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
