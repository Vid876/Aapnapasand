"use client";

import Image from "next/image";
import { useState } from "react";
import { isNextImageCompatible } from "@/lib/image-utils";

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}

export function ProductImage({ src, alt, className, sizes, priority }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!isNextImageCompatible(src) || failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-100 via-rose-50 to-stone-200 p-4 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={src.startsWith("/uploads/")}
      onError={() => setFailed(true)}
    />
  );
}
