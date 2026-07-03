import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { PRODUCT_IMAGE_FILTER } from "@/lib/image-utils";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const gender = searchParams.get("gender");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const size = searchParams.get("size");
    const color = searchParams.get("color");
    const sort = searchParams.get("sort") || "newest";
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const filter: Record<string, unknown> = {
      isActive: true,
      ...PRODUCT_IMAGE_FILTER,
    };

    if (category) {
      if (/^[0-9a-fA-F]{24}$/.test(category)) {
        filter.category = category;
      } else {
        const matchedCategory = await Category.findOne({ slug: category }).select("_id").lean();
        filter.category = matchedCategory?._id || category;
      }
    }
    if (gender) filter.gender = gender;
    if (featured === "true") filter.isFeatured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = parseInt(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = parseInt(maxPrice);
    }
    if (size) filter["variants.size"] = size;
    if (color) filter["variants.color"] = color;
    if (search) {
      filter.$text = { $search: search };
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    switch (sort) {
      case "price-asc":
        sortOption = { price: 1 };
        break;
      case "price-desc":
        sortOption = { price: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "popular":
        sortOption = { reviewCount: -1 };
        break;
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
