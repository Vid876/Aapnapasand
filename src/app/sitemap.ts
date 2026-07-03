import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { PRODUCT_IMAGE_FILTER } from "@/lib/image-utils";
import { Product } from "@/models/Product";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    await connectDB();
    const products = await Product.find({ isActive: true, ...PRODUCT_IMAGE_FILTER }).select("slug updatedAt").lean();

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${BASE_URL}/product/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...productPages];
  } catch {
    return staticPages;
  }
}
