type ReviewLike = {
  rating: number;
};

type ProductWithRating = {
  rating: number;
  reviewCount: number;
  sourceReviews?: ReviewLike[];
};

export function toPublicProductRating<T extends ProductWithRating>(
  product: T,
  additionalReviews: ReviewLike[] = []
): T {
  const eligibleSourceReviews = (product.sourceReviews || []).filter(
    (review) => review.rating >= 3 && review.rating <= 5
  );
  const eligibleAdditionalReviews = additionalReviews.filter(
    (review) => review.rating >= 3 && review.rating <= 5
  );
  const visibleReviews = [...eligibleSourceReviews, ...eligibleAdditionalReviews];

  if (visibleReviews.length) {
    const rating =
      visibleReviews.reduce((sum, review) => sum + review.rating, 0) /
      visibleReviews.length;
    return {
      ...product,
      sourceReviews: eligibleSourceReviews,
      rating: Math.round(rating * 10) / 10,
      reviewCount: visibleReviews.length,
    };
  }

  if (product.rating >= 3 && product.rating <= 5) {
    return { ...product, sourceReviews: eligibleSourceReviews };
  }

  return {
    ...product,
    sourceReviews: eligibleSourceReviews,
    rating: 0,
    reviewCount: 0,
  };
}
