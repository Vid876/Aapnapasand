"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Coupon {
  _id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minOrderAmount: "0",
    maxDiscount: "",
    usageLimit: "",
    expiresAt: "",
  });

  const fetchCoupons = () => {
    fetch("/api/admin/coupons")
      .then((res) => res.json())
      .then((data) => setCoupons(data.coupons || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        description: form.description || undefined,
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        minOrderAmount: parseFloat(form.minOrderAmount) || 0,
        maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
        expiresAt: form.expiresAt || undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }

    setShowForm(false);
    setForm({ code: "", description: "", discountType: "percentage", discountValue: "", minOrderAmount: "0", maxDiscount: "", usageLimit: "", expiresAt: "" });
    fetchCoupons();
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchCoupons();
  };

  const deleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    fetchCoupons();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Offers & Coupons</h1>
          <p className="text-sm text-gray-500 mt-1">Create discount codes for customers at checkout</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800"
        >
          <Plus size={16} /> Create Offer
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-100 p-6 mb-6 space-y-4">
          <h2 className="font-semibold">New Offer / Coupon</h2>
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Coupon Code *</label>
              <input
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER20"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type *</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value as "percentage" | "fixed" })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Value * {form.discountType === "percentage" ? "(%)" : "(₹)"}
              </label>
              <input
                required
                type="number"
                min="0"
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                placeholder={form.discountType === "percentage" ? "10" : "200"}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Order Amount (₹)</label>
              <input
                type="number"
                min="0"
                value={form.minOrderAmount}
                onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg"
              />
            </div>
            {form.discountType === "percentage" && (
              <div>
                <label className="block text-sm font-medium mb-1">Max Discount Cap (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={form.maxDiscount}
                  onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                  placeholder="500"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Usage Limit</label>
              <input
                type="number"
                min="1"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                placeholder="Unlimited"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expires On</label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="10% off on summer collection"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg"
            />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-brand-900 text-white rounded-lg text-sm font-medium">
              Create Coupon
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-gray-500">Loading...</p>
        ) : coupons.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No coupons yet. Create your first offer!</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Discount</th>
                <th className="p-4 font-medium">Min Order</th>
                <th className="p-4 font-medium">Used</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <span className="font-mono font-bold text-brand-600">{coupon.code}</span>
                    {coupon.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{coupon.description}</p>
                    )}
                  </td>
                  <td className="p-4 font-medium">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : formatPrice(coupon.discountValue)}
                    {coupon.maxDiscount && (
                      <span className="text-xs text-gray-400 block">max {formatPrice(coupon.maxDiscount)}</span>
                    )}
                  </td>
                  <td className="p-4">{formatPrice(coupon.minOrderAmount)}</td>
                  <td className="p-4">
                    {coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                  </td>
                  <td className="p-4">
                    <button onClick={() => toggleActive(coupon._id, coupon.isActive)}>
                      {coupon.isActive ? (
                        <ToggleRight size={24} className="text-green-600" />
                      ) : (
                        <ToggleLeft size={24} className="text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => deleteCoupon(coupon._id, coupon.code)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
