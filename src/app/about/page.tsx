import { CTASection, InfoBand, PageHero, PUBLIC_IMAGES, PromiseStrip, SectionHeader } from "@/components/marketing/PublicPage";

const values = [
  "Premium fabrics selected for comfort in Indian weather",
  "Contemporary silhouettes that still feel rooted and wearable",
  "Honest pricing, secure checkout, and dependable support",
  "Collections for everyday confidence and special occasions",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Fashion chosen with feeling"
        description="BOHOBLOCKPRINTED curates Indian fashion for people who want clothes that look polished, feel comfortable, and express their own sense of style."
        image={PUBLIC_IMAGES.boutique}
        primaryHref="/collections"
        primaryLabel="Explore Collections"
        secondaryHref="/contact"
        secondaryLabel="Talk to Us"
      />

      <section className="bg-brand-50/70 py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="What guides every collection"
            description="The store is built around quality, confidence, and practical beauty."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value} className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-sm leading-7 text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InfoBand
        title="Made for the modern Indian wardrobe"
        text="From easy office staples to festive pieces with presence, our selections balance clean design, strong fabric, and styling flexibility."
        image={PUBLIC_IMAGES.fabric}
        reverse
        bullets={["Men's and women's edits", "Ethnic and everyday categories", "Fast delivery across India"]}
      />
      <PromiseStrip />
      <CTASection />
    </>
  );
}

