import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { connectDB } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { BlogPost } from "@/models/BlogPost";
import { blogPostSchema } from "@/lib/blog-validation";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  try {
    const data = blogPostSchema.parse(await request.json());
    const { id } = await params;
    await connectDB();
    const existing = await BlogPost.findById(id);
    if (!existing) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    const slug = slugify(data.slug || data.title);
    if (await BlogPost.exists({ slug, _id: { $ne: id } })) return NextResponse.json({ error: "A post with this slug already exists" }, { status: 400 });
    const publishedAt = data.isPublished ? existing.publishedAt || new Date() : undefined;
    Object.assign(existing, { ...data, slug, publishedAt });
    await existing.save();
    revalidatePath("/blog"); revalidatePath(`/blog/${existing.slug}`); revalidatePath("/sitemap.xml");
    return NextResponse.json({ post: existing });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    console.error("Blog post update error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const { id } = await params;
  await connectDB();
  const post = await BlogPost.findByIdAndDelete(id);
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  revalidatePath("/blog"); revalidatePath("/sitemap.xml");
  return NextResponse.json({ message: "Post deleted" });
}
