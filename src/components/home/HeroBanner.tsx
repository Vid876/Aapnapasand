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
        relative
        isolate
        w-full
        aspect-[1920/850]
        overflow-hidden
        bg-[#f2e7d8]
      "
    >
      {/* ==================================
          EXACT FULL BANNER IMAGE
          1920 x 850
          NO CROPPING
      =================================== */}
      <Image
        src="/banner 11.png"
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
          CONTENT
      =================================== */}
      <div
        className="
          absolute
          inset-0
          z-10
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
              HIDDEN ON MOBILE
          =================================== */}
          <div className="mx-auto hidden w-fit flex-col items-center sm:flex">
            <Sparkles
              className="text-[#936d48]"
              size={25}
              strokeWidth={1.35}
            />

            <p
              className="
                mt-2
                text-sm
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#173f4f]
                lg:text-xl
              "
            >
              BOHOBLOCKPRINTED
            </p>

            <p
              className="
                mt-1
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.28em]
                text-[#765c44]
                lg:text-xs
              "
            >
              Handmade in Jaipur
            </p>
          </div>

          {/* ==================================
              MAIN HEADING
          =================================== */}
          <p
            className="
              font-display
              text-[15px]
              font-semibold
              italic
              leading-[1.05]
              text-[#8b6542]

              sm:mt-5
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
              text-[29px]
              font-semibold
              leading-[0.95]
              text-[#173f4f]

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
              mt-2
              flex
              max-w-[220px]
              items-center
              gap-3
              text-[#987149]

              sm:mt-5
              sm:max-w-xl
              sm:gap-4
            "
          >
            <span className="h-px flex-1 bg-current/70" />

            <Sparkles
              className="
                h-[12px]
                w-[12px]
                sm:h-[17px]
                sm:w-[17px]
              "
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
              mt-2
              max-w-[330px]
              text-[8px]
              font-bold
              leading-[12px]
              text-[#294c57]

              sm:mt-4
              sm:max-w-2xl
              sm:text-base
              sm:font-medium
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
              mt-3
              flex
              w-full
              max-w-[320px]
              items-center
              justify-center
              gap-2

              sm:mt-6
              sm:max-w-none
              sm:gap-3
            "
          >
            {/* SHOP COLLECTION */}
            <Link
              href="/shop"
              className="
                inline-flex
                h-[30px]
                flex-1
                items-center
                justify-center
                gap-1.5
                rounded-[4px]
                bg-[#173f4f]
                px-2
                text-[7px]
                font-bold
                uppercase
                tracking-[0.04em]
                text-white
                shadow-md
                transition-colors
                duration-300

                hover:bg-[#285b6b]

                sm:h-12
                sm:flex-none
                sm:px-7
                sm:text-sm
                sm:tracking-[0.1em]
              "
            >
              Shop Collection

              <ArrowRight
                className="
                  h-[10px]
                  w-[10px]
                  sm:h-[17px]
                  sm:w-[17px]
                "
              />
            </Link>

            {/* WHOLESALE */}
            <Link
              href={WHOLESALE_INQUIRY_HREF}
              className="
                inline-flex
                h-[30px]
                flex-1
                items-center
                justify-center
                rounded-[4px]
                border
                border-[#173f4f]
                bg-[#f5ecdf]/90
                px-2
                text-[7px]
                font-bold
                uppercase
                tracking-[0.04em]
                text-[#173f4f]
                transition-colors
                duration-300

                hover:bg-[#173f4f]
                hover:text-white

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
              HIDDEN ON MOBILE
          =================================== */}
          <div
            className="
              mx-auto
              mt-7
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
                  className="shrink-0 text-[#987149]"
                  size={25}
                  strokeWidth={1.35}
                />

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    leading-5
                    tracking-[0.13em]
                    text-[#173f4f]
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