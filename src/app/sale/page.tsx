import Link from "next/link";
import { ArrowRight, BadgePercent, ShieldCheck, Truck } from "lucide-react";
import { PageHero, PUBLIC_IMAGES, SectionHeader } from "@/components/marketing/PublicPage";

const saleLinks = [
  { title: "Under Rs. 999", href: "/shop?maxPrice=999&sort=price-asc" },
  { title: "Men's Sale", href: "/shop?gender=men&sort=price-asc" },
  { title: "Women's Sale", href: "/shop?gender=women&sort=price-asc" },
  { title: "Top Rated Deals", href: "/shop?sort=rating" },
];

export default function SalePage() {
  return (
    <>
      <PageHero
        title="Sale styles worth keeping"
        description="Find polished pieces at sharper prices, from everyday essentials to festive extras. Use code WELCOME10 for an additional welcome offer."
        image={PUBLIC_IMAGES.fabric}
        primaryHref="/shop?sort=price-asc"
        primaryLabel="Shop Sale"
        secondaryHref="/shipping"
        secondaryLabel="Shipping Details"
      />

      <section className="py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="Shop offers by mood"
            description="Quick routes to the pieces customers usually look for first."
          />
          <div className="grid gap-4 md:grid-cols-4">
            {saleLinks.map((link) => (
              <Link key={link.title} href={link.href} className="group rounded-xl border border-brand-100 bg-white p-6 shadow-sm transition-colors hover:bg-brand-50">
                <BadgePercent className="text-brand-700" size={24} />
                <h2 className="mt-5 font-semibold text-brand-950">{link.title}</h2>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                  Explore <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-10 grid gap-4 rounded-[1.25rem] bg-brand-950 p-6 text-white md:grid-cols-2 lg:p-8">
            <div className="flex gap-4">
              <Truck className="shrink-0 text-brand-200" size={24} />
              <p className="text-sm leading-7 text-brand-100">Free shipping applies above Rs. 999 even during sale periods.</p>
            </div>
            <div className="flex gap-4">
              <ShieldCheck className="shrink-0 text-brand-200" size={24} />
              <p className="text-sm leading-7 text-brand-100">Secure payments and eligible returns remain available on sale orders.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
