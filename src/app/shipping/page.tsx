import { Clock3, PackageCheck, Truck } from "lucide-react";
import { PageHero, PUBLIC_IMAGES, PromiseStrip, SectionHeader } from "@/components/marketing/PublicPage";

const steps = [
  { icon: PackageCheck, title: "Order confirmed", text: "You receive confirmation after successful checkout." },
  { icon: Clock3, title: "Packed carefully", text: "Most orders are packed within 24 to 48 business hours." },
  { icon: Truck, title: "Delivered to you", text: "Standard delivery usually takes 3 to 7 business days across India." },
];

export default function ShippingPage() {
  return (
    <>
      <PageHero
        title="Shipping that keeps you updated"
        description="Aapnapasand ships across India with clear order updates, careful packaging, and free standard shipping above Rs. 999."
        image={PUBLIC_IMAGES.delivery}
        primaryHref="/shop"
        primaryLabel="Continue Shopping"
        secondaryHref="/contact"
        secondaryLabel="Need Help?"
      />

      <section className="py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="How delivery works"
            description="Simple steps from checkout to doorstep."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className="rounded-xl border border-brand-100 bg-white p-6 shadow-sm">
                <step.icon className="text-brand-700" size={26} />
                <h2 className="mt-5 font-semibold text-brand-950">{step.title}</h2>
                <p className="mt-2 text-sm leading-7 text-gray-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PromiseStrip />
    </>
  );
}
