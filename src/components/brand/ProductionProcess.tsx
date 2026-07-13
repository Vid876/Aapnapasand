import Image from "next/image";
import { SectionHeader } from "@/components/marketing/PublicPage";

const PROCESS_STEPS = [
  { title: "Wooden Block Carving", text: "Traditional wooden blocks are carefully handcrafted by skilled artisans.", image: "/Wooden Block.jpeg" },
  { title: "Hand Block Printing", text: "Each design is hand printed using traditional block printing techniques.", image: "/Printing.jpeg" },
  { title: "Natural Drying Process", text: "Printed fabrics are naturally dried to preserve color and quality.", image: "/Drying Area.jpeg" },
  { title: "Quality Inspection", text: "Every product undergoes careful quality inspection before packing.", image: "/Quality Cheak.jpeg" },
  { title: "Packing & Shipping", text: "Products are professionally packed with custom labeling options and prepared for worldwide shipping.", image: "/Packing and Shipping.jpeg" },
] as const;

export function ProductionProcess() {
  return (
    <section className="bg-[#eef4f0] py-16 lg:py-24">
      <div className="container-app">
        <SectionHeader
          align="center"
          title="Our Production Process"
          description="From hand-carved wooden blocks to careful worldwide dispatch."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS_STEPS.map((step, index) => (
            <article key={step.title} className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="relative aspect-[4/3] bg-stone-100">
                <Image src={step.image} alt={step.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw" className="object-cover" />
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#276070]">Step {index + 1}</p>
                <h3 className="mt-2 font-semibold text-stone-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
