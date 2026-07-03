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

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images[0],
      slug: product.slug,
      price: selectedVariant?.price || product.price,
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

        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{product.brand}</p>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900 mb-3">
            {product.name}
          </h1>

          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(selectedVariant?.price || product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <span className="text-sm font-semibold text-red-500">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product.shortDescription || product.description}
          </p>

          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">
                Color: <span className="font-normal">{selectedColor}</span>
              </h3>
              <div className="flex gap-2">
                {colors.map((color) => {
                  const variant = product.variants.find((v) => v.color === color);
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-brand-600 scale-110"
                          : "border-gray-200"
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
              <h3 className="text-sm font-semibold mb-3">
                Size: <span className="font-normal">{selectedSize}</span>
              </h3>
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
                      className={`min-w-[48px] px-4 py-2.5 text-sm border rounded-lg transition-colors ${
                        selectedSize === size
                          ? "bg-brand-900 text-white border-brand-900"
                          : available
                            ? "border-gray-300 hover:border-brand-600"
                            : "border-gray-200 text-gray-300 cursor-not-allowed line-through"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-50 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {inStock ? (
                <span className="text-green-600 font-medium">{t.product.inStock}</span>
              ) : (
                <span className="text-red-500 font-medium">{t.product.outOfStock}</span>
              )}
            </span>
          </div>

          <div className="flex gap-3 mb-8">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <ShoppingBag size={18} className="mr-2" />
              {addedToCart ? t.product.added : t.product.addToCart}
            </Button>
            <button
              onClick={() => toggle(product._id)}
              className="p-3.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Heart
                size={20}
                className={
                  has(product._id) ? "fill-red-500 text-red-500" : "text-gray-600"
                }
              />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-100">
            <div className="text-center">
              <Truck className="mx-auto mb-2 text-brand-600" size={20} />
              <p className="text-xs text-gray-600">{t.product.freeShipping}</p>
            </div>
            <div className="text-center">
              <RotateCcw className="mx-auto mb-2 text-brand-600" size={20} />
              <p className="text-xs text-gray-600">{t.product.returns}</p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto mb-2 text-brand-600" size={20} />
              <p className="text-xs text-gray-600">{t.product.authentic}</p>
            </div>
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
