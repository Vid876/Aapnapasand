import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpenText } from "lucide-react";
import { CTASection, PageHero, PUBLIC_IMAGES, SectionHeader } from "@/components/marketing/PublicPage";
import { getPublishedBlogPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Hand Block Print Journal & Textile Guides",
  description: "Original guides about Jaipur hand block printing, cotton and linen care, bedding sizes, styling, wholesale textiles, and artisan production.",
  alternates: { canonical: "/blog" },
  openGraph: { title: "BOHOBLOCKPRINTED Journal", description: "Practical hand block print and textile guides from Jaipur.", url: "/blog", images: [PUBLIC_IMAGES.journal] },
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  return <>
    <PageHero title="Block print journal" description="Useful, original guides for shoppers, makers, stylists, and wholesale buyers who want to understand hand block printing, textile care, and product use." image={PUBLIC_IMAGES.journal} primaryHref="/process" primaryLabel="Learn the Process" secondaryHref="/shop" secondaryLabel="Shop Textiles" />
    <section className="bg-white py-16 lg:py-24"><div className="container-app">
      <SectionHeader align="center" title="Textile guides from Jaipur" description="Experience-led articles connected to real products, materials, care instructions, and artisan processes." />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <article key={post.slug} className="overflow-hidden rounded-xl border border-stone-200 bg-[#fbfaf7] shadow-sm">
        <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-brand-50"><Image src={post.featuredImage} alt={post.imageAlt} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 hover:scale-105" /></Link>
        <div className="p-6"><BookOpenText className="text-[#276070]" size={24} /><p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-[#b87811]">{post.category || "Textile journal"}</p><h2 className="mt-2 font-display text-xl font-bold leading-snug text-stone-950"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p className="mt-3 text-sm leading-7 text-stone-600">{post.excerpt}</p><Link href={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#276070]">Read article <ArrowRight size={15} /></Link></div>
      </article>)}</div>
    </div></section><CTASection />
  </>;
}
