"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useTranslation } from "@/store/localeStore";
import type { Category } from "@/types";

type CategoryMenu = "all" | "men" | "women";

const TOP_BAR_MESSAGES = [
  "New Collection Available",
  "Premium Block Printed Collection",
  "Free Shipping on Selected Orders",
  "Best Offers Available",
  "Welcome to BOHOBLOCKPRINTED",
];

const EMPTY_ACCOUNT_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  password: "",
};

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountForm, setAccountForm] = useState(EMPTY_ACCOUNT_FORM);
  const [accountError, setAccountError] = useState("");
  const [accountSuccess, setAccountSuccess] = useState("");
  const [accountLoading, setAccountLoading] = useState(false);

  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.getItemCount());
  const { t } = useTranslation();

  const NAV_LINKS = [
    { label: "Shop", href: "/shop", menu: "all" as CategoryMenu },
    { label: t.nav.men, href: "/shop?gender=men", menu: "men" as CategoryMenu },
    { label: t.nav.women, href: "/shop?gender=women", menu: "women" as CategoryMenu },
    { label: "Collections", href: "/collections", menu: "all" as CategoryMenu },
    { label: t.nav.newArrivals, href: "/new-arrivals", menu: null },
    { label: t.nav.sale, href: "/sale", menu: null },
  ];

  const getMenuCategories = (menu: CategoryMenu) => {
    if (menu === "all") return categories;
    return categories.filter(
      (category) => category.gender === menu || category.gender === "unisex"
    );
  };

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!accountModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountModalOpen(false);
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountModalOpen]);

  const closeMobileMenu = () => setMobileOpen(false);

  const openAccountModal = () => {
    setMobileOpen(false);
    setAccountError("");
    setAccountSuccess("");
    setAccountModalOpen(true);
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError("");
    setAccountSuccess("");

    const firstName = accountForm.firstName.trim();
    const lastName = accountForm.lastName.trim();
    const email = accountForm.email.trim();
    const mobile = accountForm.mobile.trim();

    if (!firstName || !lastName || !email || !mobile || !accountForm.password) {
      setAccountError("Please fill all registration fields.");
      return;
    }

    setAccountLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          phone: mobile,
          password: accountForm.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setAccountError(data.error || "Registration failed. Please try again.");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password: accountForm.password,
        redirect: false,
      });

      if (result?.error) {
        setAccountSuccess("Account created. Please sign in to continue.");
        setAccountForm(EMPTY_ACCOUNT_FORM);
        return;
      }

      setAccountForm(EMPTY_ACCOUNT_FORM);
      window.location.href = "/account";
    } catch {
      setAccountError("Something went wrong. Please try again.");
    } finally {
      setAccountLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="overflow-hidden bg-brand-950 text-white">
        <div className="top-bar-marquee flex w-max items-center gap-8 py-2 text-xs font-semibold tracking-wide sm:text-sm">
          {[...TOP_BAR_MESSAGES, ...TOP_BAR_MESSAGES].map((message, index) => (
            <span key={`${message}-${index}`} className="whitespace-nowrap">
              {message}
            </span>
          ))}
        </div>
      </div>

      <div className="container-app">
        <div className="flex h-20 items-center justify-between gap-3 lg:h-24">
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="flex flex-shrink-0 items-center justify-center">
            <Image
              src="/Logo.png"
              alt="BOHOBLOCKPRINTED"
              width={360}
              height={160}
              priority
              className="h-14 max-w-[220px] object-contain sm:h-16 sm:max-w-[280px] lg:h-20"
            />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
            {NAV_LINKS.map((link) => {
              const menuCategories = link.menu ? getMenuCategories(link.menu) : [];

              return (
                <div key={link.href} className="group py-8 -my-8">
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors uppercase tracking-wide"
                  >
                    {link.label}
                  </Link>

                  {link.menu && menuCategories.length > 0 && (
                    <div className="absolute left-0 right-0 top-full hidden border-t border-gray-100 bg-white shadow-lg group-hover:block group-focus-within:block">
                      <div className="container-app py-5">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                            {link.menu === "men"
                              ? "Men Categories"
                              : link.menu === "women"
                                ? "Women Categories"
                                : "All Categories"}
                          </p>
                          <Link
                            href={link.menu === "all" ? "/shop" : `/shop?gender=${link.menu}`}
                            className="text-xs font-semibold uppercase tracking-wide text-brand-700 hover:text-brand-900"
                          >
                            Shop All
                          </Link>
                        </div>

                        <div className="grid grid-cols-4 gap-x-8 gap-y-3">
                          {menuCategories.map((category) => (
                            <Link
                              key={category.slug}
                              href={`/shop?category=${category.slug}`}
                              className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-700"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 lg:gap-3">
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

            {session ? (
              <Link
                href="/account"
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                aria-label="Account"
              >
                <User size={20} />
              </Link>
            ) : (
              <button
                onClick={openAccountModal}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                aria-label="Create account"
              >
                <User size={20} />
              </button>
            )}

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
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

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
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/shop"
              className="block py-3 text-base font-medium text-gray-700 hover:text-brand-600"
              onClick={closeMobileMenu}
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
              <button
                className="block w-full py-3 text-left text-base font-medium text-brand-600"
                onClick={openAccountModal}
              >
                Create Account
              </button>
            )}
          </nav>
        </div>
      )}

      {accountModalOpen && !session && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6">
          <button
            type="button"
            className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm"
            aria-label="Close account form"
            onClick={() => setAccountModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-register-title"
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl shadow-brand-950/25 sm:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
                  BOHOBLOCKPRINTED
                </p>
                <h2
                  id="account-register-title"
                  className="mt-2 font-display text-2xl font-bold text-brand-950"
                >
                  Create Account
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAccountModalOpen(false)}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close account form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAccountSubmit} className="space-y-4">
              {accountError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {accountError}
                </div>
              )}
              {accountSuccess && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  {accountSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-medium text-gray-700">
                  First Name
                  <input
                    value={accountForm.firstName}
                    onChange={(e) =>
                      setAccountForm((form) => ({ ...form, firstName: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </label>
                <label className="space-y-1.5 text-sm font-medium text-gray-700">
                  Last Name
                  <input
                    value={accountForm.lastName}
                    onChange={(e) =>
                      setAccountForm((form) => ({ ...form, lastName: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </label>
              </div>

              <label className="block space-y-1.5 text-sm font-medium text-gray-700">
                Email
                <input
                  type="email"
                  value={accountForm.email}
                  onChange={(e) =>
                    setAccountForm((form) => ({ ...form, email: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </label>

              <label className="block space-y-1.5 text-sm font-medium text-gray-700">
                Mobile Number
                <input
                  type="tel"
                  value={accountForm.mobile}
                  onChange={(e) =>
                    setAccountForm((form) => ({ ...form, mobile: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </label>

              <label className="block space-y-1.5 text-sm font-medium text-gray-700">
                Password
                <input
                  type="password"
                  minLength={6}
                  value={accountForm.password}
                  onChange={(e) =>
                    setAccountForm((form) => ({ ...form, password: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={accountLoading}
                className="flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {accountLoading ? "Creating..." : "Register"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              Already registered?{" "}
              <Link
                href="/login"
                onClick={() => setAccountModalOpen(false)}
                className="font-semibold text-brand-700 hover:text-brand-900"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
