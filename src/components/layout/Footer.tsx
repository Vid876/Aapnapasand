import Image from "next/image";
import Link from "next/link";
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
} from "lucide-react";

const FOOTER_LINKS = {
  shop: [
    { label: "Shop All", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Sale", href: "/sale" },
    { label: "Men", href: "/shop?gender=men" },
    { label: "Women", href: "/shop?gender=women" },
  ],
  help: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns & Refunds", href: "/returns" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "LinkedIn", href: "#", icon: Linkedin },
  { label: "YouTube", href: "#", icon: Youtube },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-950 text-brand-50">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.055)_0_1px,transparent_1px_42px),linear-gradient(135deg,rgba(181,116,63,0.28),transparent_42%,rgba(255,255,255,0.06))]" />
      <div className="relative container-app py-14 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.8fr_1.1fr] lg:gap-10">
          <div>
            <Link
              href="/"
              className="mb-6 inline-flex rounded-xl bg-white/95 p-3 shadow-lg shadow-black/15"
            >
              <Image
                src="/Logo.png"
                alt="BOHOBLOCKPRINTED"
                width={360}
                height={160}
                priority
                className="h-24 w-auto object-contain sm:h-28"
              />
            </Link>

            <h3 className="mb-3 text-2xl font-bold text-white">
              BOHOBLOCKPRINTED
            </h3>
            <p className="max-w-sm text-sm leading-7 text-brand-100">
              Premium block printed fashion with refined colors, thoughtful fits, and everyday comfort.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 p-3 text-brand-50 ring-1 ring-white/10 transition duration-300 hover:bg-brand-400 hover:text-brand-950"
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
                    className="text-sm text-brand-100 transition hover:text-white"
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
                    className="text-sm text-brand-100 transition hover:text-white"
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
                    className="text-sm text-brand-100 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">
              Contact Us
            </h4>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Mail size={20} className="mt-1 flex-shrink-0 text-brand-300" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand-300">
                    Email
                  </p>
                  <a
                    href="mailto:support@bohoblockprinted.com"
                    className="text-sm text-brand-50 transition hover:text-white break-all"
                  >
                    support@bohoblockprinted.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={20} className="mt-1 flex-shrink-0 text-brand-300" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand-300">
                    Mobile
                  </p>
                  <a
                    href="tel:+918955379671"
                    className="text-sm text-brand-50 transition hover:text-white"
                  >
                    +91 89553 79671
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-app flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-sm text-brand-200">
            &copy; {new Date().getFullYear()} BOHOBLOCKPRINTED. All Rights Reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/about" className="text-brand-200 transition hover:text-white">
              About Us
            </Link>
            <Link href="/privacy" className="text-brand-200 transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-brand-200 transition hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
