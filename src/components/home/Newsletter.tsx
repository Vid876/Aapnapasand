"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#2f1912_0%,#6b241b_42%,#b5743f_100%)] py-16 text-white lg:py-24">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_38px)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/25" />
      <div className="container-app relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/12 text-brand-100 ring-1 ring-white/20">
            <Mail size={28} />
          </div>
          <h2 className="text-4xl font-display font-bold leading-tight lg:text-6xl">
            Stay in style
          </h2>
          <p className="mx-auto mt-4 mb-8 max-w-2xl text-sm leading-7 text-brand-50 lg:text-base">
            Subscribe for new arrivals, early sale access, festive edits, and premium styling notes from BOHOBLOCKPRINTED.
          </p>

          {submitted ? (
            <p className="font-medium text-brand-50">
              Thank you for subscribing. Check your inbox for a welcome offer.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl bg-white/12 p-2 shadow-2xl shadow-brand-950/20 ring-1 ring-white/20 backdrop-blur sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="min-h-12 flex-1 rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-brand-950 placeholder:text-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
              <Button type="submit" className="min-h-12 shrink-0 rounded-xl bg-brand-950 px-7 text-white hover:bg-brand-900">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

