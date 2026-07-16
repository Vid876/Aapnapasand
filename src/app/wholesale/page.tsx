import type { Metadata } from "next";
import { FileText, Handshake, Mail, PackageCheck, PenLine, Ruler, Shirt, Timer, Truck } from "lucide-react";
import { PageHero, PUBLIC_IMAGES, PromiseStrip, SectionHeader } from "@/components/marketing/PublicPage";
import { BRAND, WHOLESALE_FIELDS } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Wholesale & Private Label Services",
  description:
    "Wholesale, custom printing, private label, custom sizing, fabric, and catalog inquiries for BOHOBLOCKPRINTED hand block printed textiles from Jaipur.",
};

const wholesaleItems = [
  { icon: Handshake, title: "Wholesale Orders", text: "Flexible wholesale support for boutiques, retailers, hotels, designers, and brands." },
  { icon: PackageCheck, title: "Bulk Manufacturing", text: "Bulk production planning based on product type, quantity, fabric, and finishing requirements." },
  { icon: PenLine, title: "Custom Manufacturing", text: "Custom products, prints, colorways, and specifications can be developed for your business." },
  { icon: FileText, title: "Private Label Services", text: "Private label manufacturing for brands, boutiques, retailers, and wholesalers." },
  { icon: Shirt, title: "Custom Labeling", text: "Custom brand labels and buyer-specific product identification options." },
  { icon: PackageCheck, title: "Custom Packaging", text: "Packaging solutions can be planned around your brand and shipping needs." },
  { icon: Ruler, title: "Custom Sizes", text: "Sizing is handled through measurement specifications, approved samples, and written confirmation." },
  { icon: Timer, title: "MOQ Information", text: "Minimum order quantity is confirmed by product type, fabric, print complexity, sampling, and packaging needs." },
  { icon: Truck, title: "Worldwide Shipping", text: "Orders are carefully packed and prepared for shipping to customers and businesses worldwide." },
];

export default function WholesalePage() {
  return (
    <>
      <PageHero
        title="Wholesale & Private Label Services"
        description="We offer custom manufacturing, private labeling, custom packaging, and bulk production services for businesses worldwide."
        image={PUBLIC_IMAGES.wholesale}
        primaryHref="/contact"
        primaryLabel="Start Inquiry"
        secondaryHref="/fabric"
        secondaryLabel="Explore Fabric"
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="Services for Your Business"
            description="From wholesale supply to custom branding, we help businesses build distinctive textile collections."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wholesaleItems.map((item) => (
              <div key={item.title} className="rounded-lg border border-stone-200 bg-[#fbfaf7] p-6 shadow-sm">
                <item.icon className="text-[#276070]" size={24} />
                <h2 className="mt-5 font-semibold text-stone-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-stone-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="inquiry-form" className="scroll-mt-24 bg-[#eef4f0] py-16 lg:py-24">
        <div className="container-app grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeader
              title="What to include in your inquiry"
              description="Complete inquiries help confirm MOQ, sampling needs, catalog fit, and realistic lead time."
            />
            <div className="rounded-xl bg-[#173f4f] p-6 text-white lg:p-8">
              <Handshake className="text-[#f5c76b]" size={30} />
              <h2 className="mt-5 font-display text-3xl font-bold">Wholesale catalog request</h2>
              <p className="mt-3 text-sm leading-7 text-white/78">
                Ask for available product categories, fabric bases, print direction, custom sizing, private label, and production planning. The team can respond from {BRAND.email}.
              </p>
            </div>
          </div>

          <form className="rounded-xl bg-white p-5 shadow-sm sm:p-8">
            <label className="mb-4 block text-sm font-medium text-stone-950">
              Inquiry service
              <select className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#276070]">
                <option>Wholesale Orders</option>
                <option>Bulk Manufacturing</option>
                <option>Private Label Services</option>
                <option>Custom Labeling</option>
                <option>Custom Packaging</option>
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              {WHOLESALE_FIELDS.slice(0, 6).map((field) => (
                <label key={field} className="block text-sm font-medium text-stone-950">
                  {field}
                  <input
                    type={field.toLowerCase().includes("email") ? "email" : "text"}
                    className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#276070]"
                  />
                </label>
              ))}
            </div>
            <label className="mt-4 block text-sm font-medium text-stone-950">
              {WHOLESALE_FIELDS[6]}
              <textarea
                rows={6}
                className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#276070]"
              />
            </label>
            <button
              type="submit"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#173f4f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#245d70]"
            >
              <Mail size={16} />
              Request Catalog
            </button>
          </form>
        </div>
      </section>

      <PromiseStrip />
    </>
  );
}
