import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { requireAdmin } from "@/lib/admin";
import { deleteImagesIfUnused } from "@/lib/image-storage";
import { slugify } from "@/lib/utils";
import { isValidStoredImage } from "@/lib/image-utils";
import { Cart } from "@/models/Cart";
import { Review } from "@/models/Review";
import { User } from "@/models/User";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  shortDescription: z.string().optional(),
  price: z.number().min(0).optional(),
  compareAtPrice: z.number().min(0).optional().nullable(),
  currency: z.enum(["INR", "USD"]).optional(),
  images: z.array(z.string().refine(isValidStoredImage, "Invalid image URL")).min(1).optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  gender: z.enum(["men", "women", "kids", "unisex"]).optional(),
  brand: z.string().optional(),
  specifications: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  variants: z
    .array(
      z.object({
        size: z.string(),
        color: z.string(),
        colorHex: z.string().optional(),
        sku: z.string(),
        stock: z.number().min(0),
        price: z.number().optional(),
      })
    )
    .optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id).populate("category", "name slug").lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Admin product fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const data = updateSchema.parse(body);
    const { id } = await params;

    await connectDB();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const previousImages = [...product.images];

    if (data.name && data.name !== product.name) {
      product.slug = slugify(data.name);
    }

    Object.assign(product, data);

    if (data.variants) {
      product.totalStock = data.variants.reduce((sum, v) => sum + v.stock, 0);
    }

    await product.save();
    if (data.images) {
      const removedImages = previousImages.filter((image) => !data.images?.includes(image));
      await deleteImagesIfUnused(removedImages);
    }

    revalidateTag("products");
    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Admin product update error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { id } = await params;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const images = [...product.images];

    await Promise.all([
      Product.deleteOne({ _id: id }),
      Review.deleteMany({ product: id }),
      Cart.updateMany({}, { $pull: { items: { product: id } } }),
      User.updateMany({}, { $pull: { wishlist: id } }),
    ]);
    await deleteImagesIfUnused(images);

    revalidateTag("products");
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Admin product delete error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
