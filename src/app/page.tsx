import { HeroBanner } from "@/components/home/HeroBanner";
import { QuickCollectionBlocks } from "@/components/home/QuickCollectionBlocks";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Newsletter } from "@/components/home/Newsletter";
import {
  ArtisanStorySection,
  CustomerReviewsSection,
  InstagramFeedSection,
  WholesaleProgramSection,
  WhyChooseSection,
} from "@/components/home/HomeBrandSections";

export const revalidate = 300;

export default function HomePage() {
  return (
    <div className="home-page-bg">
      <HeroBanner />

      <QuickCollectionBlocks />

      <CategoryGrid />

      <FeaturedProducts />

      <WhyChooseSection />

      <ArtisanStorySection />

      <WholesaleProgramSection />

      <CustomerReviewsSection />

      <InstagramFeedSection />

      <Newsletter />
    </div>
  );
}
