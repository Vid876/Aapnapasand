import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CTASection, PageHero } from "@/components/marketing/PublicPage";
import { getPublishedBlogPost, getPublishedBlogPosts } from "@/lib/blog-data";
import { BRAND } from "@/lib/brand";

type BlogPostPageProps = { params: Promise<{ slug: string }> };
const absolute = (value: string) => value.startsWith("http") ? value : `${BRAND.url}${value.startsWith("/") ? value : `/${value}`}`;

export async function generateStaticParams() {
  return (await getPublishedBlogPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) return { title: "Article not found", robots: { index: false, follow: false } };
  const canonical = `/blog/${post.slug}`;
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical },
    openGraph: { type: "article", url: canonical, title: post.metaTitle || post.title, description: post.metaDescription || post.excerpt, images: [{ url: post.ogImage || post.featuredImage, alt: post.imageAlt }], publishedTime: post.publishedAt, modifiedTime: post.updatedAt, authors: [post.author] },
    twitter: { card: "summary_large_image", title: post.metaTitle || post.title, description: post.metaDescription || post.excerpt, images: [post.ogImage || post.featuredImage] },
  };
}

function ArticleContent({ content }: { content: string }) {
  return <div className="space-y-6 text-[16px] leading-8 text-stone-700">{content.split(/\n\s*\n/).map((block, index) => {
    const text = block.trim(); if (!text) return null;
    if (text.startsWith("## ")) return <h2 key={index} className="pt-6 font-display text-3xl font-bold leading-tight text-stone-950">{text.slice(3)}</h2>;
    if (text.startsWith("### ")) return <h3 key={index} className="pt-3 text-xl font-bold text-stone-950">{text.slice(4)}</h3>;
    return <p key={index}>{text}</p>;
  })}</div>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) notFound();
  const canonical = `${BRAND.url}/blog/${post.slug}`;
  const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.excerpt, image: [absolute(post.featuredImage)], author: { "@type": "Organization", name: post.author }, publisher: { "@type": "Organization", name: BRAND.name, logo: { "@type": "ImageObject", url: `${BRAND.url}/Logo.png` } }, datePublished: post.publishedAt || post.updatedAt, dateModified: post.updatedAt || post.publishedAt, mainEntityOfPage: canonical };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: BRAND.url }, { "@type": "ListItem", position: 2, name: "Blog", item: `${BRAND.url}/blog` }, { "@type": "ListItem", position: 3, name: post.title, item: canonical }] };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, breadcrumbSchema]).replace(/</g, "\\u003c") }} />
    <PageHero title={post.title} description={post.excerpt} image={post.featuredImage} primaryHref={post.relatedCategorySlug ? `/category/${post.relatedCategorySlug}` : "/shop"} primaryLabel="Shop Related" secondaryHref="/blog" secondaryLabel="All Articles" />
    <article className="bg-white py-16 lg:py-24"><div className="container-app max-w-4xl">
      <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#276070]"><ArrowLeft size={15} /> Back to journal</Link>
      <div className="mb-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-stone-200 py-4 text-xs text-stone-500"><span>By {post.author}</span>{post.publishedAt ? <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time> : null}<span>{post.category || "Textile guide"}</span></div>
      <ArticleContent content={post.content} />
      <div className="mt-12 rounded-2xl bg-[#eef4f0] p-7 sm:flex sm:items-center sm:justify-between sm:gap-6"><div><h2 className="font-display text-2xl font-bold text-stone-950">Explore the textiles in this guide</h2><p className="mt-2 text-sm leading-7 text-stone-600">Shop artisan-made pieces and review the material, size, care, and delivery details.</p></div><Link href={post.relatedCategorySlug ? `/category/${post.relatedCategorySlug}` : "/shop"} className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#173f4f] px-5 py-3 text-sm font-semibold text-white sm:mt-0">Shop related <ArrowRight size={15} /></Link></div>
    </div></article><CTASection />
  </>;
}
