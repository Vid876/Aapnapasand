import type { Metadata } from "next";
import ShopClient from "./ShopClient";

type ShopPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const params = await searchParams;
  const hasFilters = Object.keys(params).some((key) => key !== "page" || String(params[key] || "1") !== "1");
  return {
    title: "Shop Hand Block Printed Textiles",
    description: "Shop artisan-made hand block printed bedding, table linen, bandanas, kaftans, sarongs, bags, curtains, and fabric from Jaipur, India.",
    alternates: { canonical: "/shop" },
    robots: hasFilters ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title: "Shop Hand Block Printed Textiles", description: "Explore BOHOBLOCKPRINTED artisan collections from Jaipur.", url: "/shop", images: ["/image.png"] },
  };
}

export default function ShopPage() {
  return <ShopClient />;
}
