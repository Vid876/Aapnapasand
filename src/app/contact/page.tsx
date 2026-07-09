import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero, PUBLIC_IMAGES, PromiseStrip, SectionHeader } from "@/components/marketing/PublicPage";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact BOHOBLOCKPRINTED for order support, wholesale inquiries, custom block print textiles, fabric by yard, and Jaipur artisan textile questions.",
};

const contactCards = [
  { icon: Mail, title: "Email", text: BRAND.email, href: `mailto:${BRAND.email}` },
  { icon: Phone, title: "Phone", text: BRAND.phoneDisplay, href: BRAND.phoneHref },
  { icon: MapPin, title: "Origin", text: BRAND.location },
];

const inquiryTypes = [
  "Retail order support",
  "Wholesale inquiry",
  "Custom printing",
  "Private label",
  "Fabric by yard",
  "Catalog request",
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact BOHOBLOCKPRINTED"
        description="Ask about orders, worldwide shipping, wholesale, custom printing, private label, fabric by yard, or artisan textile details."
        image={PUBLIC_IMAGES.studio}
        primaryHref="/faq"
        primaryLabel="Read FAQs"
        secondaryHref="/wholesale"
        secondaryLabel="Wholesale"
      />

      <section className="py-16 lg:py-24">
        <div className="container-app grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionHeader
              title="How can we help?"
              description="Use the form for retail support, custom-order planning, wholesale catalog requests, or product questions."
            />
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {contactCards.map((item) => (
                <div key={item.title} className="rounded-lg border border-stone-200 bg-white p-5">
                  <item.icon className="text-[#276070]" size={22} />
                  <h2 className="mt-4 text-sm font-semibold text-stone-950">{item.title}</h2>
                  {item.href ? (
                    <a href={item.href} className="mt-1 block break-all text-sm text-stone-600 hover:text-[#173f4f]">
                      {item.text}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-stone-600">{item.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <form className="rounded-xl bg-[#eef4f0] p-5 shadow-sm sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-stone-950">Name</label>
                <input type="text" className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#276070]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-950">Email</label>
                <input type="email" className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#276070]" required />
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-stone-950">Phone or WhatsApp</label>
                <input type="tel" className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#276070]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-950">Inquiry Type</label>
                <select className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#276070]">
                  {inquiryTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-stone-950">Message</label>
              <textarea rows={6} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#276070]" required />
            </div>
            <button type="submit" className="mt-6 inline-flex rounded-lg bg-[#173f4f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#245d70]">
              Send Message
            </button>
          </form>
        </div>
      </section>
      <PromiseStrip />
    </>
  );
}
