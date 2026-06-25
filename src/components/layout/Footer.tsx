import Image from "next/image";
import Link from "next/link";
import {
  Instagram,
  Facebook,
  Twitter,
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

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-app py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/logo.png"
                alt="Apna Pasand"
                width={300}
                height={150}
                className="h-14 w-auto rounded-lg bg-white p-2 object-contain"
                priority
              />
            </Link>

            <p className="text-sm leading-7 text-gray-400 mb-5">
              Discover premium Indian fashion designed for everyday elegance,
              festive celebrations, and timeless style. Shop quality clothing
              that blends tradition with modern trends.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 transition hover:bg-brand-600 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>

              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 transition hover:bg-brand-600 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>

              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 transition hover:bg-brand-600 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">
              Shop
            </h4>

            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">
              Help
            </h4>

            <ul className="space-y-3">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">
              Contact
            </h4>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-brand-400" />
                <span className="text-sm">
                  support@apnapasand.com
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-brand-400" />
                <span className="text-sm">
                  +91 9305993685
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-app flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Apna Pasand. All Rights Reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-gray-500 transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-gray-500 transition hover:text-white"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}