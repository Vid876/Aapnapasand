import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const isValidProductImage = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return value.startsWith("/uploads/");
  }
};

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  images: z.array(z.string().refine(isValidProductImage, "Invalid image URL")).min(1),
  category: z.string(),
  subcategory: z.string().optional(),
  gender: z.enum(["men", "women", "kids", "unisex"]),
  brand: z.string().optional(),
  specifications: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  variants: z.array(
    z.object({
      size: z.string(),
      color: z.string(),
      colorHex: z.string().optional(),
      sku: z.string(),
      stock: z.number().min(0),
      price: z.number().optional(),
    })
  ),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin products fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const data = productSchema.parse(body);

    await connectDB();

    const slug = slugify(data.name);
    const existing = await Product.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "Product with similar name exists" }, { status: 400 });
    }

    const totalStock = data.variants.reduce((sum, v) => sum + v.stock, 0);

    const product = await Product.create({
      ...data,
      slug,
      totalStock,
      rating: 0,
      reviewCount: 0,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Admin product create error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
