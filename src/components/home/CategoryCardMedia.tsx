"use client";

import Image from "next/image";
import { useState } from "react";
import { getRenderableImageSrc } from "@/lib/image-utils";

type CategoryCardMediaProps = {
  alt: string;
  src?: string;
};

export function CategoryCardMedia({
  alt,
  src,
}: CategoryCardMediaProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#d9e7df] via-[#eef4f0] to-[#c5d6cd]">
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#173f4f]/60">
            {alt}
          </span>
        </div>
      </div>
    );
  }

  const renderSrc = getRenderableImageSrc(src)!;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Blurred background fills empty space */}
      <Image
        src={renderSrc}
        alt=""
        fill
        aria-hidden="true"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        unoptimized={renderSrc?.startsWith("/uploads/") || renderSrc?.startsWith("/media/")}
        className="scale-110 object-cover opacity-25 blur-2xl"
      />

      <div className="absolute inset-0 bg-[#f1efe8]/50" />

      {/* Full image without cropping */}
      <Image
        src={renderSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        unoptimized={renderSrc?.startsWith("/uploads/") || renderSrc?.startsWith("/media/")}
        className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-[1.025]"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
