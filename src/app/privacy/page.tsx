import { Lock, Mail, ShieldCheck } from "lucide-react";
import { PageHero, PUBLIC_IMAGES, SectionHeader } from "@/components/marketing/PublicPage";

const sections = [
  {
    title: "Information we collect",
    text: "We collect information needed to process orders, create accounts, provide support, and improve the shopping experience.",
  },
  {
    title: "How information is used",
    text: "Order details are used for fulfillment, payments, delivery updates, fraud prevention, support, and service communication.",
  },
  {
    title: "Payments and security",
    text: "Payment processing is handled through secure payment partners. We do not store full card details on our servers.",
  },
  {
    title: "Support communication",
    text: "We may contact you about orders, returns, delivery updates, account activity, and customer support requests.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy, written simply"
        description="This page explains how BOHOBLOCKPRINTED handles customer information while you browse, shop, pay, and contact support."
        image={PUBLIC_IMAGES.fabric}
        primaryHref="/contact"
        primaryLabel="Privacy Question"
        secondaryHref="/terms"
        secondaryLabel="Terms"
      />

      <section className="py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            title="Privacy policy"
            description="Use this as a clear customer-facing policy and update it with legal review before launch."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {sections.map((section) => (
              <div key={section.title} className="rounded-xl border border-brand-100 bg-white p-6 shadow-sm">
                <ShieldCheck className="text-brand-700" size={22} />
                <h2 className="mt-4 font-semibold text-brand-950">{section.title}</h2>
                <p className="mt-2 text-sm leading-7 text-gray-600">{section.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 rounded-[1.25rem] bg-brand-50 p-6 md:grid-cols-2 lg:p-8">
            <div className="flex gap-4">
              <Lock className="shrink-0 text-brand-700" size={22} />
              <p className="text-sm leading-7 text-gray-700">Access to customer data should be limited to authorized team members only.</p>
            </div>
            <div className="flex gap-4">
              <Mail className="shrink-0 text-brand-700" size={22} />
              <p className="text-sm leading-7 text-gray-700">For privacy requests, contact support@bohoblockprinted.com.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

