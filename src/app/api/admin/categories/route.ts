import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { ensureDefaultCategories } from "@/lib/category-sync";
import { connectDB } from "@/lib/db";
import { isValidStoredImage } from "@/lib/image-utils";
import { slugify } from "@/lib/utils";
import { Category } from "@/models/Category";

const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  description: z.string().optional(),
  image: z.string().refine((value) => !value || isValidStoredImage(value), "Invalid image URL").optional(),
  gender: z.enum(["men", "women", "kids", "unisex"]),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    await connectDB();
    await ensureDefaultCategories();

    const categories = await Category.find().sort({ name: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Admin categories fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const data = categorySchema.parse(body);

    await connectDB();

    const slug = slugify(data.name);
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "Category with similar name exists" }, { status: 400 });
    }

    const category = await Category.create({
      ...data,
      slug,
      isActive: data.isActive ?? true,
    });

    revalidateTag("categories");
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Admin category create error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
