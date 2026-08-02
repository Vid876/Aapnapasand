"use client";

import { useEffect } from "react";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Shop route error:", error);
  }, [error]);

  return (
    <div className="container-app py-20 text-center">
      <h1 className="font-display text-3xl font-bold text-[#173f4f]">
        The shop could not be opened
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-stone-600">
        Please try again. Your selected filters will remain in the address bar.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-[#173f4f] px-6 py-3 text-sm font-semibold text-white"
      >
        Try Again
      </button>
    </div>
  );
}
