import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { connectDB } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { BlogPost } from "@/models/BlogPost";
import { blogPostSchema } from "@/lib/blog-validation";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  await connectDB();
  const posts = await BlogPost.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  try {
    const data = blogPostSchema.parse(await request.json());
    await connectDB();
    const slug = slugify(data.slug || data.title);
    if (await BlogPost.exists({ slug })) return NextResponse.json({ error: "A post with this slug already exists" }, { status: 400 });
    const post = await BlogPost.create({ ...data, slug, publishedAt: data.isPublished ? new Date() : undefined });
    revalidatePath("/blog"); revalidatePath(`/blog/${slug}`); revalidatePath("/sitemap.xml");
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    console.error("Blog post create error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
