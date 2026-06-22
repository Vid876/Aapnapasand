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
    <section className="py-16 bg-brand-900">
      <div className="container-app text-center">
        <Mail className="mx-auto mb-4 text-brand-300" size={32} />
        <h2 className="text-2xl lg:text-3xl font-display font-bold text-white mb-3">
          Stay in Style
        </h2>
        <p className="text-brand-200 mb-8 max-w-md mx-auto">
          Subscribe to get exclusive offers, new arrivals, and style tips delivered to your inbox.
        </p>

        {submitted ? (
          <p className="text-brand-200 font-medium">
            Thank you for subscribing! Check your inbox for a welcome offer.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex max-w-md mx-auto gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <Button type="submit" className="bg-white text-brand-900 hover:bg-brand-100 shrink-0">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
