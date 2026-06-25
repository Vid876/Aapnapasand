"use client";

import Image from "next/image";
import { useState } from "react";

type CategoryCardMediaProps = {
  alt: string;
  src?: string;
};

export function CategoryCardMedia({ alt, src }: CategoryCardMediaProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f7d8c9_0%,#9f4a34_48%,#2f1912_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.42),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.16),transparent_26%)]" />
        <div className="absolute inset-x-4 top-4 rounded-lg border border-white/25 bg-white/12 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
          {alt}
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-105"
      sizes="(max-width: 768px) 50vw, 20vw"
      onError={() => setFailed(true)}
    />
  );
}
