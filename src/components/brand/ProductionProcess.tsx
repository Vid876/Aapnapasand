import Image from "next/image";
import { SectionHeader } from "@/components/marketing/PublicPage";

const PROCESS_STEPS = [
  {
    title: "Wooden Block Carving",
    text: "Traditional wooden blocks are carefully handcrafted by skilled artisans.",
    image: "/Wooden Block.jpeg",
  },
  {
    title: "Hand Block Printing",
    text: "Each design is hand printed using traditional block printing techniques.",
    image: "/Printing.jpeg",
  },
  {
    title: "Natural Drying Process",
    text: "Printed fabrics are naturally dried to preserve color and quality.",
    image: "/Drying Area.jpeg",
  },
  {
    title: "Quality Inspection",
    text: "Every product undergoes careful quality inspection before packing.",
    image: "/Quality Cheak.jpeg",
  },
  {
    title: "Packing & Shipping",
    text: "Products are professionally packed with custom labeling options and prepared for worldwide shipping.",
    image: "/Packing and Shipping.jpeg",
  },
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {PROCESS_STEPS.map((step, index) => (
            <article
              key={step.title}
              className={`group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-950/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                index < 3 ? "lg:col-span-2" : "lg:col-span-3"
              }`}
            >
              <div className="relative aspect-[1402/1122] w-full bg-stone-100">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain"
                />

                <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-sm font-bold text-[#173f4f] shadow-md">
                  {index + 1}
                </span>
              </div>

              <div className="p-5">
                <h3 className="mt-2 font-semibold text-stone-950">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {step.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}