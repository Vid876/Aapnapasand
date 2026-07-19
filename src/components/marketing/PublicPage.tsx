import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2, Headphones, PackageCheck, RefreshCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { BRAND } from "@/lib/brand";

export const PUBLIC_IMAGES = {
  hero: "/Banner 2.png",
  boutique: "/uploads/03cd6105-7d88-47a4-a9bd-71e5f5091c0a.jpg",
  accessories: "/uploads/2cb32606-e0ed-4c52-a7bf-9fdd6c611a46.jpg",
  tableLinen: "/uploads/35b92bf7-8b77-4d97-aa17-08c098563992.jpg",
  fabric: "/uploads/0bc7ea6a-63ec-4f94-b172-cedeeb3e05bb.jpg",
  studio: "/Banner.png",
  delivery: "/festive-luxury-banner.png",
  wardrobe: "/uploads/81df845a-7e09-4d19-8ec9-d2070af19f80.jpg",
  collectionEdit: "/uploads/0bc7ea6a-63ec-4f94-b172-cedeeb3e05bb.jpg",
  customerCare: "/uploads/fe5baa5d-7097-490c-8285-aa999c83a438.jpg",
  latestEdit: "/uploads/c2f8595c-a6c3-4af0-902c-6745cf9d2572.jpg",
  artisanStory: "/About Us.jpeg",
  printProcess: "/uploads/c2be09e5-5152-45d4-b944-7b08c05b5fe7.jpg",
  returnsCare: "/uploads/178300f0-6701-4689-b622-58ec74d604e9.jpg",
  saleEdit: "/uploads/823a002a-109f-4faa-8d05-3df30b32ee00.jpg",
  shippingCare: "/uploads/etsy-4535112365.jpg",
  wholesale: "/uploads/etsy-4535112365.jpg",
  journal: "/uploads/da4dc09d-b211-4a8d-93fc-61ccb18e0256.jpg",
  privacy: "/uploads/fac084e7-92de-419b-8a15-df732dd4ead4.webp",
  terms: "/uploads/bb78ff61-4bde-45a4-a08d-ec130891e0aa.jpg",
} as const;

type PageHeroProps = {
  title: string;
  description: string;
  image: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  imagePosition?: string;
  imageFit?: "cover" | "contain";
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
  imagePosition = "center",
  imageFit = "cover",
  children,
}: PageHeroProps) {
  return (
    <section className="bg-white">
      <div className="container-app grid gap-10 py-12 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:py-20">
        <div className="min-w-0 max-w-2xl">
          <h1 className="break-words text-4xl font-display font-bold leading-[1.05] text-brand-950 [overflow-wrap:anywhere] sm:text-5xl lg:text-6xl">
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
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 52vw"
            className={imageFit === "contain" ? "object-contain" : "object-cover"}
            style={{ objectPosition: imagePosition }}
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
    { icon: Truck, title: "Worldwide shipping", text: "International shipping and customs guidance are confirmed before dispatch." },
    { icon: RefreshCcw, title: "Clear return support", text: "Eligible unused pieces can be reviewed under the return policy." },
    { icon: ShieldCheck, title: "Secure checkout", text: "UPI, cards, net banking, wallets, and cash on delivery where available." },
    { icon: Headphones, title: "Custom and wholesale help", text: "Human support for bulk orders, custom sizing, and catalog requests." },
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
  imagePosition?: string;
  imageFit?: "cover" | "contain";
};

export function InfoBand({
  title,
  text,
  image,
  reverse,
  bullets = [],
  imagePosition = "center",
  imageFit = "cover",
}: InfoBandProps) {
  return (
    <section className="py-14 lg:py-20">
      <div className="container-app grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className={`relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-brand-50 lg:aspect-[5/4] ${reverse ? "lg:order-2" : ""}`}>
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={imageFit === "contain" ? "object-contain" : "object-cover"}
            style={{ objectPosition: imagePosition }}
          />
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
          <h2 className="text-3xl font-display font-bold lg:text-4xl">
            Ready to explore Jaipur hand block printed textiles?
          </h2>
          <p className="mt-3 text-sm leading-7 text-brand-100">
            Shop home linen, table linen, fashion, accessories, fabric by yard, and custom wholesale possibilities from {BRAND.name}.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-950 transition-colors hover:bg-brand-100"
        >
          Shop Collection
          <PackageCheck size={17} />
        </Link>
      </div>
    </section>
  );
}
