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
    <section
      className="
        relative isolate
        h-[250px]
        w-full
        overflow-hidden
        text-white
        sm:h-[650px]
        lg:h-[75vh]
        lg:min-h-[600px]
      "
    >
      {/* ==================================
          FULL BANNER IMAGE
      =================================== */}
      <Image
        src="/cover image.png"
        alt="Jaipur artisan hand block printed textiles"
        fill
        priority
        sizes="100vw"
        className="
          z-0
          object-cover
          object-center
        "
      />

      {/* ==================================
          DARK OVERLAY
          only for text readability
      =================================== */}
      <div
        className="
          absolute inset-0 z-[1]
          bg-black/20
          sm:bg-[linear-gradient(90deg,rgba(5,19,25,0.28)_0%,rgba(9,31,40,0.28)_50%,rgba(5,19,25,0.28)_100%)]
        "
      />

      {/* ==================================
          CONTENT
      =================================== */}
      <div
        className="
          absolute inset-0 z-10
          flex
          h-full
          w-full
          items-center
          justify-center
          px-3
          text-center
          sm:px-6
        "
      >
        <div className="mx-auto w-full max-w-4xl">

          {/* ==================================
              BRAND
              Hidden on mobile
          =================================== */}
          <div className="mx-auto hidden w-fit flex-col items-center sm:flex">
            <Sparkles
              className="text-[#f3e8d4]"
              size={25}
              strokeWidth={1.35}
            />

            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] lg:text-xl">
              BOHOBLOCKPRINTED
            </p>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/90 lg:text-xs">
              Handmade in Jaipur
            </p>
          </div>

          {/* ==================================
              MAIN HEADING
          =================================== */}
          <p
            className="
              font-display
              text-[18px]
              italic
              leading-[1.05]
              text-[#f3e8d4]

              sm:mt-6
              sm:text-3xl

              lg:text-4xl
            "
          >
            Bringing India&apos;s Heritage
          </p>

          <h1
            className="
              mt-[2px]
              font-display
              text-[34px]
              font-semibold
              leading-[0.95]
              text-white
              drop-shadow-md

              sm:text-6xl
              lg:text-7xl
            "
          >
            to Your Home
          </h1>

          {/* ==================================
              DIVIDER
          =================================== */}
          <div
            className="
              mx-auto
              mt-3
              flex
              max-w-[260px]
              items-center
              gap-3
              text-[#ead9b9]

              sm:mt-6
              sm:max-w-xl
              sm:gap-4
            "
          >
            <span className="h-px flex-1 bg-current/70" />

            <Sparkles
              className="h-[13px] w-[13px] sm:h-[17px] sm:w-[17px]"
              strokeWidth={1.4}
            />

            <span className="h-px flex-1 bg-current/70" />
          </div>

          {/* ==================================
              DESCRIPTION
          =================================== */}
          <p
            className="
              mx-auto
              mt-3
              max-w-[390px]
              text-[9px]
              font-semibold
              leading-[14px]
              text-white
              drop-shadow-md

              sm:mt-5
              sm:max-w-2xl
              sm:text-base
              sm:font-normal
              sm:leading-7

              lg:text-lg
            "
          >
            Authentic Hand Block Printed Textiles made by skilled artisans of
            Jaipur.

            <span className="block">
              Timeless designs. Natural fabrics. Made with love.
            </span>
          </p>

          {/* ==================================
              BUTTONS
          =================================== */}
          <div
            className="
              mx-auto
              mt-4
              flex
              w-full
              max-w-[370px]
              items-center
              justify-center
              gap-2

              sm:mt-7
              sm:max-w-none
              sm:gap-3
            "
          >
            {/* SHOP BUTTON */}
            <Link
              href="/shop"
              className="
                inline-flex
                h-[34px]
                flex-1
                items-center
                justify-center
                gap-1.5
                rounded-[4px]
                bg-[#173f4f]
                px-2
                text-[8px]
                font-bold
                uppercase
                tracking-[0.04em]
                text-white
                shadow-md
                transition-colors
                hover:bg-[#245d70]

                sm:h-12
                sm:flex-none
                sm:px-7
                sm:text-sm
                sm:tracking-[0.1em]
              "
            >
              Shop Collection

              <ArrowRight
                className="h-[11px] w-[11px] sm:h-[17px] sm:w-[17px]"
              />
            </Link>

            {/* WHOLESALE BUTTON */}
            <Link
              href={WHOLESALE_INQUIRY_HREF}
              className="
                inline-flex
                h-[34px]
                flex-1
                items-center
                justify-center
                rounded-[4px]
                border
                border-white/90
                bg-black/15
                px-2
                text-[8px]
                font-bold
                uppercase
                tracking-[0.04em]
                text-white
                backdrop-blur-[1px]
                transition-colors
                hover:bg-white
                hover:text-[#173f4f]

                sm:h-12
                sm:flex-none
                sm:px-7
                sm:text-sm
                sm:tracking-[0.1em]
              "
            >
              Wholesale Inquiry
            </Link>
          </div>

          {/* ==================================
              HIGHLIGHTS
              Hidden on mobile
          =================================== */}
          <div
            className="
              mx-auto
              mt-8
              hidden
              max-w-3xl
              grid-cols-4
              gap-3
              sm:grid
            "
          >
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.label}
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-2
                  px-3
                  py-2
                "
              >
                <item.icon
                  className="shrink-0 text-[#ead9b9]"
                  size={25}
                  strokeWidth={1.35}
                />

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    leading-5
                    tracking-[0.13em]
                    text-white
                    lg:text-xs
                  "
                >
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