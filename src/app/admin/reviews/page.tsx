"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Check, X } from "lucide-react";

interface ReviewItem {
  _id: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  product: { name: string; slug: string; images: string[] };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const fetchReviews = () => {
    fetch("/api/admin/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateReview = async (id: string, isApproved: boolean) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved }),
    });
    fetchReviews();
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    fetchReviews();
  };

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.isApproved;
    if (filter === "approved") return r.isApproved;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.isApproved).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reviews</h1>
          {pendingCount > 0 && (
            <p className="text-sm text-amber-600 mt-1">{pendingCount} pending approval</p>
          )}
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="all">All Reviews</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 bg-white rounded-xl p-8 text-center border">No reviews found</p>
        ) : (
          filtered.map((review) => (
            <div
              key={review._id}
              className={`bg-white rounded-xl border p-5 ${
                !review.isApproved ? "border-amber-200 bg-amber-50/30" : "border-gray-100"
              }`}
            >
              <div className="flex gap-4">
                <div className="relative w-16 h-20 rounded overflow-hidden bg-gray-100 shrink-0">
                  {review.product?.images?.[0] && (
                    <Image
                      src={review.product.images[0]}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{review.product?.name}</p>
                      <p className="text-sm text-gray-500">
                        by {review.userName} &middot;{" "}
                        {new Date(review.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full shrink-0 ${
                        review.isApproved
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {review.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <div className="flex gap-0.5 my-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  {review.title && <p className="font-medium text-sm">{review.title}</p>}
                  <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                {!review.isApproved && (
                  <button
                    onClick={() => updateReview(review._id, true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Check size={14} /> Approve
                  </button>
                )}
                {review.isApproved && (
                  <button
                    onClick={() => updateReview(review._id, false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <X size={14} /> Unapprove
                  </button>
                )}
                <button
                  onClick={() => deleteReview(review._id)}
                  className="px-3 py-1.5 text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
