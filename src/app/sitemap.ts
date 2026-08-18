import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { PRODUCT_IMAGE_FILTER } from "@/lib/image-utils";
import { BLOG_POSTS, BRAND, CATEGORY_GROUPS } from "@/lib/brand";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { BlogPost } from "@/models/BlogPost";

const BASE_URL = BRAND.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      images: [`${BASE_URL}/image.png`],
    },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/collections`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE_URL}/new-arrivals`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/sale`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.65 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/our-story`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/process`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/wholesale`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/shipping`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/returns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    ...CATEGORY_GROUPS.map((category) => ({
      url: `${BASE_URL}${category.href}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ];

  try {
    await connectDB();
    const [products, categories, databasePosts] = await Promise.all([
      Product.find({ isActive: true, noIndex: { $ne: true }, ...PRODUCT_IMAGE_FILTER }).select("slug images updatedAt").lean(),
      Category.find({ isActive: true, noIndex: { $ne: true } }).select("slug image updatedAt").lean(),
      BlogPost.find({ isPublished: true }).select("slug featuredImage updatedAt publishedAt").lean(),
    ]);

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${BASE_URL}/product/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
      images: product.images?.[0] ? [product.images[0].startsWith("http") ? product.images[0] : `${BASE_URL}${product.images[0]}`] : undefined,
    }));

    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${BASE_URL}/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly",
      priority: 0.75,
      images: category.image ? [category.image.startsWith("http") ? category.image : `${BASE_URL}${category.image}`] : undefined,
    }));

    const blogPages: MetadataRoute.Sitemap = (databasePosts.length ? databasePosts : BLOG_POSTS).map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: "updatedAt" in post ? post.updatedAt : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
      images: "featuredImage" in post && post.featuredImage ? [post.featuredImage.startsWith("http") ? post.featuredImage : `${BASE_URL}${post.featuredImage}`] : "image" in post ? [`${BASE_URL}${post.image}`] : undefined,
    }));

    return [...staticPages, ...categoryPages, ...blogPages, ...productPages];
  } catch {
    return [...staticPages, ...BLOG_POSTS.map((post) => ({ url: `${BASE_URL}/blog/${post.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.55 }))];
  }
}
