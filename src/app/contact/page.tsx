import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero, PUBLIC_IMAGES, PromiseStrip, SectionHeader } from "@/components/marketing/PublicPage";

const contactCards = [
  { icon: Mail, title: "Email", text: "support@bohoblockprinted.com" },
  { icon: Phone, title: "Phone", text: "+91 98765 43210" },
  { icon: MapPin, title: "Delivery", text: "Shipping across India" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="We are here to help"
        description="Questions about sizing, delivery, returns, or styling? Send a message and our support team will help you choose with confidence."
        image={PUBLIC_IMAGES.studio}
        primaryHref="/faq"
        primaryLabel="Read FAQs"
        secondaryHref="/shipping"
        secondaryLabel="Shipping Info"
      />

      <section className="py-16 lg:py-24">
        <div className="container-app grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionHeader
              title="Contact BOHOBLOCKPRINTED"
              description="Use the form for order support, product questions, partnership notes, or feedback."
            />
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {contactCards.map((item) => (
                <div key={item.title} className="rounded-xl border border-brand-100 bg-white p-5">
                  <item.icon className="text-brand-700" size={22} />
                  <h3 className="mt-4 text-sm font-semibold text-brand-950">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <form className="rounded-[1.25rem] bg-brand-50/80 p-5 shadow-sm sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-brand-950">Name</label>
                <input type="text" className="mt-2 w-full rounded-lg border border-brand-100 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-950">Email</label>
                <input type="email" className="mt-2 w-full rounded-lg border border-brand-100 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" required />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-brand-950">Subject</label>
              <input type="text" className="mt-2 w-full rounded-lg border border-brand-100 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-brand-950">Message</label>
              <textarea rows={6} className="mt-2 w-full rounded-lg border border-brand-100 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" required />
            </div>
            <button type="submit" className="mt-6 inline-flex rounded-lg bg-brand-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800">
              Send Message
            </button>
          </form>
        </div>
      </section>
      <PromiseStrip />
    </>
  );
}

