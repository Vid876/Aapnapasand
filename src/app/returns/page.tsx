import type { Metadata } from "next";
import { CheckCircle2, RefreshCcw, ShieldCheck } from "lucide-react";
import { PageHero, PUBLIC_IMAGES, SectionHeader } from "@/components/marketing/PublicPage";

export const metadata: Metadata = {
  title: "Return Policy",
  description:
    "Return and exchange guidance for BOHOBLOCKPRINTED hand block printed textiles, including unused condition, custom orders, wholesale orders, and inspection.",
};

const rules = [
  "Return or exchange requests should be raised promptly after delivery with the order number and photos if there is a product concern.",
  "Items must be unused, unwashed, unstained, unaltered, and returned with tags, packaging, and invoice details where applicable.",
  "Refunds or exchanges are processed only after the returned textile passes quality inspection.",
  "Custom, made-to-order, private-label, and wholesale items may be final sale or governed by written order terms.",
  "Natural hand block print variation is not treated as a defect unless the product is materially different from the confirmed order.",
];

export default function ReturnsPage() {
  return (
    <>
      <PageHero
        title="Return policy for handmade textiles"
        description="Eligible BOHOBLOCKPRINTED orders can be reviewed through a clear support process, with special handling for custom, made-to-order, and wholesale pieces."
        image={PUBLIC_IMAGES.returnsCare}
        primaryHref="/contact"
        primaryLabel="Start a Request"
        secondaryHref="/faq"
        secondaryLabel="Read FAQs"
      />

      <section className="bg-[#eef4f0] py-16 lg:py-24">
        <div className="container-app grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeader
              title="Return and exchange guidelines"
              description="These rules help protect customers while respecting the nature of handmade printed textiles."
            />
            <div className="rounded-xl bg-[#173f4f] p-6 text-white lg:p-8">
              <RefreshCcw className="text-[#f5c76b]" size={28} />
              <h2 className="mt-5 font-display text-3xl font-bold">Support before return</h2>
              <p className="mt-3 text-sm leading-7 text-white/78">
                Contact support with the order number, product photos, and reason. The team will confirm eligibility and next steps before anything is sent back.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            {rules.map((rule) => (
              <div key={rule} className="flex gap-4 rounded-lg bg-white p-5 shadow-sm">
                <CheckCircle2 className="mt-0.5 shrink-0 text-[#276070]" size={20} />
                <p className="text-sm leading-7 text-stone-700">{rule}</p>
              </div>
            ))}
            <div className="flex gap-4 rounded-lg bg-white p-5 shadow-sm">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#276070]" size={20} />
              <p className="text-sm leading-7 text-stone-700">
                Final approval depends on product condition, order type, and the active policy confirmed at purchase.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
