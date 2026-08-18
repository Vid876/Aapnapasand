import { z } from "zod";
import { isValidStoredImage } from "@/lib/image-utils";

export const blogPostSchema = z.object({
  title: z.string().min(4),
  slug: z.string().optional(),
  excerpt: z.string().min(20).max(320),
  content: z.string().min(80),
  featuredImage: z.string().refine(isValidStoredImage, "Invalid featured image"),
  imageAlt: z.string().min(5),
  author: z.string().min(2).default("BOHOBLOCKPRINTED"),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(180).optional(),
  ogImage: z.string().optional(),
  relatedCategorySlug: z.string().optional(),
  isPublished: z.boolean().default(false),
});
