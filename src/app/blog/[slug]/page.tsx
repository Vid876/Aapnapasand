import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { CTASection, PageHero } from "@/components/marketing/PublicPage";
import { BLOG_POSTS } from "@/lib/brand";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function getPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <PageHero
        title={post.title}
        description={post.description}
        image={post.image}
        primaryHref="/shop"
        primaryLabel="Shop Related"
        secondaryHref="/blog"
        secondaryLabel="All Articles"
      />

      <article className="bg-white py-16 lg:py-24">
        <div className="container-app max-w-4xl">
          <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#276070]">
            <ArrowLeft size={15} />
            Back to blog
          </Link>

          <div className="rounded-xl bg-[#eef4f0] p-6 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#276070]">
              Article outline
            </p>
            <div className="mt-6 space-y-5">
              {post.sections.map((section) => (
                <p key={section} className="flex gap-3 text-base leading-8 text-stone-700">
                  <CheckCircle2 className="mt-1 shrink-0 text-[#276070]" size={18} />
                  <span>{section}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-4 rounded-xl border border-stone-200 p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold text-stone-950">
                Turn this topic into a full article
              </h2>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Add original photography, process details, and links to related products before publishing for SEO.
              </p>
            </div>
            <Link
              href="/process"
              className="inline-flex items-center gap-2 rounded-lg bg-[#173f4f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#245d70]"
            >
              See Process <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </article>

      <CTASection />
    </>
  );
}
