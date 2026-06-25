import { HelpCircle } from "lucide-react";
import { PageHero, PUBLIC_IMAGES, SectionHeader } from "@/components/marketing/PublicPage";

const faqs = [
  {
    q: "What is your return policy?",
    a: "Eligible unused products can be returned or exchanged within 7 days of delivery with tags and original packaging.",
  },
  {
    q: "How long does shipping take?",
    a: "Standard delivery usually takes 3 to 7 business days. Express delivery is available in selected cities.",
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes. Orders above Rs. 999 qualify for free standard shipping across India.",
  },
  {
    q: "What payment methods are accepted?",
    a: "You can pay with UPI, credit cards, debit cards, net banking, wallets, and cash on delivery where available.",
  },
  {
    q: "How do I track my order?",
    a: "After dispatch, tracking details are sent by email and SMS. You can also check order status from your account.",
  },
  {
    q: "Can I exchange a size?",
    a: "Yes, size exchanges are supported for eligible products while stock is available.",
  },
];

export default function FAQPage() {
  return (
    <>
      <PageHero
        title="Questions, answered clearly"
        description="Find quick help for orders, delivery, returns, sizing, payments, and shopping with Aapnapasand."
        image={PUBLIC_IMAGES.delivery}
        primaryHref="/contact"
        primaryLabel="Contact Support"
        secondaryHref="/size-guide"
        secondaryLabel="Size Guide"
      />

      <section className="bg-brand-50/70 py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="Frequently asked questions"
            description="Everything important before and after you place an order."
          />
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl bg-white p-6 shadow-sm">
                <HelpCircle className="text-brand-700" size={22} />
                <h3 className="mt-4 font-semibold text-brand-950">{faq.q}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
