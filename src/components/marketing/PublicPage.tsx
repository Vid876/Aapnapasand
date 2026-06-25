import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2, Headphones, PackageCheck, RefreshCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";

export const PUBLIC_IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&q=85",
  boutique:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=85",
  mens:
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&q=85",
  ethnic:
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=85",
  fabric:
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=85",
  studio:
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=85",
  delivery:
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=85",
  wardrobe:
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=85",
} as const;

type PageHeroProps = {
  title: string;
  description: string;
  image: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  children?: ReactNode;
};

export function PageHero({
  title,
  description,
  image,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  children,
}: PageHeroProps) {
  return (
    <section className="bg-white">
      <div className="container-app grid gap-10 py-12 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-display font-bold leading-[1.05] text-brand-950 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-gray-600 lg:text-lg">
            {description}
          </p>
          {(primaryHref || secondaryHref) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryHref && primaryLabel && (
                <Link
                  href={primaryHref}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
                >
                  {primaryLabel}
                  <ArrowRight size={17} />
                </Link>
              )}
              {secondaryHref && secondaryLabel && (
                <Link
                  href={secondaryHref}
                  className="inline-flex items-center justify-center rounded-lg border border-brand-900 px-6 py-3 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-50"
                >
                  {secondaryLabel}
                </Link>
              )}
            </div>
          )}
          {children}
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-[1.25rem] bg-brand-50 shadow-2xl shadow-brand-950/10 lg:min-h-[520px]">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-950/45 to-transparent" />
        </div>
      </div>
    </section>
  );
}

type SectionHeaderProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({ title, description, align = "left" }: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "mx-auto mb-10 max-w-2xl text-center" : "mb-10 max-w-2xl"}>
      <h2 className="text-3xl font-display font-bold leading-tight text-brand-950 lg:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-3 text-sm leading-7 text-gray-600 lg:text-base">{description}</p>}
    </div>
  );
}

export function PromiseStrip() {
  const items = [
    { icon: Truck, title: "Fast India-wide delivery", text: "Free shipping above Rs. 999 with careful packing." },
    { icon: RefreshCcw, title: "7-day easy returns", text: "Simple exchanges and return support for eligible items." },
    { icon: ShieldCheck, title: "Secure checkout", text: "UPI, cards, net banking, wallets, and cash on delivery." },
    { icon: Headphones, title: "Human support", text: "Style and order help when you need it." },
  ];

  return (
    <section className="border-y border-brand-100 bg-brand-50/70">
      <div className="container-app grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
              <item.icon size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-950">{item.title}</h3>
              <p className="mt-1 text-xs leading-5 text-gray-600">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

type InfoBandProps = {
  title: string;
  text: string;
  image: string;
  reverse?: boolean;
  bullets?: string[];
};

export function InfoBand({ title, text, image, reverse, bullets = [] }: InfoBandProps) {
  return (
    <section className="py-14 lg:py-20">
      <div className="container-app grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className={`relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-brand-50 lg:aspect-[5/4] ${reverse ? "lg:order-2" : ""}`}>
          <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="max-w-xl">
          <h2 className="text-3xl font-display font-bold leading-tight text-brand-950 lg:text-5xl">{title}</h2>
          <p className="mt-5 text-base leading-8 text-gray-600">{text}</p>
          {bullets.length > 0 && (
            <ul className="mt-7 space-y-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-brand-600" size={18} />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="bg-brand-950 py-14 text-white lg:py-20">
      <div className="container-app flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-brand-200">
            <Sparkles size={20} />
          </div>
          <h2 className="text-3xl font-display font-bold lg:text-4xl">Ready to refresh your wardrobe?</h2>
          <p className="mt-3 text-sm leading-7 text-brand-100">
            Explore pieces made for daily confidence, festive plans, gifting, and every mood between.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-950 transition-colors hover:bg-brand-100"
        >
          Shop All Styles
          <PackageCheck size={17} />
        </Link>
      </div>
    </section>
  );
}
