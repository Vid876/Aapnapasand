"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Heart, LogOut, Package, User } from "lucide-react";

const links = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
] as const;

export function AccountSidebar({ name, email }: { name?: string | null; email?: string | null }) {
  const pathname = usePathname();

  return (
    <aside>
      <div className="mb-4 rounded-xl bg-[#eef4f0] p-4">
        <p className="font-semibold text-[#173f4f]">{name || "Customer"}</p>
        <p className="break-all text-sm text-stone-500">{email}</p>
      </div>
      <nav className="space-y-1" aria-label="My account">
        {links.map((link) => {
          const active =
            link.href === "/account" ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-[#173f4f] text-white"
                  : "text-gray-700 hover:bg-stone-50"
              }`}
            >
              <link.icon size={18} /> {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </nav>
    </aside>
  );
}
