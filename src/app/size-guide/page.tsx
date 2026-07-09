import { Ruler, Shirt, Sparkles } from "lucide-react";
import { PageHero, PUBLIC_IMAGES, SectionHeader } from "@/components/marketing/PublicPage";

const sizeRows = [
  ["XS", "32-34", "26-28", "Slim fit"],
  ["S", "34-36", "28-30", "Regular fit"],
  ["M", "38-40", "32-34", "Regular fit"],
  ["L", "40-42", "34-36", "Relaxed fit"],
  ["XL", "42-44", "36-38", "Relaxed fit"],
  ["XXL", "44-46", "38-40", "Comfort fit"],
];

const tips = [
  { icon: Ruler, title: "Measure the product area", text: "For home and table linen, compare listed dimensions with the bed, table, or use case." },
  { icon: Shirt, title: "Compare with a favorite garment", text: "Flat measurements are often the easiest way to pick a familiar fit." },
  { icon: Sparkles, title: "Between sizes?", text: "Choose the larger size for relaxed silhouettes, layering, and easy movement." },
];

export default function SizeGuidePage() {
  return (
    <>
      <PageHero
        title="Size guide for textile products"
        description="Use this guide for quick sizing confidence across kaftans, sarongs, beach cover-ups, bedding, table linen, accessories, and fabric yardage."
        image={PUBLIC_IMAGES.wardrobe}
        primaryHref="/shop"
        primaryLabel="Shop Now"
        secondaryHref="/contact"
        secondaryLabel="Ask Support"
      />

      <section className="bg-brand-50/70 py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            title="General size chart"
            description="Measurements are approximate body measurements in inches. Product pages may include more specific fit notes."
          />
          <div className="overflow-hidden rounded-[1.25rem] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-brand-950 text-white">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Size</th>
                    <th className="px-5 py-4 font-semibold">Chest / Bust</th>
                    <th className="px-5 py-4 font-semibold">Waist</th>
                    <th className="px-5 py-4 font-semibold">Fit note</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeRows.map((row) => (
                    <tr key={row[0]} className="border-b border-brand-100 last:border-0">
                      {row.map((cell) => (
                        <td key={cell} className="px-5 py-4 text-gray-700">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {tips.map((tip) => (
              <div key={tip.title} className="rounded-xl bg-white p-6 shadow-sm">
                <tip.icon className="text-brand-700" size={24} />
                <h2 className="mt-4 font-semibold text-brand-950">{tip.title}</h2>
                <p className="mt-2 text-sm leading-7 text-gray-600">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
