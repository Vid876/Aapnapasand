import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { ProductionProcess } from "@/components/brand/ProductionProcess";

export const metadata: Metadata = {
  title: "About Us",
  description: "About Bohoblockprinted, a Jaipur-based hand block printed textile manufacturer and exporter.",
};

const products = [
  "Hand Block Printed Napkins", "Linen & Cotton Tablecloths", "Duvet Covers & Bedding Sets",
  "Kaftans & Beachwear", "Bandanas & Scarves", "Tote Bags & Accessories", "Custom Textile Products",
] as const;

const reasons = [
  "Handmade by Skilled Artisans", "Authentic Traditional Block Printing", "Premium Cotton & Linen Fabrics",
  "Custom Sizes & Bulk Orders Available", "Worldwide Shipping", "Wholesale & Private Label Services",
  "Trusted by Thousands of Customers Worldwide",
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="bg-white py-12 lg:py-20">
        <div className="container-app grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#276070]">Jaipur, Rajasthan, India</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-stone-950 sm:text-5xl">About Bohoblockprinted</h1>
            <div className="mt-6 space-y-5 text-base leading-8 text-stone-700">
              <p>Welcome to Bohoblockprinted, a Jaipur-based textile brand dedicated to preserving the rich heritage of Indian hand block printing. We specialize in creating beautifully handcrafted home textiles, table linens, bedding, apparel, and accessories that blend traditional craftsmanship with modern design.</p>
              <p>Our journey began with a passion for authentic handmade textiles and a commitment to supporting skilled artisans who have practiced the art of block printing for generations. Every product is thoughtfully crafted using traditional wooden blocks, carefully selected fabrics, and meticulous attention to detail.</p>
            </div>
          </div>
          <div className="relative aspect-[1536/1036] w-full overflow-hidden rounded-2xl bg-stone-100 shadow-xl">
            <Image
              src="/About Us.jpeg"
              alt="Bohoblockprinted artisan textile studio"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#eef4f0] py-16 lg:py-20">
        <div className="container-app grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-stone-950">What We Manufacture &amp; Export</h2>
            <p className="mt-4 leading-7 text-stone-700">Based in Rajasthan, India, we manufacture and export a wide range of products including:</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {products.map((product) => <li key={product} className="flex gap-3 rounded-lg bg-white p-4 text-sm font-medium text-stone-800"><CheckCircle2 className="shrink-0 text-[#276070]" size={20} />{product}</li>)}
            </ul>
          </div>
          <div className="space-y-5 leading-8 text-stone-700">
            <p>We work closely with artisans and small production teams to ensure that each piece reflects the beauty and uniqueness of handmade craftsmanship. Because our products are individually handcrafted, slight variations in color and pattern are a natural part of the process and make every item truly one of a kind.</p>
            <p>Over the years, our products have reached customers across the United States, Europe, Australia, and many other countries. We are proud to share the timeless art of Indian block printing with homes and businesses around the world.</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-app">
          <h2 className="text-center font-display text-3xl font-bold text-stone-950">Why Choose Us?</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason) => <div key={reason} className="flex gap-3 rounded-lg border border-stone-200 bg-[#fbfaf7] p-5"><CheckCircle2 className="shrink-0 text-[#276070]" size={21} /><p className="text-sm font-semibold leading-6 text-stone-800">{reason}</p></div>)}
          </div>
          <div className="mx-auto mt-12 max-w-4xl space-y-5 text-center leading-8 text-stone-700">
            <p>Whether you are looking for unique home décor, sustainable textiles, or wholesale manufacturing solutions, Bohoblockprinted is committed to delivering quality, authenticity, and exceptional customer service.</p>
            <p>Thank you for supporting handmade craftsmanship and being part of our journey.</p>
            <p className="font-semibold text-stone-950">Bohoblockprinted<br />Hand Block Printed Textile Manufacturer &amp; Exporter<br />Jaipur, Rajasthan, India</p>
            <Link href="/wholesale" className="inline-flex rounded-lg bg-[#173f4f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#245d70]">Wholesale &amp; Private Label Services</Link>
          </div>
        </div>
      </section>
      <ProductionProcess />
    </>
  );
}
