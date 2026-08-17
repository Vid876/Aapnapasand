import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Globe2,
  Handshake,
  Sparkles,
} from "lucide-react";
import { WHOLESALE_INQUIRY_HREF } from "@/lib/brand";

const HIGHLIGHTS = [
  { label: "Handmade in Jaipur", icon: Sparkles },
  { label: "Worldwide Shipping", icon: Globe2 },
  { label: "Wholesale Available", icon: Handshake },
  { label: "Custom Orders Welcome", icon: BadgeCheck },
] as const;

export function HeroBanner() {
  return (
    <section className="relative isolate h-[75vh] min-h-[550px] overflow-hidden bg-[#122934] text-white">
      {/* Banner Image */}
      <Image
        src="/cover image.png"
        alt="Jaipur artisan hand block printing beside a hand block printed bedroom collection"
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover object-center"
      />
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(5,19,25,0.2)_0%,rgba(9,31,40,0.24)_25%,rgba(8,29,38,0.2)_75%,rgba(5,19,25,0.26)_100%)]" />
      <div className="absolute inset-y-0 left-1/2 z-[1] w-[72%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(11,36,47,0.68)_0%,rgba(11,36,47,0.45)_46%,transparent_78%)]" />

      <div className="container-app relative z-10 flex h-full items-center justify-center py-10 text-center">
        <div className="mx-auto max-w-4xl">

          {/* Brand */}
          <div className="mx-auto flex w-fit flex-col items-center text-white">
            <Sparkles size={28} strokeWidth={1.35} />

            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] sm:text-xl">
              BOHOBLOCKPRINTED
            </p>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80 sm:text-xs">
              Handmade in Jaipur
            </p>
          </div>

          {/* Heading */}
          <p className="mt-7 font-display text-2xl italic leading-tight text-[#f3e8d4] sm:text-3xl lg:text-4xl">
            Bringing India&apos;s Heritage
          </p>

          <h1 className="mt-1 font-display text-5xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl">
            to Your Home
          </h1>

          {/* Divider */}
          <div className="mx-auto mt-6 flex max-w-xl items-center gap-4 text-[#ead9b9]">
            <span className="h-px flex-1 bg-current/55" />

            <Sparkles size={17} strokeWidth={1.4} />

            <span className="h-px flex-1 bg-current/55" />
          </div>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white sm:text-base lg:text-lg">
            Authentic Hand Block Printed Textiles made by skilled artisans of
            Jaipur.

            <span className="block">Timeless designs. Natural fabrics. Made with love.</span>
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-wrap justify-center gap-3">

            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#173f4f] px-7 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white shadow-lg shadow-black/15 transition-colors hover:bg-[#245d70]"
            >
              Shop Collection
              <ArrowRight size={17} />
            </Link>

            <Link
              href={WHOLESALE_INQUIRY_HREF}
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/70 bg-transparent px-7 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-[#173f4f]"
            >
              Wholesale Inquiry
            </Link>

          </div>

          {/* Highlights */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center gap-2 px-3 py-2"
              >
                <item.icon
                  className="shrink-0 text-[#ead9b9]"
                  size={25}
                  strokeWidth={1.35}
                />

                <span className="text-[10px] font-semibold uppercase leading-5 tracking-[0.13em] text-white sm:text-xs">
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
