"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  Clock,
  Tag,
  Plus,
  TrendingUp,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingOrders: number;
  activeCoupons: number;
}

interface ChartDay {
  date: string;
  label: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  _id: string;
  name: string;
  image: string;
  sold: number;
  revenue: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: { fullName: string };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartDay[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setChartData(data.chartData || []);
        setTopProducts(data.topProducts || []);
        setRecentOrders(data.recentOrders || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  const cards = [
    { label: "Total Revenue", value: formatPrice(stats?.totalRevenue || 0), icon: IndianRupee, color: "bg-green-500" },
    { label: "This Month", value: formatPrice(stats?.monthlyRevenue || 0), icon: TrendingUp, color: "bg-emerald-500" },
    { label: "Orders", value: stats?.totalOrders || 0, icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Pending", value: stats?.pendingOrders || 0, icon: Clock, color: "bg-amber-500" },
    { label: "Products", value: stats?.totalProducts || 0, icon: Package, color: "bg-purple-500" },
    { label: "Active Offers", value: stats?.activeCoupons || 0, icon: Tag, color: "bg-orange-500" },
    { label: "Customers", value: stats?.totalCustomers || 0, icon: Users, color: "bg-pink-500" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage products, orders, and offers</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/coupons"
            className="px-4 py-2 border border-gray-200 bg-white text-sm font-medium rounded-lg hover:bg-gray-50"
          >
            + Add Offer
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { href: "/admin/products/new", label: "Add Product", desc: "Images, price, description", color: "border-brand-200 bg-brand-50" },
          { href: "/admin/coupons", label: "Create Offer", desc: "Discount codes & coupons", color: "border-orange-200 bg-orange-50" },
          { href: "/admin/orders", label: "Manage Orders", desc: "Ship & track orders", color: "border-blue-200 bg-blue-50" },
          { href: "/admin/reviews", label: "Reviews", desc: "Approve customer reviews", color: "border-purple-200 bg-purple-50" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`p-4 rounded-xl border ${action.color} hover:shadow-sm transition-shadow`}
          >
            <p className="font-semibold text-sm">{action.label}</p>
            <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`${card.color} p-2.5 rounded-lg text-white`}>
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold mb-4">Revenue (Last 7 Days)</h2>
          <div className="flex items-end gap-2 h-40">
            {chartData.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-500 font-medium">
                  {day.revenue > 0 ? formatPrice(day.revenue) : ""}
                </span>
                <div
                  className="w-full bg-brand-600 rounded-t-md transition-all min-h-[4px]"
                  style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, 4)}%` }}
                />
                <span className="text-[10px] text-gray-400">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold mb-4">Top Selling</h2>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-sm text-gray-500">No sales data yet</p>
            ) : (
              topProducts.map((p, i) => (
                <div key={p._id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                  <div className="relative w-10 h-12 rounded overflow-hidden bg-gray-100 shrink-0">
                    {p.image && <Image src={p.image} alt="" fill className="object-cover" sizes="40px" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.sold} sold</p>
                  </div>
                  <span className="text-xs font-semibold">{formatPrice(p.revenue)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-800">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <Link href={`/admin/orders/${order._id}`} className="text-brand-600 font-medium hover:underline">
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="p-4">{order.shippingAddress.fullName}</td>
                  <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 capitalize">{order.status}</span>
                  </td>
                  <td className="p-4 capitalize">{order.paymentStatus}</td>
                  <td className="p-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
