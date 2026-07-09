"use client";

import { useEffect, useState } from "react";
import { Mail, X } from "lucide-react";

const STORAGE_KEY = "bohoblockprinted-newsletter-popup";

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY)) return;

    const show = () => setVisible(true);
    const timer = window.setTimeout(show, 9000);
    const handleScroll = () => {
      const scrollDepth = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
      if (scrollDepth > 0.42) show();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, "dismissed");
    setVisible(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    window.localStorage.setItem(STORAGE_KEY, "subscribed");
    setSubmitted(true);
    setEmail("");
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[70] sm:left-auto sm:right-5 sm:max-w-sm">
      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xl shadow-stone-950/18">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#173f4f] text-white">
              <Mail size={19} />
            </div>
            <div>
              <h2 className="font-semibold text-stone-950">Get 10% Off Your First Order</h2>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                Join for block print launches, wholesale notes, and home textile ideas.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-950"
            aria-label="Close newsletter offer"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <p className="mt-4 rounded-lg bg-[#eef4f0] px-3 py-2 text-sm font-medium text-[#173f4f]">
            Thank you. Your welcome offer is on its way.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              required
              className="min-h-11 flex-1 rounded-lg border border-stone-200 px-3 text-sm outline-none focus:ring-2 focus:ring-[#276070]"
            />
            <button
              type="submit"
              className="min-h-11 rounded-lg bg-[#173f4f] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#245d70]"
            >
              Join
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
