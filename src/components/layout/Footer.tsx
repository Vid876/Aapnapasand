import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone } from "lucide-react";

const FOOTER_LINKS = {
  shop: [
    { label: "Men", href: "/shop?gender=men" },
    { label: "Women", href: "/shop?gender=women" },
    { label: "New Arrivals", href: "/shop?sort=newest" },
    { label: "Sale", href: "/shop" },
  ],
  help: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              Aapnapasand
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              Your destination for premium Indian fashion. Quality clothing for men and women,
              delivered across India.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">
              Help
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail size={16} />
                <span>support@aapnapasand.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-app py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Aapnapasand. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
