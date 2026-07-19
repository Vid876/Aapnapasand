"use client";

import Image from "next/image";
import { useState } from "react";

type CategoryCardMediaProps = {
  alt: string;
  src?: string;
  priority?: boolean;
};

export function CategoryCardMedia({
  alt,
  src,
  priority = false,
}: CategoryCardMediaProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#d9e7df] via-[#eef4f0] to-[#c5d6cd]">
        <div className="absolute inset-0 flex items-center justify-center p-5 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#173f4f]/65 sm:text-sm">
            {alt}
          </span>
        </div>
      </div>
    );
  }

  const isUploadedImage = src.startsWith("/uploads/");

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      unoptimized={isUploadedImage}
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}