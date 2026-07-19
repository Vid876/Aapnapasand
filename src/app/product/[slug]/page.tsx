"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  Heart,
  Leaf,
  MapPin,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductImage } from "@/components/products/ProductImage";
import {
  getChoicePrice,
  getChoicePriceRange,
  getConciseProductDescription,
  getProductPurchaseOptions,
  type PurchaseChoice,
} from "@/lib/product-purchase-options";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useTranslation } from "@/store/localeStore";
import type {
  Product,
  ProductSourceReview,
  Review,
} from "@/types";

type DisplayReview = ProductSourceReview & {
  key: string;
  source: "Etsy" | "Etsy shop" | "Bohoblockprinted";
  productName?: string;
  productSlug?: string;
};

type ShopReview = ProductSourceReview & {
  productName: string;
  productSlug: string;
};

function getChoiceLabel(
  choice: PurchaseChoice,
  otherChoices: PurchaseChoice[],
  basePrice: number,
  currency: Product["currency"]
) {
  const range = getChoicePriceRange(basePrice, choice, otherChoices);
  const detail = choice.detail ? ` — ${choice.detail}` : "";
  const price =
    range.min === range.max
      ? formatPrice(range.min, currency)
      : `${formatPrice(range.min, currency)} – ${formatPrice(range.max, currency)}`;

  return `${choice.name}${detail} (${price})`;
}

function splitDescription(value: string, previewLength = 1500) {
  if (value.length <= previewLength) return [value, ""] as const;

  const boundary = Math.max(
    value.lastIndexOf("\n", previewLength),
    value.lastIndexOf(" ", previewLength)
  );
  const safeBoundary = boundary > previewLength * 0.7 ? boundary : previewLength;

  return [
    value.slice(0, safeBoundary).trim(),
    value.slice(safeBoundary).trim(),
  ] as const;
}

function RatingStars({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <div className="flex" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={size}
          className={
            index < Math.round(rating)
              ? "fill-[#f4ad32] text-[#f4ad32]"
              : "text-stone-300"
          }
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: DisplayReview }) {
  const formattedDate = review.createdAt
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(review.createdAt))
    : null;

  return (
    <article className="border-b border-stone-200 pb-7 last:border-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7eee9] font-display text-lg font-bold text-[#173f4f]">
            {review.userName.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-semibold text-stone-950">
              {review.userName}
            </p>
            <p className="text-xs text-stone-500">
              Verified {review.source} review
            </p>
          </div>
        </div>
        {formattedDate ? (
          <time className="text-xs text-stone-500">{formattedDate}</time>
        ) : null}
      </div>

      <div className="mt-4">
        <RatingStars rating={review.rating} size={14} />
      </div>
      <p className="mt-3 text-sm leading-7 text-stone-700">
        {review.comment}
      </p>
      {review.productName && review.productSlug ? (
        <Link
          href={`/product/${review.productSlug}`}
          className="mt-3 inline-flex text-xs font-semibold text-[#173f4f] hover:underline"
        >
          Review for {review.productName}
        </Link>
      ) : null}
    </article>
  );
}

function ProductLoading() {
  return (
    <div className="container-app py-10 lg:py-14">
      <div className="animate-pulse lg:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.8fr)] lg:gap-14">
        <div className="aspect-square rounded-2xl bg-stone-200" />
        <div className="mt-8 space-y-5 lg:mt-0">
          <div className="h-8 w-2/3 rounded bg-stone-200" />
          <div className="h-12 rounded bg-stone-200" />
          <div className="h-24 rounded bg-stone-200" />
          <div className="h-12 rounded-full bg-stone-200" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [shopReviews, setShopReviews] = useState<ShopReview[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { toggle, has } = useWishlistStore();
  const { t } = useTranslation();

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${slug}`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (!cancelled && data.product) {
          const fetchedProduct = data.product as Product;
          setProduct(fetchedProduct);
          setReviews(data.reviews || []);
          setShopReviews(data.shopReviews || []);
          setRelated(data.relatedProducts || []);
          setSelectedImage(0);
          setSelectedSize("");
          setSelectedColor("");
        }
      } catch (error) {
        console.error("Product detail fetch failed:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <ProductLoading />;

  if (!product) {
    return (
      <div className="container-app py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-[#173f4f]">
          {t.product.notFound}
        </h1>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-[#173f4f] px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const purchaseOptions = getProductPurchaseOptions(product);
  const sizes = purchaseOptions.sizes;
  const fabrics = purchaseOptions.fabrics;
  const selectedSizeChoice = sizes.find(
    (choice) => choice.value === selectedSize
  );
  const selectedFabricChoice = fabrics.find(
    (choice) => choice.value === selectedColor
  );
  const inStock = product.totalStock > 0;
  const displayPrice = getChoicePrice(
    product.price,
    selectedSizeChoice,
    selectedFabricChoice
  );
  const displayCompareAtPrice = product.compareAtPrice
    ? getChoicePrice(
        product.compareAtPrice,
        selectedSizeChoice,
        selectedFabricChoice
      )
    : undefined;
  const discount = calculateDiscount(
    displayPrice,
    displayCompareAtPrice
  );
  const categoryName =
    typeof product.category === "string"
      ? product.subcategory || "Handcrafted textiles"
      : product.category?.name || "Handcrafted textiles";
  const sellerName = "BOHOBLOCKPRINTED";

  const sourceReviews: DisplayReview[] = (product.sourceReviews || []).map(
    (review) => ({
      ...review,
      key: `source-${review.sourceReviewId}`,
      source: "Etsy",
    })
  );
  const localReviews: DisplayReview[] = reviews.map((review) => ({
    sourceReviewId: review._id,
    userName: review.userName,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    key: `local-${review._id}`,
    source: "Bohoblockprinted",
  }));
  const itemReviews = [...sourceReviews, ...localReviews];
  const fallbackReviews: DisplayReview[] = shopReviews.map((review) => ({
    ...review,
    key: `shop-${review.sourceReviewId}`,
    source: "Etsy shop",
  }));
  const showingShopReviews = itemReviews.length === 0 && fallbackReviews.length > 0;
  const displayReviews = showingShopReviews ? fallbackReviews : itemReviews;
  const visibleRating =
    product.rating > 0
      ? product.rating
      : displayReviews.length
        ? displayReviews.reduce((sum, review) => sum + review.rating, 0) /
          displayReviews.length
        : 0;
  const visibleReviewCount = showingShopReviews
    ? displayReviews.length
    : product.reviewCount || displayReviews.length;
  const conciseDescription = getConciseProductDescription(product);
  const [descriptionPreview, descriptionRemainder] = splitDescription(
    conciseDescription
  );
  const relatedSearches = [categoryName, ...(product.tags || [])]
    .reduce<string[]>((searches, value) => {
      const label = value?.trim();
      const normalized = label?.toLocaleLowerCase() ?? "";

      if (
        !label ||
        normalized.startsWith("etsy:") ||
        normalized.startsWith("source:") ||
        normalized === "beachwearsindian" ||
        searches.some((search) => search.toLocaleLowerCase() === normalized)
      ) {
        return searches;
      }

      searches.push(label);
      return searches;
    }, [])
    .slice(0, 10);

  function handleAddToCart() {
    if (!product) return;

    if ((sizes.length && !selectedSize) || (fabrics.length && !selectedColor)) {
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      image: product.images[0],
      slug: product.slug,
      price: displayPrice,
      currency: product.currency || "INR",
      quantity,
      size: selectedSize || "One Size",
      color: selectedColor || "As Shown",
    });

    setAddedToCart(true);
    window.setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <div className="border-t border-stone-200 bg-[#fbfaf8]">
      <div className="container-app py-7 lg:py-10">
        <nav className="mb-7 flex flex-wrap items-center gap-2 text-xs text-stone-500 sm:text-sm">
          <Link href="/" className="hover:text-[#173f4f]">
            Homepage
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#173f4f]">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${
              typeof product.category === "string"
                ? product.category
                : product.category.slug
            }`}
            className="font-medium text-stone-700 hover:text-[#173f4f]"
          >
            {categoryName}
          </Link>
        </nav>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.8fr)] lg:gap-14 xl:gap-20">
          <div className="min-w-0 sm:grid sm:grid-cols-[74px_minmax(0,1fr)] sm:gap-4">
            <div className="order-1 mt-4 flex gap-3 overflow-x-auto pb-2 sm:order-none sm:mt-0 sm:max-h-[760px] sm:flex-col sm:overflow-y-auto sm:pr-1">
              {product.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-[74px] w-[62px] shrink-0 overflow-hidden rounded-lg border-2 bg-white transition sm:h-[84px] sm:w-full ${
                    selectedImage === index
                      ? "border-[#173f4f]"
                      : "border-transparent hover:border-stone-300"
                  }`}
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={selectedImage === index}
                >
                  <ProductImage
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="object-cover"
                    sizes="74px"
                  />
                </button>
              ))}
            </div>

            <div className="relative aspect-square min-w-0 overflow-hidden rounded-2xl bg-[#eeeae3] shadow-[0_18px_50px_rgba(40,35,30,0.08)]">
              <ProductImage
                src={product.images[selectedImage] || product.images[0]}
                alt={`${product.name} image ${selectedImage + 1}`}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />

              <button
                type="button"
                onClick={() => toggle(product._id)}
                className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-stone-800 shadow-lg backdrop-blur transition hover:scale-105"
                aria-label={
                  has(product._id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <Heart
                  size={22}
                  className={
                    has(product._id)
                      ? "fill-red-500 text-red-500"
                      : "text-stone-700"
                  }
                />
              </button>
            </div>
          </div>

          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            {product.totalStock > 0 && product.totalStock <= 8 ? (
              <p className="mb-2 text-sm font-semibold text-red-700">
                Only {product.totalStock} left
              </p>
            ) : null}

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-3xl font-bold text-[#173f4f]">
                {formatPrice(displayPrice, product.currency)}
              </span>
              {displayCompareAtPrice &&
              displayCompareAtPrice > displayPrice ? (
                <span className="text-base text-stone-500 line-through">
                  {formatPrice(displayCompareAtPrice, product.currency)}
                </span>
              ) : null}
            </div>

            {discount > 0 ? (
              <p className="mt-1 text-sm font-semibold text-[#4d7b2f]">
                {discount}% off
              </p>
            ) : null}

            <h1 className="mt-5 font-display text-2xl font-bold leading-tight text-stone-950 lg:text-[2rem]">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-semibold text-stone-950">{sellerName}</span>
              {visibleRating > 0 ? (
                <Link
                  href="#reviews"
                  className="inline-flex items-center gap-2 hover:text-[#173f4f]"
                >
                  <RatingStars rating={visibleRating} size={14} />
                  <span className="text-xs text-stone-600">
                    {showingShopReviews
                      ? `${visibleRating.toFixed(1)} shop reviews`
                      : `${visibleRating.toFixed(1)} (${visibleReviewCount})`}
                  </span>
                </Link>
              ) : null}
            </div>

            <div className="mt-5 space-y-2 text-sm text-stone-700">
              <p className="flex items-center gap-2">
                <MapPin size={17} className="text-[#315da8]" />
                Dispatched from India
              </p>
              <p className="flex items-center gap-2">
                <RotateCcw size={17} className="text-[#315da8]" />
                Returns and exchanges accepted
              </p>
            </div>

            <div className="mt-7 space-y-5">
              {sizes.length ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-stone-900">
                    Size
                  </span>
                  <span className="relative block">
                    <select
                      value={selectedSize}
                      onChange={(event) => setSelectedSize(event.target.value)}
                      className="h-13 w-full appearance-none rounded-xl border border-stone-400 bg-white px-4 pr-11 text-sm font-medium text-stone-900 outline-none transition focus:border-[#173f4f] focus:ring-2 focus:ring-[#173f4f]/15"
                    >
                      <option value="" disabled>
                        Select a size
                      </option>
                      {sizes.map((size) => (
                        <option key={size.value} value={size.value}>
                          {getChoiceLabel(
                            size,
                            fabrics,
                            product.price,
                            product.currency
                          )}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-600"
                    />
                  </span>
                </label>
              ) : null}

              {fabrics.length ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-stone-900">
                    Fabric / colour
                  </span>
                  <span className="relative block">
                    <select
                      value={selectedColor}
                      onChange={(event) => setSelectedColor(event.target.value)}
                      className="h-13 w-full appearance-none rounded-xl border border-stone-400 bg-white px-4 pr-11 text-sm font-medium text-stone-900 outline-none transition focus:border-[#173f4f] focus:ring-2 focus:ring-[#173f4f]/15"
                    >
                      <option value="" disabled>
                        Select a fabric
                      </option>
                      {fabrics.map((fabric) => (
                        <option key={fabric.value} value={fabric.value}>
                          {getChoiceLabel(
                            fabric,
                            sizes,
                            product.price,
                            product.currency
                          )}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-600"
                    />
                  </span>
                </label>
              ) : null}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-12 items-center rounded-full border border-stone-300 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="px-4 text-stone-700"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-7 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="px-4 text-stone-700"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock || !selectedSize || !selectedColor}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#2f2a35] px-6 text-sm font-bold text-white transition hover:bg-[#173f4f] disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                <ShoppingBag size={18} />
                {addedToCart
                  ? t.product.added
                  : !inStock
                    ? t.product.outOfStock
                    : !selectedSize || !selectedColor
                      ? "Select size & fabric"
                      : t.product.addToCart}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:items-start lg:gap-8">
          <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_16px_45px_rgba(40,35,30,0.06)]">
            <div className="border-b border-stone-200 bg-[#eef4f0] px-6 py-6 sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a620b]">
                Handmade product information
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-stone-950">
                Item details
              </h2>
            </div>

            <div className="p-6 sm:p-8">
              <h3 className="text-sm font-bold text-stone-950">Highlights</h3>
              <ul className="mt-4 grid gap-4 text-sm text-stone-700 sm:grid-cols-3">
                <li className="flex gap-3 rounded-xl bg-[#fbfaf7] p-4">
                  <Check size={18} className="mt-0.5 shrink-0 text-[#173f4f]" />
                  <span>Made by {sellerName}</span>
                </li>
                <li className="flex gap-3 rounded-xl bg-[#fbfaf7] p-4">
                  <PackageCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-[#173f4f]"
                  />
                  <span>Delivery from a small business in India</span>
                </li>
                <li className="flex gap-3 rounded-xl bg-[#fbfaf7] p-4">
                  <Leaf size={18} className="mt-0.5 shrink-0 text-[#173f4f]" />
                  <span>
                    Material: {product.material || "Cotton / natural textile"}
                  </span>
                </li>
              </ul>

              <div className="mt-8 border-t border-stone-200 pt-7">
                <p className="whitespace-pre-line text-sm leading-7 text-stone-700">
                  {descriptionPreview}
                </p>
                {descriptionRemainder ? (
                  <details className="group mt-5">
                    <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-[#173f4f]">
                      Read complete item details
                      <ChevronDown
                        size={17}
                        className="transition group-open:rotate-180"
                      />
                    </summary>
                    <p className="mt-5 whitespace-pre-line border-t border-stone-200 pt-5 text-sm leading-7 text-stone-700">
                      {descriptionRemainder}
                    </p>
                  </details>
                ) : null}
              </div>

              <details className="group mt-8 border-t border-stone-200 pt-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-stone-950">
                  Delivery and return policies
                  <ChevronDown
                    size={18}
                    className="transition group-open:rotate-180"
                  />
                </summary>
                <ul className="mt-5 grid gap-4 text-sm leading-6 text-stone-700 sm:grid-cols-3">
                  <li className="flex gap-3">
                    <Truck size={18} className="mt-0.5 shrink-0" />
                    Worldwide tracked delivery from India
                  </li>
                  <li className="flex gap-3">
                    <RotateCcw size={18} className="mt-0.5 shrink-0" />
                    Returns and exchanges accepted within the eligible return window
                  </li>
                  <li className="flex gap-3">
                    <ShieldCheck size={18} className="mt-0.5 shrink-0" />
                    Secure checkout and order support
                  </li>
                </ul>
              </details>
            </div>
          </article>

          <aside
            id="reviews"
            className="scroll-mt-28 rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_16px_45px_rgba(40,35,30,0.06)] sm:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a620b]">
              Verified customer feedback
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-stone-950">
              {showingShopReviews
                ? "Customer reviews from our Etsy shop"
                : "Reviews for this item"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              {showingShopReviews
                ? "This listing has no item-specific feedback yet, so we’re showing verified reviews from other products in our Etsy shop."
                : "Verified feedback for this product."}
            </p>

            {visibleRating > 0 ? (
              <div className="mt-6 flex items-center gap-5 rounded-xl bg-[#fbfaf7] p-5">
                <span className="font-display text-5xl font-bold text-[#2f2a35]">
                  {visibleRating.toFixed(1)}
                </span>
                <div>
                  <RatingStars rating={visibleRating} size={20} />
                  <p className="mt-2 text-xs text-stone-500">
                    {showingShopReviews
                      ? `${visibleReviewCount} verified shop reviews shown`
                      : `${visibleReviewCount} item reviews`}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-7 space-y-7">
              {displayReviews.length ? (
                displayReviews.slice(0, 3).map((review) => (
                  <ReviewCard key={review.key} review={review} />
                ))
              ) : (
                <div className="rounded-xl bg-[#fbfaf7] p-5 text-sm text-stone-600">
                  Customer reviews are being updated. Please check again shortly.
                </div>
              )}
            </div>
          </aside>
        </section>

        {related.length ? (
          <section className="mt-20 border-t border-stone-200 pt-14">
            <div className="mb-8 flex items-center justify-between gap-6">
              <h2 className="font-display text-3xl font-bold text-stone-950">
                You may also like
              </h2>
              <Link
                href="/shop"
                className="rounded-full border border-stone-700 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-[#173f4f] hover:text-white"
              >
                See more
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {related.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </section>
        ) : null}

        {relatedSearches.length ? (
          <section className="mt-20 border-t border-stone-200 pt-14">
            <h2 className="font-display text-3xl font-bold text-stone-950">
              Explore related searches
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {relatedSearches.map((search) => (
                <Link
                  key={search}
                  href={`/shop?search=${encodeURIComponent(search)}`}
                  className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-[#173f4f] hover:text-[#173f4f]"
                >
                  {search}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <Link
          href="/shop"
          className="mt-14 inline-flex items-center gap-2 text-sm font-semibold text-[#173f4f] hover:underline"
        >
          <ChevronLeft size={16} />
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
