import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Handshake, Mail, Phone } from "lucide-react";
import { WholesaleInquiryForm } from "@/components/wholesale/WholesaleInquiryForm";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Wholesale Inquiry",
  description:
    "Send BOHOBLOCKPRINTED your wholesale, bulk manufacturing, private label, custom packaging, or catalog requirements.",
};

const inquiryBenefits = [
  "Wholesale and bulk manufacturing support",
  "Private labels and custom packaging",
  "Custom sizes, fabrics, and product requirements",
  "Worldwide business order planning",
] as const;

export default function WholesaleInquiryPage() {
  return (
    <main className="min-h-screen bg-[#eef4f0] py-8 sm:py-12 lg:py-16">
      <div className="container-app">
        <Link
          href="/wholesale"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#173f4f] transition hover:text-[#b87811]"
        >
          <ArrowLeft size={16} />
          View wholesale services
        </Link>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12">
          <section className="order-2 lg:order-1 lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b87811]">
              Wholesale inquiry
            </p>
            <h1
              id="inquiry-form-heading"
              className="mt-3 font-display text-3xl font-bold leading-tight text-stone-950 sm:text-4xl lg:text-5xl"
            >
              Tell us what your business needs
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
              Complete the form and share your product, quantity, sizing,
              branding, or catalog requirements. Our team will review your
              request and contact you with the next steps.
            </p>

            <div className="mt-7 rounded-2xl bg-[#173f4f] p-6 text-white shadow-lg shadow-[#173f4f]/10">
              <Handshake className="text-[#f5c76b]" size={30} />
              <h2 className="mt-4 font-display text-2xl font-bold">
                Business order support
              </h2>
              <ul className="mt-4 space-y-3">
                {inquiryBenefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm leading-6 text-white/85">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-[#f5c76b]" size={17} />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-3 border-t border-white/15 pt-5 text-sm text-white/85">
                <a href={`mailto:${BRAND.email}`} className="flex items-center gap-3 hover:text-white">
                  <Mail size={16} /> {BRAND.email}
                </a>
                <a href={BRAND.phoneHref} className="flex items-center gap-3 hover:text-white">
                  <Phone size={16} /> {BRAND.phoneDisplay}
                </a>
              </div>
            </div>
          </section>

          <section
            id="inquiry-form"
            className="order-1 scroll-mt-28 lg:order-2"
            aria-labelledby="inquiry-form-heading"
          >
            <WholesaleInquiryForm />
          </section>
        </div>
      </div>
    </main>
  );
}
