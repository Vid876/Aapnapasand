"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  Tag,
  Plus,
  TrendingUp,
  Grid3X3,
  MessageSquare,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { CurrencyCode } from "@/types";

/* ==========================================
   DASHBOARD CURRENCY
   Force all dashboard prices to USD
========================================== */
const DASHBOARD_CURRENCY: CurrencyCode = "USD";

/* ==========================================
   TYPES
========================================== */

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingOrders: number;
  activeCoupons: number;
  totalCategories: number;
  activeCategories: number;
  totalInquiries: number;
  newInquiries: number;
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
  currency?: CurrencyCode;
  status: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: {
    fullName: string;
  };
}

interface RecentInquiry {
  _id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  productInterest: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

/* ==========================================
   ADMIN DASHBOARD
========================================== */

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartDay[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  /* ==========================================
     FETCH DASHBOARD DATA
  ========================================== */

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setChartData(data.chartData || []);
        setTopProducts(data.topProducts || []);
        setRecentOrders(data.recentOrders || []);
        setRecentInquiries(data.recentInquiries || []);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  const maxRevenue = Math.max(
    ...chartData.map((d) => d.revenue),
    1
  );

  /* ==========================================
     DASHBOARD CARDS
  ========================================== */

  const cards = [
    {
      label: "Total Revenue",
      value: formatPrice(
        stats?.totalRevenue || 0,
        DASHBOARD_CURRENCY
      ),
      icon: DollarSign,
      color: "bg-green-500",
    },

    {
      label: "This Month",
      value: formatPrice(
        stats?.monthlyRevenue || 0,
        DASHBOARD_CURRENCY
      ),
      icon: TrendingUp,
      color: "bg-emerald-500",
    },

    {
      label: "Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },

    {
      label: "Pending",
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: "bg-amber-500",
    },

    {
      label: "Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "bg-purple-500",
    },

    {
      label: "Categories",
      value: `${stats?.activeCategories || 0}/${
        stats?.totalCategories || 0
      }`,
      icon: Grid3X3,
      color: "bg-cyan-600",
    },

    {
      label: "Active Offers",
      value: stats?.activeCoupons || 0,
      icon: Tag,
      color: "bg-orange-500",
    },

    {
      label: "Customers",
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: "bg-pink-500",
    },

    {
      label: "New Inquiries",
      value: `${stats?.newInquiries || 0}/${
        stats?.totalInquiries || 0
      }`,
      icon: MessageSquare,
      color: "bg-teal-600",
    },
  ];

  return (
    <div>

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage products, categories, orders, and offers
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/coupons"
            className="
              rounded-lg
              border
              border-gray-200
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              hover:bg-gray-50
            "
          >
            + Add Offer
          </Link>

          <Link
            href="/admin/products/new"
            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-brand-900
              px-4
              py-2
              text-sm
              font-medium
              text-white
              hover:bg-brand-800
            "
          >
            <Plus size={16} />

            Add Product
          </Link>
        </div>
      </div>

      {/* ==========================================
          QUICK ACTIONS
      ========================================== */}

      <div
        className="
          mb-8
          grid
          grid-cols-2
          gap-3
          lg:grid-cols-3
          xl:grid-cols-6
        "
      >
        {[
          {
            href: "/admin/products/new",
            label: "Add Product",
            desc: "Images, price, description",
            color: "border-brand-200 bg-brand-50",
          },

          {
            href: "/admin/categories",
            label: "Add Category",
            desc: "Shop tiles & images",
            color: "border-cyan-200 bg-cyan-50",
          },

          {
            href: "/admin/coupons",
            label: "Create Offer",
            desc: "Discount codes & coupons",
            color: "border-orange-200 bg-orange-50",
          },

          {
            href: "/admin/orders",
            label: "Manage Orders",
            desc: "Ship & track orders",
            color: "border-blue-200 bg-blue-50",
          },

          {
            href: "/admin/reviews",
            label: "Reviews",
            desc: "Approve customer reviews",
            color: "border-purple-200 bg-purple-50",
          },

          {
            href: "/admin/inquiries",
            label: "Inquiries",
            desc: "Wholesale leads & contact details",
            color: "border-teal-200 bg-teal-50",
          },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`
              rounded-xl
              border
              p-4
              transition-shadow
              hover:shadow-sm
              ${action.color}
            `}
          >
            <p className="text-sm font-semibold">
              {action.label}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {action.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* ==========================================
          STATISTIC CARDS
      ========================================== */}

      <div
        className="
          mb-8
          grid
          grid-cols-2
          gap-4
          lg:grid-cols-4
        "
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="
                rounded-xl
                border
                border-gray-100
                bg-white
                p-5
                shadow-sm
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {card.label}
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`
                    rounded-lg
                    p-2.5
                    text-white
                    ${card.color}
                  `}
                >
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==========================================
          REVENUE + TOP PRODUCTS
      ========================================== */}

      <div className="mb-8 grid gap-6 lg:grid-cols-3">

        {/* ==================================
            REVENUE CHART
        =================================== */}

        <div
          className="
            rounded-xl
            border
            border-gray-100
            bg-white
            p-5
            shadow-sm
            lg:col-span-2
          "
        >
          <h2 className="mb-4 font-semibold">
            Revenue (Last 7 Days)
          </h2>

          <div className="flex h-40 items-end gap-2">
            {chartData.map((day) => (
              <div
                key={day.date}
                className="
                  flex
                  flex-1
                  flex-col
                  items-center
                  gap-1
                "
              >
                {/* Revenue in USD */}
                <span className="text-[10px] font-medium text-gray-500">
                  {day.revenue > 0
                    ? formatPrice(
                        day.revenue,
                        DASHBOARD_CURRENCY
                      )
                    : ""}
                </span>

                <div
                  className="
                    min-h-[4px]
                    w-full
                    rounded-t-md
                    bg-brand-600
                    transition-all
                  "
                  style={{
                    height: `${Math.max(
                      (day.revenue / maxRevenue) * 100,
                      4
                    )}%`,
                  }}
                />

                <span className="text-[10px] text-gray-400">
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================
            TOP SELLING PRODUCTS
        =================================== */}

        <div
          className="
            rounded-xl
            border
            border-gray-100
            bg-white
            p-5
            shadow-sm
          "
        >
          <h2 className="mb-4 font-semibold">
            Top Selling
          </h2>

          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-sm text-gray-500">
                No sales data yet
              </p>
            ) : (
              topProducts.map((p, i) => (
                <div
                  key={p._id}
                  className="flex items-center gap-3"
                >
                  <span
                    className="
                      w-4
                      text-xs
                      font-bold
                      text-gray-400
                    "
                  >
                    {i + 1}
                  </span>

                  {/* PRODUCT IMAGE */}

                  <div
                    className="
                      relative
                      h-12
                      w-10
                      shrink-0
                      overflow-hidden
                      rounded
                      bg-gray-100
                    "
                  >
                    {p.image && (
                      <Image
                        src={p.image}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* PRODUCT INFO */}

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium">
                      {p.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {p.sold} sold
                    </p>
                  </div>

                  {/* Revenue in USD */}

                  <span className="text-xs font-semibold">
                    {formatPrice(
                      p.revenue,
                      DASHBOARD_CURRENCY
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          RECENT WHOLESALE INQUIRIES
      ========================================== */}

      <div
        className="
          mb-8
          rounded-xl
          border
          border-gray-100
          bg-white
          shadow-sm
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-100
            p-5
          "
        >
          <h2 className="font-semibold">
            Recent Wholesale Inquiries
          </h2>

          <Link
            href="/admin/inquiries"
            className="
              text-sm
              text-brand-600
              hover:text-brand-800
            "
          >
            View all
          </Link>
        </div>

        <div
          className="
            grid
            gap-3
            p-5
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {recentInquiries.map((inquiry) => (
            <Link
              key={inquiry._id}
              href="/admin/inquiries"
              className="
                rounded-lg
                border
                border-gray-100
                p-4
                transition
                hover:border-teal-200
                hover:bg-teal-50/40
              "
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {inquiry.businessName}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-500">
                    {inquiry.contactName} · {inquiry.email}
                  </p>
                </div>

                <span
                  className="
                    rounded-full
                    bg-gray-100
                    px-2
                    py-1
                    text-[10px]
                    font-semibold
                    uppercase
                    text-gray-600
                  "
                >
                  {inquiry.status}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                {inquiry.productInterest}
              </p>
            </Link>
          ))}

          {!recentInquiries.length ? (
            <p className="text-sm text-gray-500">
              No wholesale inquiries yet.
            </p>
          ) : null}
        </div>
      </div>

      {/* ==========================================
          RECENT ORDERS
      ========================================== */}

      <div
        className="
          rounded-xl
          border
          border-gray-100
          bg-white
          shadow-sm
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-100
            p-5
          "
        >
          <h2 className="font-semibold">
            Recent Orders
          </h2>

          <Link
            href="/admin/orders"
            className="
              text-sm
              text-brand-600
              hover:text-brand-800
            "
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* TABLE HEADER */}

            <thead>
              <tr
                className="
                  border-b
                  border-gray-100
                  text-left
                  text-gray-500
                "
              >
                <th className="p-4 font-medium">
                  Order
                </th>

                <th className="p-4 font-medium">
                  Customer
                </th>

                <th className="p-4 font-medium">
                  Total
                </th>

                <th className="p-4 font-medium">
                  Status
                </th>

                <th className="p-4 font-medium">
                  Payment
                </th>

                <th className="p-4 font-medium">
                  Date
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="
                    border-b
                    border-gray-50
                    hover:bg-gray-50
                  "
                >
                  {/* ORDER NUMBER */}

                  <td className="p-4">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="
                        font-medium
                        text-brand-600
                        hover:underline
                      "
                    >
                      #{order.orderNumber}
                    </Link>
                  </td>

                  {/* CUSTOMER */}

                  <td className="p-4">
                    {order.shippingAddress.fullName}
                  </td>

                  {/* TOTAL - FORCE USD */}

                  <td className="p-4 font-medium">
                    {formatPrice(
                      order.total,
                      DASHBOARD_CURRENCY
                    )}
                  </td>

                  {/* STATUS */}

                  <td className="p-4">
                    <span
                      className="
                        rounded-full
                        bg-gray-100
                        px-2
                        py-1
                        text-xs
                        capitalize
                      "
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* PAYMENT */}

                  <td className="p-4 capitalize">
                    {order.paymentStatus}
                  </td>

                  {/* DATE */}

                  <td className="p-4 text-gray-500">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}

              {/* NO ORDERS */}

              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="
                      p-8
                      text-center
                      text-gray-500
                    "
                  >
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}