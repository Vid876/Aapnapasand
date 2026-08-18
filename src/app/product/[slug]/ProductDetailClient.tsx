"use client";

import { useState } from "react";
import Link from "next/link";
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
import { ReviewForm } from "@/components/products/ReviewForm";
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

function getChoicePriceLabel(
  choice: PurchaseChoice,
  otherChoices: PurchaseChoice[],
  basePrice: number,
  currency: Product["currency"]
) {
  const range = getChoicePriceRange(basePrice, choice, otherChoices);
  return range.min === range.max
    ? formatPrice(range.min, currency)
    : `${formatPrice(range.min, currency)} - ${formatPrice(range.max, currency)}`;
}

type PurchaseOptionPickerProps = {
  label: string;
  placeholder: string;
  choices: PurchaseChoice[];
  otherChoices: PurchaseChoice[];
  value: string;
  basePrice: number;
  currency: Product["currency"];
  onChange: (value: string) => void;
};

function PurchaseOptionPicker({
  label,
  placeholder,
  choices,
  otherChoices,
  value,
  basePrice,
  currency,
  onChange,
}: PurchaseOptionPickerProps) {
  const selectedChoice = choices.find((choice) => choice.value === value);
  const selectedPrice = selectedChoice
    ? getChoicePriceLabel(selectedChoice, otherChoices, basePrice, currency)
    : null;

  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-stone-900">
        {label}
      </span>
      <details className="group relative">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 rounded-xl border border-stone-400 bg-white px-4 py-3 text-left outline-none transition focus-visible:border-[#173f4f] focus-visible:ring-2 focus-visible:ring-[#173f4f]/15 [&::-webkit-details-marker]:hidden">
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-stone-900">
              {selectedChoice?.name || placeholder}
            </span>
            {selectedChoice?.detail ? (
              <span className="mt-0.5 block line-clamp-2 text-xs leading-5 text-stone-500">
                {selectedChoice.detail}
              </span>
            ) : null}
          </span>
          <span className="flex shrink-0 items-center gap-2">
            {selectedPrice ? (
              <span className="hidden text-xs font-bold text-[#173f4f] sm:block">
                {selectedPrice}
              </span>
            ) : null}
            <ChevronDown
              size={18}
              className="text-stone-600 transition group-open:rotate-180"
            />
          </span>
        </summary>

        <div
          role="listbox"
          aria-label={label}
          className="absolute inset-x-0 top-full z-40 mt-2 max-h-80 overflow-y-auto rounded-xl border border-stone-200 bg-white p-2 shadow-2xl shadow-stone-950/15"
        >
          {choices.map((choice) => {
            const price = getChoicePriceLabel(
              choice,
              otherChoices,
              basePrice,
              currency
            );
            const isSelected = choice.value === value;

            return (
              <button
                key={choice.value}
                type="button"
                role="option"
                aria-label={getChoiceLabel(
                  choice,
                  otherChoices,
                  basePrice,
                  currency
                )}
                aria-selected={isSelected}
                onClick={(event) => {
                  onChange(choice.value);
                  event.currentTarget.closest("details")?.removeAttribute("open");
                }}
                className={`flex w-full items-start justify-between gap-4 rounded-lg px-3 py-3 text-left transition hover:bg-[#eef4f0] ${
                  isSelected ? "bg-[#eef4f0]" : ""
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-stone-900">
                    {choice.name}
                  </span>
                  {choice.detail ? (
                    <span className="mt-1 block text-xs leading-5 text-stone-500">
                      {choice.detail}
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 text-xs font-bold text-[#173f4f]">
                  {price}
                </span>
              </button>
            );
          })}
        </div>
      </details>
    </div>
  );
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

type ProductDetailClientProps = {
  initialProduct: Product;
  initialReviews: Review[];
  initialRelatedProducts: Product[];
};

export default function ProductDetailClient({
  initialProduct,
  initialReviews,
  initialRelatedProducts,
}: ProductDetailClientProps) {
  const product = initialProduct;
  const reviews = initialReviews;
  const related = initialRelatedProducts;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFabric, setSelectedFabric] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showMoreRelated, setShowMoreRelated] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { toggle, has } = useWishlistStore();
  const { t } = useTranslation();

  const purchaseOptions = getProductPurchaseOptions(product);
  const sizes = purchaseOptions.sizes;
  const fabrics = purchaseOptions.fabrics;
  const selectedSizeChoice = sizes.find(
    (choice) => choice.value === selectedSize
  );
  const selectedFabricChoice = fabrics.find(
    (choice) => choice.value === selectedFabric
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

  const sourceReviews: DisplayReview[] = (product.sourceReviews || [])
    .filter((review) => review.rating >= 3)
    .map(
    (review) => ({
      ...review,
      key: `source-${review.sourceReviewId}`,
      source: "Etsy",
    })
  );
  const localReviews: DisplayReview[] = reviews
    .filter((review) => review.rating >= 3)
    .map((review) => ({
    sourceReviewId: review._id,
    userName: review.userName,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    key: `local-${review._id}`,
    source: "Bohoblockprinted",
    }));
  const itemReviews = [...sourceReviews, ...localReviews];
  const displayReviews = itemReviews;
  const visibleRating = displayReviews.length
    ? displayReviews.reduce((sum, review) => sum + review.rating, 0) /
      displayReviews.length
    : product.rating >= 3
      ? product.rating
      : 0;
  const visibleReviewCount = displayReviews.length ||
    (product.rating >= 3 ? product.reviewCount : 0);
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
  const visibleRelatedProducts = showMoreRelated
    ? related
    : related.slice(0, 4);

  function handleAddToCart() {
    if (!product) return;

    if ((sizes.length && !selectedSize) || (fabrics.length && !selectedFabric)) {
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
      color:
        product.variants?.find(
          (variant) => variant.color && variant.color !== "As Shown"
        )?.color || "As Shown",
      fabric: selectedFabric || product.material || undefined,
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
                    alt={product.imageAltTexts?.[index] || `${product.name} thumbnail ${index + 1}`}
                    className="object-cover"
                    sizes="74px"
                  />
                </button>
              ))}
            </div>

            <div className="relative aspect-square min-w-0 overflow-hidden rounded-2xl bg-[#eeeae3] shadow-[0_18px_50px_rgba(40,35,30,0.08)]">
              <ProductImage
                src={product.images[selectedImage] || product.images[0]}
                alt={product.imageAltTexts?.[selectedImage] || `${product.name} image ${selectedImage + 1}`}
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
                    {`${visibleRating.toFixed(1)} (${visibleReviewCount})`}
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
                <PurchaseOptionPicker
                  label="Size"
                  placeholder="Select a size"
                  choices={sizes}
                  otherChoices={fabrics}
                  value={selectedSize}
                  basePrice={product.price}
                  currency={product.currency}
                  onChange={setSelectedSize}
                />
              ) : null}

              {fabrics.length ? (
                <PurchaseOptionPicker
                  label="Fabric"
                  placeholder="Select a fabric"
                  choices={fabrics}
                  otherChoices={sizes}
                  value={selectedFabric}
                  basePrice={product.price}
                  currency={product.currency}
                  onChange={setSelectedFabric}
                />
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
                disabled={
                  !inStock ||
                  (sizes.length > 0 && !selectedSize) ||
                  (fabrics.length > 0 && !selectedFabric)
                }
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#2f2a35] px-6 text-sm font-bold text-white transition hover:bg-[#173f4f] disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                <ShoppingBag size={18} />
                {addedToCart
                  ? t.product.added
                  : !inStock
                    ? t.product.outOfStock
                    : (sizes.length > 0 && !selectedSize) ||
                        (fabrics.length > 0 && !selectedFabric)
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
                {product.seoContent ? (
                  <div className="mt-6 whitespace-pre-line border-t border-stone-200 pt-6 text-sm leading-7 text-stone-700">
                    {product.seoContent}
                  </div>
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
              Reviews for this item
            </h2>
            {visibleRating > 0 ? (
              <div className="mt-6 flex items-center gap-5 rounded-xl bg-[#fbfaf7] p-5">
                <span className="font-display text-5xl font-bold text-[#2f2a35]">
                  {visibleRating.toFixed(1)}
                </span>
                <div>
                  <RatingStars rating={visibleRating} size={20} />
                  <p className="mt-2 text-xs text-stone-500">
                    {`${visibleReviewCount} item reviews`}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-7 space-y-7">
              {displayReviews.length ? (
                (showAllReviews ? displayReviews : displayReviews.slice(0, 3)).map((review) => (
                  <ReviewCard key={review.key} review={review} />
                ))
              ) : (
                <div className="rounded-xl bg-[#fbfaf7] p-5 text-sm text-stone-600">
                  No customer reviews for this item yet.
                </div>
              )}
            </div>

            {displayReviews.length > 3 ? (
              <button
                type="button"
                onClick={() => setShowAllReviews((current) => !current)}
                className="mt-6 text-sm font-bold text-[#173f4f] hover:underline"
              >
                {showAllReviews
                  ? "Show fewer reviews"
                  : `View all ${displayReviews.length} reviews`}
              </button>
            ) : null}

            <div className="mt-8 border-t border-stone-200 pt-7">
              <ReviewForm productId={product._id} />
            </div>
          </aside>
        </section>

        {related.length ? (
          <section className="mt-20 border-t border-stone-200 pt-14">
            <div className="mb-8 flex items-center justify-between gap-6">
              <h2 className="font-display text-3xl font-bold text-stone-950">
                You may also like
              </h2>
              {related.length > 4 ? (
                <button
                  type="button"
                  onClick={() => setShowMoreRelated((current) => !current)}
                  className="rounded-full border border-stone-700 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-[#173f4f] hover:text-white"
                >
                  {showMoreRelated ? "Show fewer" : "See more"}
                </button>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {visibleRelatedProducts.map((relatedProduct) => (
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
