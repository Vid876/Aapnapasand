"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Star,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RotateCcw,
  Shield,
  ChevronLeft,
  BadgePercent,
  CheckCircle2,
  Ruler,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductImage } from "@/components/products/ProductImage";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { ReviewForm } from "@/components/products/ReviewForm";
import { useTranslation } from "@/store/localeStore";

import type { Product, Review } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          setReviews(data.reviews || []);
          setRelated(data.relatedProducts || []);

          const sizes = [...new Set(data.product.variants.map((v: { size: string }) => v.size))];
          const colors = [...new Set(data.product.variants.map((v: { color: string }) => v.color))];
          if (sizes.length) setSelectedSize(sizes[0] as string);
          if (colors.length) setSelectedColor(colors[0] as string);
        }
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container-app py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
          <div className="aspect-[3/4] bg-gray-200 rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">{t.product.notFound}</h1>
        <Link href="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = [...new Set(product.variants.map((v) => v.color))];
  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );
  const inStock = selectedVariant ? selectedVariant.stock > 0 : product.totalStock > 0;
  const displayPrice = selectedVariant?.price || product.price;
  const offerCards = [
    {
      title: "WELCOME10",
      text: "Extra 10% off for new customers. Apply this coupon at checkout.",
    },
    {
      title: "Best Offer",
      text: "Selected styles include free shipping and limited period pricing.",
    },
  ];
  const trustPoints = [
    { icon: RotateCcw, label: "Free returns" },
    { icon: Truck, label: "Fast shipping" },
    { icon: CheckCircle2, label: "Best quality" },
    { icon: Shield, label: "Secure checkout" },
  ];
  const displayBrand =
    product.brand?.toUpperCase().includes("BOHOBLOCKPRINTED")
      ? product.brand
      : "BOHOBLOCKPRINTED";

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images[0],
      slug: product.slug,
      price: displayPrice,
      currency: product.currency || "INR",
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="container-app py-8 lg:py-12">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-6"
      >
        <ChevronLeft size={16} />
        {t.product.backToShop}
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-4">
            <ProductImage
              src={product.images[selectedImage]}
              alt={product.name}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-brand-600" : "border-transparent"
                  }`}
                >
                  <ProductImage src={img} alt={product.name} className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
            {displayBrand}
          </p>
          <h1 className="mb-3 font-display text-3xl font-bold leading-tight text-gray-950 lg:text-4xl">
            {product.name}
          </h1>

          {product.rating > 0 && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={
                      i < Math.round(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-600">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          <div className="mb-6 border-y border-gray-100 py-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-gray-950">
                {formatPrice(displayPrice, product.currency)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.compareAtPrice, product.currency)}
                  </span>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="mt-2 text-xs font-medium text-gray-500">
              Inclusive of all taxes. Shipping and coupon benefits are calculated at checkout.
            </p>
          </div>

          <p className="mb-7 text-sm leading-7 text-gray-600 sm:text-base">
            {product.shortDescription || product.description}
          </p>

          <div className="mb-7 rounded-xl border border-brand-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-950">
              <BadgePercent size={18} className="text-brand-600" />
              Best Offers
            </div>
            <div className="space-y-3">
              {offerCards.map((offer) => (
                <div key={offer.title} className="flex gap-3 rounded-lg bg-brand-50/70 p-3">
                  <Tag size={16} className="mt-0.5 shrink-0 text-brand-700" />
                  <div>
                    <p className="text-sm font-semibold text-brand-950">{offer.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-gray-600">{offer.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold">
                Color: <span className="font-normal">{selectedColor}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const variant = product.variants.find((v) => v.color === color);
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      aria-pressed={selectedColor === color}
                      className={`h-10 w-10 rounded-full border-2 ring-offset-2 transition-all ${
                        selectedColor === color
                          ? "border-white ring-2 ring-brand-700"
                          : "border-gray-200 hover:border-brand-500"
                      }`}
                      style={{ backgroundColor: variant?.colorHex || "#ccc" }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold">
                  Size: <span className="font-normal">{selectedSize}</span>
                </h3>
                <Link
                  href="/size-guide"
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-brand-700 hover:text-brand-950"
                >
                  <Ruler size={14} />
                  Size Chart
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const variant = product.variants.find(
                    (v) => v.size === size && v.color === selectedColor
                  );
                  const available = variant ? variant.stock > 0 : false;
                  return (
                    <button
                      key={size}
                      onClick={() => available && setSelectedSize(size)}
                      disabled={!available}
                      className={`min-w-[52px] rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                        selectedSize === size
                          ? "bg-brand-900 text-white border-brand-900"
                          : available
                            ? "border-gray-300 bg-white hover:border-brand-600"
                            : "border-gray-200 text-gray-300 cursor-not-allowed line-through"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-950">
                  <Ruler size={17} className="text-brand-700" />
                  Quick Size Chart
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs sm:grid-cols-6">
                  {sizes.slice(0, 6).map((size) => (
                    <div key={size} className="rounded-lg bg-white px-2 py-2 text-gray-700">
                      <span className="block font-semibold text-gray-950">{size}</span>
                      <span>Regular fit</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mb-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-lg border border-gray-300 bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 transition-colors hover:bg-gray-50"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="min-w-10 px-2 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 transition-colors hover:bg-gray-50"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {inStock ? (
                <span className="font-medium text-green-600">
                  {t.product.inStock}
                  {selectedVariant?.stock ? ` (${selectedVariant.stock} left)` : ""}
                </span>
              ) : (
                <span className="font-medium text-red-500">{t.product.outOfStock}</span>
              )}
            </span>
          </div>

          <div className="mb-8 grid gap-3 sm:grid-cols-[1fr_auto]">
            <Button
              size="lg"
              className="min-h-12"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <ShoppingBag size={18} className="mr-2" />
              {addedToCart ? t.product.added : t.product.addToCart}
            </Button>
            <button
              onClick={() => toggle(product._id)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
            >
              <Heart
                size={20}
                className={
                  has(product._id) ? "fill-red-500 text-red-500" : "text-gray-600"
                }
              />
              Wishlist
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 border-y border-gray-100 py-5 sm:grid-cols-4">
            {trustPoints.map((point) => (
              <div key={point.label} className="text-center">
                <point.icon className="mx-auto mb-2 text-brand-600" size={20} />
                <p className="text-xs font-medium text-gray-600">{point.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 space-y-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-900">
                Product Details
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">{product.description}</p>
            </div>
            {product.specifications && product.specifications.length > 0 && (
              <div className="grid gap-2 sm:grid-cols-2">
                {product.specifications.map((spec) => (
                  <div
                    key={spec}
                    className="flex items-start gap-2 rounded-lg bg-white px-3 py-2 text-sm text-gray-700"
                  >
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-600" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="mt-16 border-t border-gray-100 pt-12">
        <h2 className="text-2xl font-display font-bold mb-8">{t.product.reviews}</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <ReviewForm productId={product._id} />
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{review.userName}</span>
                  </div>
                  {review.title && <p className="font-medium mb-1">{review.title}</p>}
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16 border-t border-gray-100 pt-12">
          <h2 className="text-2xl font-display font-bold mb-8">{t.product.related}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
