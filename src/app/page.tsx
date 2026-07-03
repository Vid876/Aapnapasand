import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { LuxuryFestiveBanner } from "@/components/home/LuxuryFestiveBanner";
import { TrendingSection } from "@/components/home/TrendingSection";
import { Newsletter } from "@/components/home/Newsletter";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="home-page-bg">
      <HeroBanner />

      <CategoryGrid />

      <FeaturedProducts />

      <LuxuryFestiveBanner />

      <TrendingSection />

      <Newsletter />
    </div>
  );
}
