import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { connectDB } from "@/lib/db";
import { deleteImagesIfUnused } from "@/lib/image-storage";
import { isValidStoredImage } from "@/lib/image-utils";
import { slugify } from "@/lib/utils";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

const categoryUpdateSchema = z.object({
  name: z.string().min(2, "Category name is required"),
  description: z.string().optional(),
  image: z.string().refine((value) => !value || isValidStoredImage(value), "Invalid image URL").optional(),
  gender: z.enum(["men", "women", "kids", "unisex"]),
  isActive: z.boolean(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const data = categoryUpdateSchema.parse(body);

    await connectDB();

    const slug = slugify(data.name);
    const existing = await Category.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      return NextResponse.json({ error: "Category with similar name exists" }, { status: 400 });
    }

    const previousCategory = await Category.findById(id);
    if (!previousCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const previousImage = previousCategory.image;
    const category = await Category.findByIdAndUpdate(id, { ...data, slug }, { new: true, runValidators: true });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (previousImage && previousImage !== data.image) {
      await deleteImagesIfUnused([previousImage]);
    }

    return NextResponse.json({ category });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Admin category update error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    await connectDB();
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json(
        { error: "Delete or move products in this category first." },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (category.image) {
      await deleteImagesIfUnused([category.image]);
    }

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Admin category delete error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
