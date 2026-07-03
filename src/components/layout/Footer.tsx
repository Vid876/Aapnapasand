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

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-app py-14 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-14">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/Logo.png"
                alt="Manisha Exports"
                width={1000}
                height={450}
                priority
                className="h-44 md:h-48 lg:h-52 w-auto object-contain"
              />
            </Link>

            <h3 className="mb-3 text-2xl font-bold text-white">
              Manisha Exports
            </h3>

            

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 p-3 transition duration-300 hover:bg-brand-600 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 p-3 transition duration-300 hover:bg-brand-600 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 p-3 transition duration-300 hover:bg-brand-600 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 p-3 transition duration-300 hover:bg-brand-600 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 p-3 transition duration-300 hover:bg-brand-600 hover:text-white"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">
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
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">
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
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">
              Contact Us
            </h4>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Mail
                  size={20}
                  className="mt-1 text-brand-400 flex-shrink-0"
                />

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Email
                  </p>

                  <a
                    href="mailto:gothwaldinesh1999@gmail.com"
                    className="text-sm text-gray-300 transition hover:text-white break-all"
                  >
                    gothwaldinesh1999@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  size={20}
                  className="mt-1 text-brand-400 flex-shrink-0"
                />

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Mobile
                  </p>

                  <a
                    href="tel:+918955379671"
                    className="text-sm text-gray-300 transition hover:text-white"
                  >
                    +91 89553 79671
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-app flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Manisha Exports. All Rights Reserved.
          </p>

          <div className="flex flex-wrap gap-6 text-sm">
            <Link
              href="/about"
              className="text-gray-500 transition hover:text-white"
            >
              About Us
            </Link>

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
