import type { Metadata } from "next";
import { Clock3, Globe2, PackageCheck, Truck } from "lucide-react";
import { PageHero, PUBLIC_IMAGES, PromiseStrip, SectionHeader } from "@/components/marketing/PublicPage";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Worldwide shipping information for BOHOBLOCKPRINTED hand block printed textiles, including processing, customs, tracking, and wholesale dispatch notes.",
};

const steps = [
  { icon: PackageCheck, title: "Order confirmed", text: "You receive confirmation after successful checkout or written custom-order approval." },
  { icon: Clock3, title: "Processing reviewed", text: "Ready items, custom pieces, and wholesale orders have different processing needs that are confirmed before dispatch." },
  { icon: Truck, title: "Packed carefully", text: "Textiles are packed to protect fabric, print surface, and finished stitching during transit." },
  { icon: Globe2, title: "Worldwide delivery", text: "International delivery depends on destination, courier movement, customs clearance, and local duties." },
];

const policyNotes = [
  "Shipping rates and delivery windows may vary by country, order size, courier, product type, and customs process.",
  "Customs duties, taxes, and import fees are usually charged by the destination country and paid by the buyer unless agreed in writing.",
  "Tracking details are shared when available after dispatch.",
  "Wholesale and private-label shipments are confirmed with packing, documentation, and timeline details before order approval.",
];

export default function ShippingPage() {
  return (
    <>
      <PageHero
        title="Worldwide shipping for artisan textiles"
        description="BOHOBLOCKPRINTED ships hand block printed textiles with careful packing, clear order communication, and international customs expectations set before dispatch."
        image={PUBLIC_IMAGES.shippingCare}
        primaryHref="/shop"
        primaryLabel="Shop Collection"
        secondaryHref="/contact"
        secondaryLabel="Need Help?"
      />

      <section className="py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="How delivery works"
            description="The shipping page now supports both retail and wholesale buyers."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.title} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                <step.icon className="text-[#276070]" size={26} />
                <h2 className="mt-5 font-semibold text-stone-950">{step.title}</h2>
                <p className="mt-2 text-sm leading-7 text-stone-600">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl bg-[#173f4f] p-6 text-white lg:p-8">
            <h2 className="font-display text-3xl font-bold">Important shipping notes</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {policyNotes.map((note) => (
                <p key={note} className="rounded-lg bg-white/10 p-4 text-sm leading-7 text-white/82">
                  {note}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
      <PromiseStrip />
    </>
  );
}
