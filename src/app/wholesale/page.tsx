import type { Metadata } from "next";
import { FileText, Handshake, Mail, PackageCheck, PenLine, Ruler, Shirt, Timer } from "lucide-react";
import { PageHero, PUBLIC_IMAGES, PromiseStrip, SectionHeader } from "@/components/marketing/PublicPage";
import { BRAND, WHOLESALE_FIELDS } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Wholesale",
  description:
    "Wholesale, custom printing, private label, custom sizing, fabric, and catalog inquiries for BOHOBLOCKPRINTED hand block printed textiles from Jaipur.",
};

const wholesaleItems = [
  { icon: PackageCheck, title: "MOQ", text: "Minimum order quantity is confirmed by product type, fabric, print complexity, sampling needs, and packing requirements." },
  { icon: Shirt, title: "Production capacity", text: "Capacity is shared after the product mix, sizes, fabric bases, finishing details, and target timeline are reviewed." },
  { icon: Timer, title: "Lead time", text: "Lead time is quoted before order confirmation and depends on sampling, printing, stitching, quality inspection, and packing." },
  { icon: PenLine, title: "Custom printing", text: "Discuss print direction, colorways, repeat scale, placement prints, fabric base, and sample approval before production." },
  { icon: FileText, title: "Private label", text: "Private label, packaging, barcodes, buyer documents, and catalog needs can be reviewed for wholesale orders." },
  { icon: Ruler, title: "Custom sizes", text: "Sizing is handled through measurement specs, approved samples, tolerance notes, and written confirmation." },
];

export default function WholesalePage() {
  return (
    <>
      <PageHero
        title="Wholesale hand block printed textiles"
        description="A professional inquiry path for boutiques, interior studios, hotels, event buyers, brands, makers, and catalog buyers who need Jaipur artisan textile production."
        image={PUBLIC_IMAGES.studio}
        primaryHref="/contact"
        primaryLabel="Start Inquiry"
        secondaryHref="/fabric"
        secondaryLabel="Explore Fabric"
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="Wholesale program details"
            description="The page avoids inventing operational promises until product scope, quantity, and timeline are confirmed."
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

      <section className="bg-[#eef4f0] py-16 lg:py-24">
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
