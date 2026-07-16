import { FileText, PackageCheck, ShieldCheck } from "lucide-react";
import { PageHero, PUBLIC_IMAGES, SectionHeader } from "@/components/marketing/PublicPage";

const terms = [
  {
    title: "Using the website",
    text: "You agree to provide accurate account, shipping, and payment information when shopping on BOHOBLOCKPRINTED.",
  },
  {
    title: "Product information",
    text: "We aim to keep prices, images, availability, and descriptions accurate, but details may change due to stock or operational updates.",
  },
  {
    title: "Orders and payments",
    text: "Orders are confirmed after successful payment authorization or cash-on-delivery eligibility checks where applicable.",
  },
  {
    title: "Returns and exchanges",
    text: "Eligible returns and exchanges are governed by our returns policy and product condition review.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms of service"
        description="The practical terms for browsing, ordering, paying, returning, and using BOHOBLOCKPRINTED services."
        image={PUBLIC_IMAGES.terms}
        primaryHref="/shop"
        primaryLabel="Back to Shop"
        secondaryHref="/privacy"
        secondaryLabel="Privacy Policy"
      />

      <section className="bg-brand-50/70 py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            title="Customer terms"
            description="Use this page as customer-friendly terms and review with your legal advisor before public launch."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {terms.map((term) => (
              <div key={term.title} className="rounded-xl bg-white p-6 shadow-sm">
                <FileText className="text-brand-700" size={22} />
                <h2 className="mt-4 font-semibold text-brand-950">{term.title}</h2>
                <p className="mt-2 text-sm leading-7 text-gray-600">{term.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 rounded-[1.25rem] bg-brand-950 p-6 text-white md:grid-cols-2 lg:p-8">
            <div className="flex gap-4">
              <ShieldCheck className="shrink-0 text-brand-200" size={22} />
              <p className="text-sm leading-7 text-brand-100">Secure checkout and account protection remain important parts of the service.</p>
            </div>
            <div className="flex gap-4">
              <PackageCheck className="shrink-0 text-brand-200" size={22} />
              <p className="text-sm leading-7 text-brand-100">Delivery, returns, and refunds follow the active policies linked in the footer.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

