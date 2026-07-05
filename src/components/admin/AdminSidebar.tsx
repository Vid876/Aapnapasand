"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ArrowLeft,
  Store,
  MessageSquare,
  Tag,
  FolderTree,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/coupons", label: "Offers", icon: Tag },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 min-h-screen flex flex-col shrink-0">
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin" className="text-xl font-display font-bold text-white">
          BOHOBLOCKPRINTED
        </Link>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-600 text-white"
                  : "hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Store size={18} />
          View Store
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}

