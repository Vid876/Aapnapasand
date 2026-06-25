import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function FestiveEdit() {
  return (
    <section className="relative overflow-hidden py-14 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(181,116,63,0.2),transparent_32%),radial-gradient(circle_at_88%_70%,rgba(127,45,33,0.18),transparent_30%)]" />
      <div className="container-app relative">
        <div className="grid overflow-hidden rounded-[1.35rem] bg-brand-950 shadow-2xl shadow-brand-950/20 md:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-[330px] overflow-hidden bg-[linear-gradient(135deg,#552016_0%,#7b281d_48%,#321611_100%)] px-7 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,214,153,0.1)_0_1px,transparent_1px_34px)]" />
            <div className="absolute left-8 top-8 h-[76%] w-[72%] rounded-t-[7rem] border border-brand-300/30" />
            <div className="absolute left-12 top-12 h-[66%] w-[58%] rounded-t-[6rem] border border-brand-300/20" />
            <div className="relative flex h-full flex-col justify-center">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-brand-200/35 bg-white/10 text-brand-100">
                <Sparkles size={22} />
              </div>
              <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
                The Festive Edit
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-brand-50/86">
                Timeless pieces for wedding nights, family moments, and celebrations that deserve a softer glow.
              </p>
              <Link
                href="/collections"
                className="mt-7 inline-flex w-fit min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-brand-950 shadow-lg shadow-black/10 transition-colors hover:bg-brand-100"
              >
                Explore festive collection
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <Link href="/shop?category=ethnic-wear" className="group relative min-h-[330px] overflow-hidden">
            <Image
              src="/Banner 2.png"
              alt="Festive ethnic wear collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 58vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,25,18,0.36),transparent_38%,rgba(47,25,18,0.16))]" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 rounded-xl bg-white/82 px-4 py-3 text-brand-950 shadow-xl shadow-brand-950/15 backdrop-blur sm:left-auto sm:right-6 sm:w-[320px]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Curated occasion wear</p>
                <p className="mt-1 font-display text-xl font-bold">Sarees, kurtas and classics</p>
              </div>
              <ArrowRight className="shrink-0 text-brand-700" size={18} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
