"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { CUSTOMER_REVIEWS } from "@/lib/customer-reviews";

export function CustomerReviewsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const review = CUSTOMER_REVIEWS[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % CUSTOMER_REVIEWS.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + CUSTOMER_REVIEWS.length) % CUSTOMER_REVIEWS.length);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <article className="relative rounded-2xl bg-white p-6 text-stone-800 shadow-xl shadow-black/10 ring-1 ring-white/20 sm:p-9" aria-live="polite">
        <Quote className="text-[#c9902e]" size={28} />
        <div className="mt-4 flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} size={16} className={index < review.rating ? "fill-[#c9902e] text-[#c9902e]" : "text-stone-300"} />
          ))}
          <span className="ml-2 text-xs font-semibold text-stone-500">{review.rating}/5</span>
        </div>
        <blockquote className="mt-4 text-lg leading-8 text-stone-800 sm:text-xl">“{review.comment}”</blockquote>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#276070]">{review.product}</p>
        {review.response && (
          <div className="mt-5 rounded-xl bg-[#f5f1e8] p-4 text-sm leading-6 text-stone-600">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#9a620b]">Nisha&apos;s response</p>
            {review.response}
          </div>
        )}
        <div className="mt-6 flex items-end justify-between gap-4 border-t border-stone-200 pt-5">
          <div>
            <p className="font-semibold text-[#173f4f]">{review.customer}</p>
            <p className="text-xs uppercase tracking-[0.14em] text-stone-500">{review.date}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => move(-1)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#173f4f]/20 text-[#173f4f] transition hover:bg-[#173f4f] hover:text-white" aria-label="Previous customer review">
              <ArrowLeft size={16} />
            </button>
            <button type="button" onClick={() => move(1)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#173f4f]/20 text-[#173f4f] transition hover:bg-[#173f4f] hover:text-white" aria-label="Next customer review">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </article>
      <div className="mt-5 flex items-center justify-center gap-1.5" aria-label="Customer review slides">
        {CUSTOMER_REVIEWS.map((item, index) => (
          <button key={`${item.customer}-${item.date}-${index}`} type="button" onClick={() => setActiveIndex(index)} aria-label={`Show review ${index + 1}`} aria-current={index === activeIndex} className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-7 bg-[#f5c76b]" : "w-1.5 bg-white/35"}`} />
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-white/55">Review {activeIndex + 1} of {CUSTOMER_REVIEWS.length}</p>
    </div>
  );
}
