import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Globe2, Handshake, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/brand";

const HIGHLIGHTS = [
  { label: "Handmade in Jaipur", icon: Sparkles },
  { label: "Worldwide Shipping", icon: Globe2 },
  { label: "Wholesale Available", icon: Handshake },
  { label: "Custom Orders Welcome", icon: BadgeCheck },
] as const;

export function HeroBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-[#173f4f] text-white">
      <Image
        src="/Banner 2.png"
        alt="Hand block printed textiles from Jaipur"
        fill
        priority
        sizes="100vw"
        className="z-[-2] object-cover"
      />
      <div className="absolute inset-0 z-[-1] bg-[linear-gradient(90deg,rgba(12,43,54,0.72)_0%,rgba(12,43,54,0.54)_50%,rgba(12,43,54,0.72)_100%)]" />

      <div className="container-app flex min-h-[560px] items-center justify-center py-16 text-center sm:min-h-[620px] lg:min-h-[660px]">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-bold leading-[1.04] text-white sm:text-5xl lg:text-7xl">
            {BRAND.headline}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/86 sm:text-lg lg:text-xl">
            {BRAND.subheadline}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#173f4f] shadow-lg shadow-black/10 transition-colors hover:bg-[#f5c76b]"
            >
              Shop Collection
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/wholesale"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/70 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#173f4f]"
            >
              Wholesale Inquiry
            </Link>
          </div>

          <div className="mx-auto mt-9 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <div key={item.label} className="flex items-center justify-center gap-2 rounded-lg bg-black/10 px-3 py-3 ring-1 ring-white/16">
                <item.icon className="shrink-0 text-[#f5c76b]" size={18} />
                <span className="text-xs font-semibold uppercase leading-5 tracking-[0.12em] text-white/88">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
