import { connectDB } from "@/lib/db";
import { BLOG_POSTS } from "@/lib/brand";
import { BlogPost } from "@/models/BlogPost";

export type PublicBlogPost = {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageAlt: string;
  author: string;
  category?: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  relatedCategorySlug?: string;
  publishedAt?: string;
  updatedAt?: string;
};

function fallbackPosts(): PublicBlogPost[] {
  return BLOG_POSTS.map((post) => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.description,
    content: post.sections.join("\n\n"),
    featuredImage: post.image,
    imageAlt: post.title,
    author: "BOHOBLOCKPRINTED",
    tags: post.keywords.split(",").map((value) => value.trim()),
    metaTitle: post.title,
    metaDescription: post.description,
  }));
}

export async function getPublishedBlogPosts(): Promise<PublicBlogPost[]> {
  try {
    await connectDB();
    const posts = await BlogPost.find({ isPublished: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();
    if (!posts.length) return fallbackPosts();
    return JSON.parse(JSON.stringify(posts)) as PublicBlogPost[];
  } catch {
    return fallbackPosts();
  }
}

export async function getPublishedBlogPost(slug: string): Promise<PublicBlogPost | null> {
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug, isPublished: true }).lean();
    if (post) return JSON.parse(JSON.stringify(post)) as PublicBlogPost;
  } catch {
    // Static fallback remains available when the database is temporarily unavailable.
  }
  return fallbackPosts().find((post) => post.slug === slug) || null;
}
