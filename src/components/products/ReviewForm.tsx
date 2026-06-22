"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ReviewFormProps {
  productId: string;
  onSubmitted?: () => void;
}

export function ReviewForm({ productId, onSubmitted }: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              className="p-1"
            >
              <Star
                size={24}
                className={
                  i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }
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
