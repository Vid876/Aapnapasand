import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Newsletter } from "@/components/home/Newsletter";
import {
  BulkOrdersBanner,
  CustomerReviewsSection,
  HeroIntroText,
  InstagramFeedSection,
  PrivateLabelSection,
  WhyChooseSection,
} from "@/components/home/HomeBrandSections";
import { ProductionProcess } from "@/components/brand/ProductionProcess";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hand Block Printed Textiles from Jaipur",
  description: "Shop authentic hand block printed bedding, table linen, bandanas, kaftans, sarongs, bags, curtains, fabric, and wholesale textiles handmade in Jaipur.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "BOHOBLOCKPRINTED - Handmade Textiles from Jaipur",
    description: "Authentic artisan-made hand block printed textiles with worldwide shipping and wholesale support.",
    images: [{ url: "/cover image.png", alt: "BOHOBLOCKPRINTED hand block printed textiles from Jaipur" }],
  },
};

export const revalidate = 300;

export default function HomePage() {
  return (
    <div className="home-page-bg">
      <HeroBanner />

      <HeroIntroText />

      <CategoryGrid />

      <FeaturedProducts />

      <WhyChooseSection />

      <ProductionProcess />

      <PrivateLabelSection />

      <CustomerReviewsSection />

      <InstagramFeedSection />

      <Newsletter />

      <BulkOrdersBanner />
    </div>
  );
}
