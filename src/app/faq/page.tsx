import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { PageHero, PUBLIC_IMAGES, SectionHeader } from "@/components/marketing/PublicPage";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about BOHOBLOCKPRINTED shipping, customs, returns, care, wholesale, custom orders, sizing, and payments.",
};

const faqs = [
  {
    q: "Do you ship worldwide?",
    a: "Yes. BOHOBLOCKPRINTED supports international inquiries and worldwide shipping. Exact shipping cost, customs paperwork, and dispatch details are confirmed during checkout or support follow-up.",
  },
  {
    q: "Who pays customs and duties?",
    a: "Import duties, taxes, and customs charges are usually set by the destination country and are the buyer's responsibility unless a written wholesale or custom-order agreement says otherwise.",
  },
  {
    q: "How long does shipping take?",
    a: "Ready-to-ship orders are packed after order processing. International delivery windows vary by destination, courier, customs clearance, and product availability.",
  },
  {
    q: "What is your return policy?",
    a: "Eligible unused, unwashed products can be reviewed for return or exchange under the return policy. Custom, made-to-order, and wholesale items may have different terms confirmed before order approval.",
  },
  {
    q: "How should I care for block printed textiles?",
    a: "Wash separately in cold water with mild detergent, avoid bleach, dry in shade where possible, and expect the small variations that come with hand printed textiles.",
  },
  {
    q: "Do you take wholesale orders?",
    a: "Yes. Boutiques, interior studios, hotels, event buyers, and brands can request MOQ, production capacity, lead time, private label, catalog, and custom sizing details from the wholesale page.",
  },
  {
    q: "Can I place a custom order?",
    a: "Custom printing, custom sizing, private label, and fabric requests can be discussed. Operational details are confirmed after the product scope, quantity, and timeline are reviewed.",
  },
  {
    q: "Can I buy fabric by yard?",
    a: "Yes. The Fabric collection is built for block print fabric by yard and custom textile projects.",
  },
  {
    q: "Are hand block prints identical every time?",
    a: "No. Slight color, placement, and pressure variations are part of the handmade process and help distinguish hand block printing from machine-perfect production.",
  },
  {
    q: "How do I contact support?",
    a: `Email ${BRAND.email} or call ${BRAND.phoneDisplay} for order support, wholesale questions, custom orders, and product guidance.`,
  },
];

export default function FAQPage() {
  return (
    <>
      <PageHero
        title="Questions, answered clearly"
        description="Find quick help for worldwide shipping, customs, returns, textile care, wholesale, custom orders, sizing, payments, and shopping with BOHOBLOCKPRINTED."
        image={PUBLIC_IMAGES.customerCare}
        primaryHref="/contact"
        primaryLabel="Contact Support"
        secondaryHref="/wholesale"
        secondaryLabel="Wholesale Inquiry"
      />

      <section className="bg-[#eef4f0] py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="Frequently asked questions"
            description="Built for real buyers first, with clear internal links into policies, wholesale, fabric, and support."
          />
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-lg bg-white p-6 shadow-sm">
                <HelpCircle className="text-[#276070]" size={22} />
                <h2 className="mt-4 font-semibold text-stone-950">{faq.q}</h2>
                <p className="mt-2 text-sm leading-7 text-stone-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
