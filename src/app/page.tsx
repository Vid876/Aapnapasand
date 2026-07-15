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
