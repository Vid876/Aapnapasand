import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Instagram, Mail, MapPin, Phone, ShoppingBag, Store } from "lucide-react";
import { BRAND, CATEGORY_GROUPS } from "@/lib/brand";

const FOOTER_LINKS = {
  shop: [
    { label: "Shop All", href: "/shop" },
    ...CATEGORY_GROUPS.map((category) => ({ label: category.name, href: category.href })),
    { label: "Wholesale", href: "/wholesale" },
  ],
  help: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Return Policy", href: "/returns" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/our-story" },
    { label: "Hand Block Printing Process", href: "/process" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

const SOCIAL_LINKS = [
  { label: "Instagram", href: BRAND.instagram, icon: Instagram },
  { label: "Pinterest", href: BRAND.pinterest, icon: ExternalLink },
  { label: "Etsy Shop", href: BRAND.etsy, icon: Store },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#173f4f] text-white">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.055)_0_1px,transparent_1px_42px),linear-gradient(135deg,rgba(201,144,46,0.25),transparent_44%,rgba(31,63,115,0.26))]" />
      <div className="relative container-app py-14 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.82fr_0.82fr_0.92fr_1.12fr] lg:gap-10">
          <div>
            <Link
              href="/"
              className="mb-6 inline-flex rounded-xl bg-white/95 p-3 shadow-lg shadow-black/15"
            >
              <Image
                src="/Logo.png"
                alt={BRAND.name}
                width={360}
                height={160}
                className="h-24 w-auto object-contain sm:h-28"
              />
            </Link>

            <h3 className="mb-3 text-2xl font-bold text-white">{BRAND.name}</h3>
            <p className="max-w-sm text-sm leading-7 text-white/78">
              Hand block printed home decor, table linen, fashion, accessories, fabric by yard, custom orders, and wholesale textiles from Jaipur.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 p-3 text-white ring-1 ring-white/10 transition duration-300 hover:bg-[#f5c76b] hover:text-[#173f4f]"
                  aria-label={link.label}
                >
                  <link.icon size={19} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">
              Shop
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/76 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">
              Help
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/76 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">
              Company
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/76 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">
              Contact
            </h4>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Mail size={20} className="mt-1 flex-shrink-0 text-[#f5c76b]" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/55">Email Address</p>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="break-all text-sm text-white transition hover:text-[#f5c76b]"
                  >
                    {BRAND.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={20} className="mt-1 flex-shrink-0 text-[#f5c76b]" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/55">Mobile</p>
                  <a
                    href={BRAND.phoneHref}
                    className="text-sm text-white transition hover:text-[#f5c76b]"
                  >
                    {BRAND.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={20} className="mt-1 flex-shrink-0 text-[#f5c76b]" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/55">Origin</p>
                  <p className="text-sm text-white">{BRAND.location}</p>
                </div>
              </div>

              <Link
                href="/wholesale"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[#173f4f] transition-colors hover:bg-[#f5c76b]"
              >
                Wholesale Inquiry
                <ShoppingBag size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-app flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-sm text-white/70">
            &copy; {new Date().getFullYear()} {BRAND.name}. All Rights Reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/shipping" className="text-white/70 transition hover:text-white">
              Worldwide Shipping
            </Link>
            <Link href="/returns" className="text-white/70 transition hover:text-white">
              Return Policy
            </Link>
            <Link href="/terms" className="text-white/70 transition hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
