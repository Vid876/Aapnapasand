import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpenText } from "lucide-react";
import { CTASection, PageHero, PUBLIC_IMAGES, SectionHeader } from "@/components/marketing/PublicPage";
import { BLOG_POSTS } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Helpful BOHOBLOCKPRINTED articles about hand block printing, block print fabric, bandanas, quilted tote bags, bedding care, and decorating with block print textiles.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Block print journal"
        description="Useful articles for shoppers, makers, stylists, and wholesale buyers who want to understand hand block printing, textile care, and product use."
        image={PUBLIC_IMAGES.journal}
        primaryHref="/process"
        primaryLabel="Learn the Process"
        secondaryHref="/shop"
        secondaryLabel="Shop Textiles"
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="container-app">
          <SectionHeader
            align="center"
            title="People-first article topics"
            description="These topics match the brief and can grow into full articles with original photography and product links."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <article key={post.slug} className="overflow-hidden rounded-xl border border-stone-200 bg-[#fbfaf7] shadow-sm">
                <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-brand-50">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </Link>
                <div className="p-6">
                  <BookOpenText className="text-[#276070]" size={24} />
                  <h2 className="mt-5 text-xl font-semibold leading-snug text-stone-950">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-stone-600">{post.description}</p>
                  <div className="mt-5 border-t border-stone-200 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#276070]">
                      Keywords
                    </p>
                    <p className="mt-2 text-xs leading-5 text-stone-500">{post.keywords}</p>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#276070]"
                  >
                    Read topic <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
