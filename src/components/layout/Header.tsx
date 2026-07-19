"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSession, signIn, signOut } from "next-auth/react";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { BRAND, PRIMARY_NAV, TOP_BAR_MESSAGES } from "@/lib/brand";
import { useCartStore } from "@/store/cartStore";
import { useTranslation } from "@/store/localeStore";

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
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountForm, setAccountForm] = useState(EMPTY_ACCOUNT_FORM);
  const [accountError, setAccountError] = useState("");
  const [accountSuccess, setAccountSuccess] = useState("");
  const [accountLoading, setAccountLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const { data: session } = useSession();
  const cartItems = useCartStore((s) => s.items);
  const itemCount = mounted
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setAccountModalOpen(false);
  }, [pathname]);

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
    <>
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/96 shadow-sm backdrop-blur">
      <div className="top-bar-shell overflow-hidden text-white">
        <div className="top-bar-marquee flex w-max items-center py-2 text-xs font-semibold tracking-wide sm:py-2.5 sm:text-sm">
          {[false, true].map((duplicate) => (
            <div
              key={String(duplicate)}
              aria-hidden={duplicate ? true : undefined}
              className="flex shrink-0 items-center gap-7 px-3 sm:gap-10 sm:px-5 lg:gap-12"
            >
              {TOP_BAR_MESSAGES.map((message) => (
                <span key={message} className="flex items-center gap-7 whitespace-nowrap sm:gap-10 lg:gap-12">
                  {message}
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#f5c76b] shadow-[0_0_10px_rgba(245,199,107,0.75)]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:max-w-none xl:px-5 2xl:px-8">
        <div className="flex h-20 items-center justify-between gap-3 lg:h-24 xl:gap-4 2xl:h-28 2xl:gap-6">
          <button
            className="-ml-2 rounded-full p-2 transition-colors hover:bg-stone-100 xl:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="flex shrink-0 items-center justify-center">
            <Image
              src="/Logo.png"
              alt={BRAND.name}
              width={360}
              height={160}
              priority
              className="h-14 max-w-[190px] object-contain sm:h-16 sm:max-w-[240px] xl:h-20 xl:max-w-[220px] 2xl:h-24 2xl:max-w-[260px]"
            />
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-2 xl:flex 2xl:gap-4">
            {PRIMARY_NAV.map((link) => {
              const children = "children" in link ? link.children : [];

              return (
                <div key={link.href} className="group py-8 -my-8">
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-0.5 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-700 transition-colors hover:text-[#173f4f] 2xl:gap-1 2xl:text-xs 2xl:tracking-[0.12em]"
                  >
                    {link.label}
                    {children.length > 0 && <ChevronDown size={13} />}
                  </Link>

                  {children.length > 0 && (
                    <div className="absolute left-0 right-0 top-full hidden border-t border-stone-200 bg-white shadow-xl shadow-stone-950/10 group-hover:block group-focus-within:block">
                      <div className="container-app grid gap-8 py-6 xl:grid-cols-[0.72fr_1.28fr]">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#276070]">
                            {link.label}
                          </p>
                          <p className="mt-3 max-w-md text-sm leading-7 text-stone-600">
                            Explore artisan block printed textiles with clear collection paths for shoppers and search engines.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 xl:grid-cols-3">
                          {children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="text-sm font-medium text-stone-700 transition-colors hover:text-[#173f4f]"
                            >
                              {child.label}
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

          <div className="flex shrink-0 items-center justify-end gap-0.5 lg:gap-1 2xl:gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="rounded-full p-2 transition-colors hover:bg-stone-100"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link
              href="/wishlist"
              className="hidden rounded-full p-2 transition-colors hover:bg-stone-100 sm:flex"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link>

            {session ? (
              <Link
                href="/account"
                className="rounded-full p-2 transition-colors hover:bg-stone-100"
                aria-label="Account"
              >
                <User size={20} />
              </Link>
            ) : (
              <button
                onClick={openAccountModal}
                className="rounded-full p-2 transition-colors hover:bg-stone-100"
                aria-label="Create account"
              >
                <User size={20} />
              </button>
            )}

            {session?.user?.role === "admin" && (
              <Link
                href="/admin"
                className="hidden rounded-full bg-[#173f4f] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#245d70] sm:block"
              >
                {t.nav.admin}
              </Link>
            )}

            <Link
              href="/cart"
              className="relative rounded-full p-2 transition-colors hover:bg-stone-100"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute right-0 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#9f2f2f] text-xs font-medium text-white">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav.search}
                className="w-full rounded-full border border-stone-200 bg-stone-50 py-3 pl-12 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#276070]"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white xl:hidden">
          <nav className="container-app max-h-[calc(100vh-7rem)] space-y-1 overflow-y-auto py-4">
            {PRIMARY_NAV.map((link) => {
              const children = "children" in link ? link.children : [];

              return (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-3 text-base font-semibold text-stone-800 hover:text-[#173f4f]"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                  {children.length > 0 && (
                    <div className="grid grid-cols-1 gap-1 pb-2 pl-4">
                      {children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="py-2 text-sm text-stone-600 hover:text-[#173f4f]"
                          onClick={closeMobileMenu}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="block w-full py-3 text-left text-base font-medium text-red-600"
              >
                {t.nav.signOut}
              </button>
            ) : (
              <button
                className="block w-full py-3 text-left text-base font-medium text-[#173f4f]"
                onClick={openAccountModal}
              >
                Create Account
              </button>
            )}
          </nav>
        </div>
      )}

      </header>

      {mounted && accountModalOpen && !session && createPortal(
        <div className="fixed inset-0 z-[120] grid place-items-center px-4 py-5 sm:px-6">
          <button
            type="button"
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            aria-label="Close account form"
            onClick={() => setAccountModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-register-title"
            className="relative max-h-[min(90vh,760px)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl shadow-stone-950/25 sm:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#276070]">
                  {BRAND.name}
                </p>
                <h2
                  id="account-register-title"
                  className="mt-2 font-display text-2xl font-bold text-stone-950"
                >
                  Create Account
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAccountModalOpen(false)}
                className="rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
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
                <label className="space-y-1.5 text-sm font-medium text-stone-700">
                  First Name
                  <input
                    value={accountForm.firstName}
                    onChange={(e) =>
                      setAccountForm((form) => ({ ...form, firstName: e.target.value }))
                    }
                    className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#276070]"
                    required
                  />
                </label>
                <label className="space-y-1.5 text-sm font-medium text-stone-700">
                  Last Name
                  <input
                    value={accountForm.lastName}
                    onChange={(e) =>
                      setAccountForm((form) => ({ ...form, lastName: e.target.value }))
                    }
                    className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#276070]"
                    required
                  />
                </label>
              </div>

              <label className="block space-y-1.5 text-sm font-medium text-stone-700">
                Email
                <input
                  type="email"
                  value={accountForm.email}
                  onChange={(e) =>
                    setAccountForm((form) => ({ ...form, email: e.target.value }))
                  }
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#276070]"
                  required
                />
              </label>

              <label className="block space-y-1.5 text-sm font-medium text-stone-700">
                Mobile Number
                <input
                  type="tel"
                  value={accountForm.mobile}
                  onChange={(e) =>
                    setAccountForm((form) => ({ ...form, mobile: e.target.value }))
                  }
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#276070]"
                  required
                />
              </label>

              <label className="block space-y-1.5 text-sm font-medium text-stone-700">
                Password
                <input
                  type="password"
                  minLength={6}
                  value={accountForm.password}
                  onChange={(e) =>
                    setAccountForm((form) => ({ ...form, password: e.target.value }))
                  }
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#276070]"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={accountLoading}
                className="flex min-h-12 w-full items-center justify-center rounded-lg bg-[#173f4f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#245d70] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {accountLoading ? "Creating..." : "Register"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-stone-500">
              Already registered?{" "}
              <Link
                href="/login"
                onClick={() => setAccountModalOpen(false)}
                className="font-semibold text-[#173f4f] hover:text-[#245d70]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
