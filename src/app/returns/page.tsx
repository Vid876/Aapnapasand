import { CheckCircle2, RefreshCcw, ShieldCheck } from "lucide-react";
import { PageHero, PUBLIC_IMAGES, SectionHeader } from "@/components/marketing/PublicPage";

const rules = [
  "Return or exchange requests should be raised within 7 days of delivery.",
  "Items must be unused, unwashed, and returned with tags and original packaging.",
  "Refunds are processed after the returned item passes quality inspection.",
  "Exchange availability depends on size, color, and current stock.",
];

export default function ReturnsPage() {
  return (
    <>
      <PageHero
        title="Easy returns and exchanges"
        description="Shopping online should feel comfortable. Eligible BOHOBLOCKPRINTED orders can be returned or exchanged with a simple support process."
        image={PUBLIC_IMAGES.studio}
        primaryHref="/contact"
        primaryLabel="Start a Request"
        secondaryHref="/faq"
        secondaryLabel="Read FAQs"
      />

      <section className="bg-brand-50/70 py-16 lg:py-24">
        <div className="container-app grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeader
              title="Return policy"
              description="A few simple guidelines help us keep returns smooth and fair."
            />
            <div className="rounded-[1.25rem] bg-brand-950 p-6 text-white lg:p-8">
              <RefreshCcw className="text-brand-200" size={28} />
              <h2 className="mt-5 font-display text-3xl font-bold">7-day support window</h2>
              <p className="mt-3 text-sm leading-7 text-brand-100">
                Contact support with your order number and reason. We will guide you through next steps.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            {rules.map((rule) => (
              <div key={rule} className="flex gap-4 rounded-xl bg-white p-5 shadow-sm">
                <CheckCircle2 className="mt-0.5 shrink-0 text-brand-700" size={20} />
                <p className="text-sm leading-7 text-gray-700">{rule}</p>
              </div>
            ))}
            <div className="flex gap-4 rounded-xl bg-white p-5 shadow-sm">
              <ShieldCheck className="mt-0.5 shrink-0 text-brand-700" size={20} />
              <p className="text-sm leading-7 text-gray-700">
                Final approval depends on product condition and policy eligibility.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

