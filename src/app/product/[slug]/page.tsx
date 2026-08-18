import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { BRAND } from "@/lib/brand";
import { getPublicProductPayload } from "@/lib/product-data";

type ProductPageProps = { params: Promise<{ slug: string }> };
const absoluteUrl = (value: string) => value.startsWith("http") ? value : `${BRAND.url}${value.startsWith("/") ? value : `/${value}`}`;
const plainText = (value: string) => value.replace(/\s+/g, " ").trim();

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPublicProductPayload(slug);
  if (!payload) return { title: "Product not found", robots: { index: false, follow: false } };
  const { product } = payload;
  const canonical = `/product/${product.slug}`;
  const description = product.metaDescription || product.shortDescription || plainText(product.description).slice(0, 170);
  const image = product.ogImage || product.images[0] || "/image.png";
  return {
    title: product.metaTitle || product.name,
    description,
    alternates: { canonical },
    robots: { index: product.isActive && !product.noIndex, follow: true, googleBot: { index: product.isActive && !product.noIndex, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: { type: "website", url: canonical, siteName: BRAND.name, title: product.metaTitle || product.name, description, images: [{ url: image, alt: product.imageAltTexts?.[0] || product.name }] },
    twitter: { card: "summary_large_image", title: product.metaTitle || product.name, description, images: [image] },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const payload = await getPublicProductPayload(slug);
  if (!payload) notFound();
  const { product, reviews, relatedProducts } = payload;
  const category = typeof product.category === "string" ? null : product.category;
  const productUrl = `${BRAND.url}/product/${product.slug}`;
  const publicReviews = [
    ...(product.sourceReviews || []).filter((review) => review.rating >= 3),
    ...reviews.filter((review) => review.rating >= 3),
  ];
  const ratingValue = publicReviews.length ? publicReviews.reduce((sum, review) => sum + review.rating, 0) / publicReviews.length : product.rating >= 3 ? product.rating : 0;
  const prices = [product.price, ...(product.variants || []).map((variant) => variant.price).filter((price): price is number => typeof price === "number")];
  const lowPrice = Math.min(...prices);
  const highPrice = Math.max(...prices);
  const offer = lowPrice === highPrice
    ? { "@type": "Offer", url: productUrl, priceCurrency: product.currency || "USD", price: lowPrice, availability: product.totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", itemCondition: "https://schema.org/NewCondition" }
    : { "@type": "AggregateOffer", url: productUrl, priceCurrency: product.currency || "USD", lowPrice, highPrice, offerCount: product.variants?.length || 1, availability: product.totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" };
  const productSchema: Record<string, unknown> = {
    "@context": "https://schema.org", "@type": "Product", "@id": `${productUrl}#product`, name: product.name,
    description: product.metaDescription || product.shortDescription || plainText(product.description).slice(0, 500),
    image: product.images.map(absoluteUrl), sku: product.variants?.[0]?.sku || product._id, brand: { "@type": "Brand", name: "BOHOBLOCKPRINTED" },
    category: category?.name || product.subcategory, material: product.material || product.variants?.[0]?.fabric, offers: offer,
  };
  if (ratingValue >= 3 && publicReviews.length) {
    productSchema.aggregateRating = { "@type": "AggregateRating", ratingValue: Number(ratingValue.toFixed(1)), reviewCount: publicReviews.length, bestRating: 5, worstRating: 1 };
    productSchema.review = publicReviews.slice(0, 20).map((review) => ({ "@type": "Review", author: { "@type": "Person", name: "userName" in review ? review.userName : "Customer" }, datePublished: review.createdAt, reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5, worstRating: 1 }, reviewBody: review.comment }));
  }
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: BRAND.url }, { "@type": "ListItem", position: 2, name: "Shop", item: `${BRAND.url}/shop` }, ...(category ? [{ "@type": "ListItem", position: 3, name: category.name, item: `${BRAND.url}/category/${category.slug}` }] : []), { "@type": "ListItem", position: category ? 4 : 3, name: product.name, item: productUrl }] };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([productSchema, breadcrumbSchema]).replace(/</g, "\\u003c") }} />
    <ProductDetailClient initialProduct={product} initialReviews={reviews} initialRelatedProducts={relatedProducts} />
  </>;
}
