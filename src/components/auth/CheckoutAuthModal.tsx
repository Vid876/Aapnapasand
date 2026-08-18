"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LockKeyhole, LogIn, ShoppingBag, UserPlus, X } from "lucide-react";

type CheckoutAuthModalProps = {
  open: boolean;
  onClose: () => void;
};

const CHECKOUT_CALLBACK = encodeURIComponent("/checkout");

export function CheckoutAuthModal({ open, onClose }: CheckoutAuthModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[140] grid place-items-center px-4 py-6">
      <button
        type="button"
        aria-label="Close sign in notice"
        className="absolute inset-0 bg-[#102f3b]/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-auth-title"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-[#fbfaf7] shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
      >
        <div className="h-1.5 bg-gradient-to-r from-[#173f4f] via-[#c38a2c] to-[#8c3b30]" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sign in notice"
          className="absolute right-4 top-5 flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
        >
          <X size={20} />
        </button>

        <div className="p-7 sm:p-9">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173f4f] text-white shadow-lg shadow-[#173f4f]/20">
            <ShoppingBag size={25} />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-[#b87811]">
            Secure checkout
          </p>
          <h2
            id="checkout-auth-title"
            className="mt-2 font-display text-3xl font-bold leading-tight text-stone-950"
          >
            Sign in before placing your order
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Please sign in or create a verified account to continue. Your cart will stay saved and you will return directly to checkout.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              href={`/login?callbackUrl=${CHECKOUT_CALLBACK}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#173f4f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245d70]"
            >
              <LogIn size={17} />
              Sign in
            </Link>
            <Link
              href={`/register?callbackUrl=${CHECKOUT_CALLBACK}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#173f4f] bg-white px-5 py-3 text-sm font-semibold text-[#173f4f] transition hover:bg-[#eef4f0]"
            >
              <UserPlus size={17} />
              Create account
            </Link>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#eef4f0] p-4 text-xs leading-6 text-[#365246]">
            <LockKeyhole className="mt-0.5 shrink-0 text-[#276070]" size={18} />
            <span>Account verification keeps your order history, delivery details, and payment flow protected.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
