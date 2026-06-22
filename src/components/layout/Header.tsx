"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useTranslation } from "@/store/localeStore";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.getItemCount());
  const { t } = useTranslation();

  const NAV_LINKS = [
    { label: t.nav.men, href: "/shop?gender=men" },
    { label: t.nav.women, href: "/shop?gender=women" },
    { label: t.nav.newArrivals, href: "/shop?sort=newest" },
    { label: t.nav.sale, href: "/shop?sort=price-asc" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="bg-brand-900 text-white text-center py-2 text-sm">
        <p>{t.promo.banner}</p>
      </div>

      <div className="container-app">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl lg:text-3xl font-display font-bold tracking-tight text-brand-900">
              Aapnapasand
            </h1>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 lg:gap-3">
            <LanguageSwitcher />

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link
              href="/wishlist"
              className="hidden sm:flex p-2 hover:bg-gray-50 rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link>

            <Link
              href={session ? "/account" : "/login"}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              aria-label="Account"
            >
              <User size={20} />
            </Link>

            {session?.user?.role === "admin" && (
              <Link
                href="/admin"
                className="hidden sm:block px-3 py-1.5 text-xs font-semibold uppercase tracking-wide bg-brand-900 text-white rounded-full hover:bg-brand-800"
              >
                {t.nav.admin}
              </Link>
            )}

            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-50 rounded-full transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav.search}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="container-app py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-base font-medium text-gray-700 hover:text-brand-600"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/shop"
              className="block py-3 text-base font-medium text-gray-700 hover:text-brand-600"
              onClick={() => setMobileOpen(false)}
            >
              {t.nav.shopAll}
            </Link>
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="block w-full text-left py-3 text-base font-medium text-red-600"
              >
                {t.nav.signOut}
              </button>
            ) : (
              <Link
                href="/login"
                className="block py-3 text-base font-medium text-brand-600"
                onClick={() => setMobileOpen(false)}
              >
                {t.nav.signIn}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
