"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ReviewFormProps {
  productId: string;
  onSubmitted?: () => void;
}

type ReviewEligibility = {
  canReview: boolean;
  hasPurchased?: boolean;
  alreadyReviewed?: boolean;
};

export function ReviewForm({ productId, onSubmitted }: ReviewFormProps) {
  const { data: session, status } = useSession();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [eligibility, setEligibility] = useState<ReviewEligibility | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      setEligibility(null);
      setCheckingEligibility(false);
      return;
    }

    const controller = new AbortController();
    setCheckingEligibility(true);

    fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const data = (await response.json()) as ReviewEligibility;
        if (!response.ok) throw new Error("Unable to verify purchase");
        setEligibility(data);
      })
      .catch((eligibilityError) => {
        if (eligibilityError instanceof DOMException && eligibilityError.name === "AbortError") {
          return;
        }
        setEligibility({ canReview: false });
        setError("Unable to verify your purchase right now. Please try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setCheckingEligibility(false);
      });

    return () => controller.abort();
  }, [productId, status]);

  if (status === "loading" || checkingEligibility) {
    return (
      <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-600">
        Checking purchase eligibility...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-gray-600 mb-3">Login to write a review</p>
        <Link href="/login">
          <Button size="sm">Sign In</Button>
        </Link>
      </div>
    );
  }

  if (!eligibility?.canReview) {
    return (
      <div className="rounded-xl bg-gray-50 p-6 text-center">
        <p className="font-semibold text-gray-900">
          {eligibility?.alreadyReviewed
            ? "You have already reviewed this product."
            : "Only verified purchasers can review this product."}
        </p>
        {!eligibility?.alreadyReviewed ? (
          <p className="mt-2 text-sm leading-6 text-gray-600">
            The review form becomes available after a paid or delivered order
            containing this item is linked to your account.
          </p>
        ) : null}
        <Link
          href="/account/orders"
          className="mt-4 inline-flex text-sm font-semibold text-[#173f4f] hover:underline"
        >
          View your orders
        </Link>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title: title || undefined, comment }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setMessage(data.message);
      setTitle("");
      setComment("");
      setRating(5);
      setEligibility({
        canReview: false,
        hasPurchased: true,
        alreadyReviewed: true,
      });
      onSubmitted?.();
    } catch {
      setError("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="font-semibold">Write a Review</h3>

      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                rating === value
                  ? "border-[#173f4f] bg-[#173f4f] text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-[#173f4f]"
              }`}
              aria-label={`${value} out of 5 stars`}
              aria-pressed={rating === value}
            >
              {value}
              <Star
                size={17}
                className="fill-yellow-400 text-yellow-400"
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Title (optional)</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white"
          placeholder="Great product!"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Your Review *</label>
        <textarea
          required
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white"
          placeholder="Share your experience with this product..."
          minLength={10}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}

      <Button type="submit" isLoading={loading}>
        Submit Review
      </Button>
    </form>
  );
}
