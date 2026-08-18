import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { BRAND } from "@/lib/brand";
import { getCanonicalCategorySlug } from "@/lib/category-aliases";
import { connectDB } from "@/lib/db";
import { PRODUCT_IMAGE_FILTER } from "@/lib/image-utils";
import { toPublicProductRating } from "@/lib/public-rating";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import type { Category as CategoryType, Product as ProductType } from "@/types";

type CategoryPageProps = { params: Promise<{ slug: string }> };
type CategoryPayload = { category: CategoryType; products: ProductType[]; total: number };

async function loadCategory(slug: string): Promise<CategoryPayload | null> {
  await connectDB();
  const category = await Category.findOne({ slug, isActive: true }).lean();
  if (!category) return null;
  const [products, total] = await Promise.all([
    Product.find({ category: category._id, isActive: true, ...PRODUCT_IMAGE_FILTER }).populate("category", "name slug").sort({ isFeatured: -1, reviewCount: -1, createdAt: -1 }).limit(24).lean(),
    Product.countDocuments({ category: category._id, isActive: true, ...PRODUCT_IMAGE_FILTER }),
  ]);
  return JSON.parse(JSON.stringify({ category, products: products.map((product) => toPublicProductRating(product)), total })) as CategoryPayload;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = getCanonicalCategorySlug(slug);
  const payload = await loadCategory(canonicalSlug);
  if (!payload) return { title: "Collection not found", robots: { index: false, follow: false } };
  const { category } = payload;
  const title = category.metaTitle || `${category.name} - Hand Block Printed Collection`;
  const description = category.metaDescription || category.description || `Shop ${category.name.toLowerCase()} handcrafted by BOHOBLOCKPRINTED artisans in Jaipur, India.`;
  return {
    title, description,
    alternates: { canonical: `/category/${category.slug}` },
    robots: { index: !category.noIndex, follow: true },
    openGraph: { type: "website", url: `/category/${category.slug}`, title, description, images: [{ url: category.ogImage || category.image || "/image.png", alt: category.imageAlt || `${category.name} collection` }] },
    twitter: { card: "summary_large_image", title, description, images: [category.ogImage || category.image || "/image.png"] },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const canonicalSlug = getCanonicalCategorySlug(slug);
  if (canonicalSlug !== slug) redirect(`/category/${canonicalSlug}`);
  const payload = await loadCategory(canonicalSlug);
  if (!payload) notFound();
  const { category, products, total } = payload;
  const categoryUrl = `${BRAND.url}/category/${category.slug}`;
  const schemas = [
    { "@context": "https://schema.org", "@type": "CollectionPage", "@id": categoryUrl, name: category.name, description: category.metaDescription || category.description, url: categoryUrl, primaryImageOfPage: category.image ? { "@type": "ImageObject", url: category.image.startsWith("http") ? category.image : `${BRAND.url}${category.image}` } : undefined, mainEntity: { "@type": "ItemList", numberOfItems: total, itemListElement: products.map((product, index) => ({ "@type": "ListItem", position: index + 1, url: `${BRAND.url}/product/${product.slug}`, name: product.name })) } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: BRAND.url }, { "@type": "ListItem", position: 2, name: "Shop", item: `${BRAND.url}/shop` }, { "@type": "ListItem", position: 3, name: category.name, item: categoryUrl }] },
  ];
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }} />
    <section className="border-b border-[#e3ded4] bg-[#f7f3eb] py-10 lg:py-14"><div className="container-app grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
      <div><nav className="text-xs text-stone-500"><Link href="/">Home</Link> <span className="mx-2">/</span><Link href="/shop">Shop</Link><span className="mx-2">/</span>{category.name}</nav><p className="mt-8 text-xs font-bold uppercase tracking-[.22em] text-[#b87811]">Artisan collection</p><h1 className="mt-3 font-display text-4xl font-bold leading-tight text-stone-950 sm:text-5xl">{category.name}</h1><p className="mt-4 max-w-3xl text-base leading-8 text-stone-600">{category.description || `Explore our handmade ${category.name.toLowerCase()} collection, created and finished by skilled artisans in Jaipur.`}</p><p className="mt-4 text-sm font-semibold text-[#173f4f]">{total} products available</p></div>
      {category.image ? <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100 shadow-xl"><Image src={category.image} alt={category.imageAlt || `${category.name} hand block printed collection`} fill sizes="(max-width:1024px) 100vw, 360px" className="object-cover" priority /></div> : null}
    </div></section>
    <section className="bg-white py-12 lg:py-16"><div className="container-app">
      {products.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">{products.map((product, index) => <ProductCard key={product._id} product={product} priority={index < 4} />)}</div> : <div className="rounded-2xl bg-[#fbfaf7] px-6 py-16 text-center text-stone-600">Products are being prepared for this collection.</div>}
      {total > products.length ? <div className="mt-10 text-center"><Link href={`/shop?category=${category.slug}`} className="inline-flex items-center gap-2 rounded-full bg-[#173f4f] px-6 py-3 text-sm font-semibold text-white">View all {total} products <ArrowRight size={16} /></Link></div> : null}
      {category.seoContent ? <article className="mx-auto mt-16 max-w-4xl whitespace-pre-line border-t border-stone-200 pt-12 text-[15px] leading-8 text-stone-700"><h2 className="mb-5 font-display text-3xl font-bold text-stone-950">About our {category.name}</h2>{category.seoContent}</article> : null}
    </div></section>
  </>;
}
