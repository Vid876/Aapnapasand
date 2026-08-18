import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBlogPost extends Document {
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
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 320 },
    content: { type: String, required: true },
    featuredImage: { type: String, required: true },
    imageAlt: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true, default: "BOHOBLOCKPRINTED" },
    category: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    metaTitle: { type: String, trim: true, maxlength: 70 },
    metaDescription: { type: String, trim: true, maxlength: 180 },
    ogImage: { type: String },
    relatedCategorySlug: { type: String, trim: true, lowercase: true },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

BlogPostSchema.index({ isPublished: 1, publishedAt: -1 });
BlogPostSchema.index({ title: "text", excerpt: "text", content: "text", tags: "text" });

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
