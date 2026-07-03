import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LuxuryFestiveBanner() {
  return (
    <section className="py-10 lg:py-14">
      <Link
        href="/collections"
        aria-label="Explore the Festive Edit collection"
        className="group relative block min-h-[340px] overflow-hidden bg-brand-950 shadow-2xl shadow-brand-950/25 sm:min-h-[380px] lg:min-h-[430px]"
      >
        <Image
          src="/festive-luxury-banner.png"
          alt="The Festive Edit"
          fill
          sizes="100vw"
          className="object-cover object-[72%_center] transition-transform duration-700 group-hover:scale-[1.03]"
          priority={false}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(42,15,9,0.14)_0%,rgba(42,15,9,0.54)_100%)] sm:bg-[linear-gradient(90deg,rgba(42,15,9,0.99)_0%,rgba(67,21,12,0.97)_36%,rgba(76,24,13,0.38)_62%,rgba(18,8,5,0.08)_100%)]" />
        <div className="absolute inset-y-0 left-0 hidden w-[50%] bg-[linear-gradient(90deg,rgba(48,17,10,0.92),rgba(48,17,10,0.64),transparent)] sm:block" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(231,184,105,0.18),transparent_24rem),linear-gradient(180deg,transparent_55%,rgba(14,6,4,0.22))]" />

        <div className="container-app">
          <div className="relative z-10 flex min-h-[340px] items-center px-5 py-10 sm:min-h-[380px] sm:px-8 lg:min-h-[430px] lg:px-14">
            <div className="max-w-xl text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-200">
                Aapnapasand luxury edit
              </p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.38)] sm:text-5xl lg:text-6xl">
                The Festive Edit
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/82 sm:text-base">
                Timeless pieces for celebrations, intimate moments, and occasions that deserve a softer glow.
              </p>
              <span className="mt-8 inline-flex min-h-10 items-center gap-2 border-0 bg-transparent px-0 text-sm font-semibold text-white underline underline-offset-8 transition-colors group-hover:text-brand-100 sm:min-h-12 sm:rounded-lg sm:bg-white sm:px-5 sm:text-brand-950 sm:no-underline sm:group-hover:bg-brand-100 sm:group-hover:text-brand-950">
                Explore festive collection
                <ArrowRight size={16} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
