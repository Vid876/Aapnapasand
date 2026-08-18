"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { BRAND, PRIMARY_NAV, TOP_BAR_MESSAGES } from "@/lib/brand";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useTranslation } from "@/store/localeStore";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const desktopNavRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const { data: session } = useSession();
  const cartItems = useCartStore((s) => s.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const itemCount = mounted
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDesktopMenu(null);
    setOpenMobileMenu(null);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        openDesktopMenu &&
        desktopNavRef.current &&
        !desktopNavRef.current.contains(event.target as Node)
      ) {
        setOpenDesktopMenu(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenDesktopMenu(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openDesktopMenu]);

  const closeMobileMenu = () => setMobileOpen(false);

  const openAccountPage = () => {
    setMobileOpen(false);
    window.location.href = "/register";
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
      <div className="top-bar-shell overflow-hidden text-white" tabIndex={0} aria-label="Store announcements">
        <div className="top-bar-marquee flex w-max items-center py-2 text-xs font-semibold tracking-wide sm:py-2.5 sm:text-sm">
          {[0, 1, 2, 3].map((copyIndex) => (
            <div
              key={copyIndex}
              aria-hidden={copyIndex > 0 ? true : undefined}
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

          <nav ref={desktopNavRef} className="hidden min-w-0 flex-1 items-center justify-center gap-2 xl:flex 2xl:gap-4">
            {PRIMARY_NAV.map((link) => {
              const children = "children" in link ? link.children : [];

              if (children.length === 0) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-700 transition-colors hover:text-[#173f4f] 2xl:text-xs 2xl:tracking-[0.12em]"
                  >
                    {link.label}
                  </Link>
                );
              }

              const isOpen = openDesktopMenu === link.href;
              const menuId = `desktop-menu-${link.href.replace(/[^a-z0-9]+/gi, "-")}`;

              return (
                <div key={link.href}>
                  <button
                    type="button"
                    onClick={() => setOpenDesktopMenu(isOpen ? null : link.href)}
                    aria-expanded={isOpen}
                    aria-controls={menuId}
                    className="inline-flex items-center gap-0.5 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-700 transition-colors hover:text-[#173f4f] 2xl:gap-1 2xl:text-xs 2xl:tracking-[0.12em]"
                  >
                    {link.label}
                    <ChevronDown size={13} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div id={menuId} className="absolute left-0 right-0 top-full border-t border-stone-200 bg-white shadow-xl shadow-stone-950/10">
                      <div className="container-app grid gap-8 py-6 xl:grid-cols-[0.72fr_1.28fr]">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#276070]">
                            {link.label}
                          </p>
                          <Link
                            href={link.href}
                            className="mt-3 inline-flex text-sm font-semibold text-[#173f4f] hover:underline"
                          >
                            View all {link.label}
                          </Link>
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
              className="relative hidden rounded-full p-2 transition-colors hover:bg-stone-100 sm:flex"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 ? (
                <span className="absolute right-0 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#173f4f] px-1 text-[10px] font-semibold text-white">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              ) : null}
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
                onClick={openAccountPage}
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
                <div key={link.href} className="border-b border-stone-100 last:border-0">
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={link.href}
                      className="flex-1 py-3 text-base font-semibold text-stone-800 hover:text-[#173f4f]"
                      onClick={closeMobileMenu}
                    >
                      {link.label}
                    </Link>
                    {children.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setOpenMobileMenu(openMobileMenu === link.href ? null : link.href)}
                        className="rounded-full p-2 text-stone-600 hover:bg-stone-100"
                        aria-label={`Toggle ${link.label} menu`}
                        aria-expanded={openMobileMenu === link.href}
                      >
                        <ChevronDown size={18} className={`transition-transform ${openMobileMenu === link.href ? "rotate-180" : ""}`} />
                      </button>
                    ) : null}
                  </div>
                  {children.length > 0 && openMobileMenu === link.href && (
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
                onClick={openAccountPage}
              >
                Create Account
              </button>
            )}
          </nav>
        </div>
      )}

      </header>

    </>
  );
}
